import * as  cacheType from "./constant"

/**
 * @description: 
 * @param {*} state 状态存储
 * @param {*}
 * @return {*}
 */


type ActionType = {
    type: string,
    payload: {
        name: string,
        reactElement: any,
        path: any,
        state?: any,
        position?: any
    },
    children: null,
    position?: {
        x: null,
        y: null,
        scrollId: ''
    }
}

function cacheReducer(state: Object, action: ActionType) {
    let payload = action.payload

    switch (action.type) {
        // 这里是要创建一个新的缓存
        case cacheType.CREATE:
            return {
                ...state,
                [payload.name]: {
                    name: payload.name,
                    reactElement: payload.reactElement, //渲染的虚拟dom
                    state: cacheType.CREATE, //缓存的状态是创建中,
                    children: null,
                    path: payload.path
                }
            }
        case cacheType.CREATED:
            return {
                ...state,
                [payload.name]: {
                    ...payload,
                    state: cacheType.CREATED
                }
            }
        default:
            return state
    }
}


export default cacheReducer

