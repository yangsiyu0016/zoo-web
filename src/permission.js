import router from "./router/index";
import {getRequest} from "@/utils/api";
import store from "./store";
//const whiteList = ["/login"];//不重定向白名单

router.beforeEach((to,from,next)=>{
    if(to.path=="/login"){
        next();
        return;
    }
    getRequest("/verify").then((resp)=>{
        if(resp&&resp.status==200){
            store.dispatch("GenerateRoutes").then(()=>{
                router.addRoutes(store.getters.getaddRouters);
            })
            next();
        }else{
            next({path:'/login'});
        }
    })
})