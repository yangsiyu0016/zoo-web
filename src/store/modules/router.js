import {asyncRouterMap,commontRouterMap} from "@/router";
export function filterAsyncRoutes(routes){
    const res=[];
    routes.forEach(route=>{
        const tmp = {...route}
        if(tmp.children){
            tmp.children =filterAsyncRoutes(tmp.children)
        }
        res.push(tmp);
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
        GenerateRoutes({commit}){
            return new Promise(resolve => {

                let accessedRoutes = filterAsyncRoutes(asyncRouterMap);
                commit("SET_ROUTES",accessedRoutes);
                resolve();


            })
        }
    }
}
export default router;