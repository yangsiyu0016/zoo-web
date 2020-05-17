import {asyncRouterMap,commontRouterMap} from "@/router";
function hasPermission(allowPath,route){

    //console.log(allowPath instanceof  Array)

    let flag = false;
    if(allowPath){
        if(allowPath instanceof  Array){
            allowPath.forEach((item)=>{
                if(item==route.path){
                    flag = true;
                }
            })
        }else{
            let allowPathArray = allowPath.split(",");
            allowPathArray.forEach((item)=>{
                if(item==route.path){
                    flag = true;
                }
            })
        }

    }else{
        flag = false;
    }

    return flag;

}
export function filterAsyncRoutes(routes,allowPath){

    const res=[];
    routes.forEach(route=>{
        const tmp = {...route}
        if(hasPermission(allowPath,tmp)){
            if(tmp.children){
                tmp.children =filterAsyncRoutes(tmp.children,allowPath)
            }
            res.push(tmp);
        }
    })
    return res;
}
const router={
    state:{
        routers:commontRouterMap,
        addRouters:[]
    },
    mutations:{
        SET_ROUTES:(state,routers)=>{
            state.addRouters=routers;
            state.routers = commontRouterMap.concat(routers);
        }
    },
    getters:{
        getaddRouters:state=>state.addRouters,
        getrouters:state=>state.routers
    },
    actions:{
        GenerateRoutes({commit},data){
            return new Promise(resolve => {
                const allowPath = data;
                let accessedRoutes = filterAsyncRoutes(asyncRouterMap,allowPath);
                commit("SET_ROUTES",accessedRoutes);
                resolve();


            })
        }
    }
}
export default router;