<center><h2>Router-keep-live</h2></center>

​	

<center><h3>
    非官方的路由缓存器,只支持v6版本的路由缓存React 16.8以上的hooks编写.支持滚动条缓存，支持2个生命周期函数
    </h3></center>

```tsx
import KeepLive from "xxxx/keep-livek-copments/index.tsx"
import {useRoutes} from "react-router"
import Test from "xxx";

const routes =[
    {
        path:'/text',
        element:<Test/>,
        name:'test' // 缓存路由的唯一标识
    }
]

	
function App(){
    const element = useRoutes()
    
    const include = ['test'] //需要缓存的唯一标识 
    
    
    return <div id="app">
    	<KeepLive include={include}>
        	{
                element
            }
        </KeepLive>
    </div>
}


```

```tsx
const Test = ()=>{
    //缓存在激活的时候触发
    Test.activate = (position:Object)=>{
       	//position 是 滚动条的位置 x y chil 真实元素的dom节点 	
       
    }
    
    Test.scrollId = "#app" //记录需要滚动的dom 元素名称
    
    
    //组件离开时
    Test.inactivation = ()=>{
        
    }
}
```

