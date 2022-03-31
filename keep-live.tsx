import { useCallback, useReducer, useContext, useEffect, useRef, useState } from "react"
import cacheReducer from "./cacheReducer"
import CacheContext from "./CacheContext"
import * as cacheType from "./constant"

type KeepAliveProps = {
    // 指定缓存路由页面的名称必须以一个数组的形式来缓存唯一标识
    include: Array<string>,
    children:any,
}

interface CurrentPostsType {
    x?: number,
    y?: number,
    child?:HTMLDivElement
}


// 路由缓存的管理
function KeepAliveProvider({include ,children }: KeepAliveProps) {
    // cacheState存放所有的缓存信息dispatch派发动作方法，可以通过派发动作修改存储信息
    let [cacheState, dispatch] = useReducer(cacheReducer, {}) as any

    const currentPosts = useRef<CurrentPostsType>({})

    let name = children.props.value.matches[0].route.name

    // 创建的时候
    const create = useCallback(({ name, reactElement}) => {
        dispatch({type:cacheType.CREATE,payload:{name,reactElement}})
    }, [])
    
    // 创建完成
    const created = useCallback((name,elem,cacheState) => {
        dispatch({ type: cacheType.CREATED, payload: { name, ...cacheState, children: elem } })
    }, [])

    
    return <CacheContext.Provider value={{cacheState, dispatch,create,children,include,created,name,currentPosts}}>
        <RenderComponent></RenderComponent>
        <CreatedElement></CreatedElement>
    </CacheContext.Provider>
}



/**
 * @description: 这里主要根据是否要渲染的函数来进行返回
 * @return {*} JSX.Element
 */
function RenderComponent():JSX.Element {
    const { children, include,name } = useContext(CacheContext) as any
    
    if (include.indexOf(name) !== -1) {
        // 缓存的节点
        return <WrappedComponent></WrappedComponent>
    }

    return children
}

/**
 * @description: 这个函数主要是处理需要缓存的页面 
 * @return {*}
 */
function WrappedComponent() {
    const { children, cacheState, create, name ,currentPosts} = useContext(CacheContext) as any

    // 定义一个指针来指向上一个事件 不然他会不断更新
    const loadName = useRef<string | null>(null)

    const keep = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!cacheState[name]) {
            create({
                name,
                reactElement: children
            })
        }

        if (
            keep.current &&
            cacheState[name] &&
            cacheState[name].children instanceof Array &&
            cacheState[name].children.length > 0
        ) {

            // 如果里面没有节点说明是第一次渲染
            if (keep.current?.children && keep.current?.children.length > 0) {
                // 标识用来给路由做一个离开的处理然后执行生命周期函数
                loadName.current = keep.current.children[0].pathName;

                let val = loadName.current!

                const leavFun = cacheState[val].reactElement?.props?.children?.type;

                const position = getPositions(leavFun.scrollId);

                if (position !== null) {
                    currentPosts.current[val] = position;
                }

                // 执行失活事件
                leavFun.inactivation && leavFun.inactivation(cacheState[val]);
                // 需要把上一个路由的节点
                [...keep.current?.children].forEach((child: any) => keep.current?.removeChild(child));
            }
            
            cacheState[name].children.forEach((child: HTMLDivElement) => keep.current!.appendChild(child))
            
            const acitiveFun = cacheState[name].reactElement?.props?.children?.type;

            acitiveFun.activate && acitiveFun.activate(currentPosts.current[name]);
        }
    },[cacheState,name])

    return <div className={`keep-alive-${name}`} style={{height:'100%'}} ref={keep}></div>
}
/**
 * @description:这个函数就是把虚拟dom转成真实dom 然后交给 WrappedComponent 函数进行挂载
 * @return {*}
 */
function CreatedElement() {
    const { cacheState, created, name,include } = useContext(CacheContext) as any
    
    return <div className="keep-alive-list" style={{ display: 'none' }}>
        {
            Object.keys(cacheState).map((el, index) => {
                let { reactElement,children,state } = cacheState[el] instanceof Object ? cacheState[el] : {reactElement:null,state:null,children:null}

                return <div key={index} ref={(currentNode) => {
                    // 如果当前currentNode存在
                    if (currentNode && children == null && state == cacheType.CREATE  ) {
                        let elem = [...currentNode.children] as any[];
                        // 生成dom元素
                        elem[0].pathName = name;
                        created(el, elem, cacheState[el])
                    }
                }}>
                    { reactElement }
                </div>
            })
        }
    </div>
}


function getPositions(name:string) {
    let node = document.querySelector(name);

    if (node == null) return null;
    
    return {
        x: 0,
        y: node.scrollTop,
        child:node
    }
}

export default KeepAliveProvider