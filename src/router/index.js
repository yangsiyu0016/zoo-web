import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

import Layout from "@/views/layout/Layout";

//如首页和登录页和一些不用权限的公用页面
export const commontRouterMap = [{
    path: "/login",
    hidden: true, //不在slider显示
    component: () =>
        import("@/views/login/index")
},
{
    path: "/",
    component: Layout,
    redirect: "/home",
    name: "Home",
    hidden: true,
    children: [{
        path: "home",
        component: () =>
            import("@/views/Home")
    }]
}
];


//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [{
    path: "/home",
    component: Layout,
    meta: { title: "首页", icon: "el-icon-menu" }
}, {
    path:"/task",
    component:Layout,
    meta:{title:'待办任务',icon:'el-icon-tickets'},
    children:[{
        path:'purchaseTask',
        name:'purchaseTask',
        component:()=>import("@/views/oa/task/PurchaseTask"),
        meta:{title:"采购待办"}
    },{
        path:'oiTask',
        name:'oiTask',
        component:()=>import("@/views/oa/task/OpeningInventoryTask"),
        meta:{title:"期初待办"}
    }]
},
{
    path:"/erp",
    component:Layout,
    name:'erp',
    meta:{title:'ERP',icon:'el-icon-tickets'},
    children:[{
        path:"queryStock",
        name:"queryStock",
        component:()=>import("@/views/erp/stock/Stock"),
        meta:{title:'库存查询'}
    },{
        path:"stock",
        name:"stock",
        component:()=>import("@/views/erp/stock/index"),
        meta:{title:"库存管理"},
        children: [{
            path:"oi",
            name:"oi",
            component:()=>import("@/views/erp/stock/oi/index"),
            meta:{title:"期初单据"}
        },{
            path:"warehouse",
            name:"warehouse",
            component:()=>import("@/views/erp/stock/warehouse/index"),
            meta:{title:"仓库设置"}
        }]
    },{
        path:'order',
        name:'order',
        component:()=>import("@/views/erp/order/index"),
        meta:{title:'订单查看'},
        children:[{
            path:"allpurchase",
            name:"allpurchase",
            component:()=>import("@/views/erp/order/AllPurchase"),
            meta:{title:'采购订单'}
        },{
            path: "allSell",
            name: "allSell",
            component:()=>import("@/views/erp/order/AllSell"),
            meta: {title: '销售订单'}
        }]
    },{
        path:"purchase",
        name:"purchase",
        component:()=> import("@/views/erp/purchase/index"),
        meta:{title:"采购管理"},
        children:[{
            path:"list",
            name:"list",
            component:()=>import("@/views/erp/purchase/List"),
            meta:{title:"采购订单"}
        },{
            path:"supplier",
            name:"supplier",
            component:()=>import("@/views/erp/purchase/Supplier"),
            meta:{title:"供应商管理"}
        }]
    },{
        path:"sell",
        name:"sell",
        component:()=> import("@/views/erp/sell/index"),
        meta:{title:"销售管理"},
        children:[{
            path:'list',
            name:"list",
            component:()=>import("@/views/erp/sell/List"),
            meta:{title:"销售订单"}
        },{
            path:"customer",
            name:"customer",
            component:()=>import("@/views/erp/sell/Customer"),
            meta:{title:"客户管理"}
        }]
    },{
        path:'product',
        name:'product',
        component:()=>import("@/views/erp/product/index"),
        meta:{title:"产品管理"},
        children:[{
            path:'productList',
            name:'productList',
            component:()=>import("@/views/erp/product/List"),
            meta:{title:"产品列表"}
        },{
            path:'type',
            name:'type',
            component:()=>import("@/views/erp/product/type/Tree"),
            meta:{title:"分类管理"}
        },{
            path:'brand',
            name:'brand',
            component:()=>import("@/views/erp/product/brand/index"),
            meta:{title:"品牌管理"}
        },{
            path:'spec',
            name:'spec',
            component:()=>import("@/views/erp/product/spec/index"),
            meta:{title:"规格参数"}
        }]
    }]
},
{
    path: "/system",
    component: Layout,
    //redirect: "/system/Menu",
    name: "system",
    meta: { title: "系统管理", icon: "el-icon-tickets"},
    children: [{
        path:"rbac",
        name:"rbac",
        component:()=> import("@/views/system/rbac/index"),
        meta:{title:'组织机构'},
        children: [{
            path: 'user',
            name: 'user',
            component: () => import("@/views/system/rbac/User"),
            meta: {title: "用户管理"}
        },{
            path:'position',
            name:'position',
            component:()=>import("@/views/system/rbac/Position"),
            meta:{title:"职位管理"}
        }]
    },{
        path: "menu",
        name: "menu",
        component: () =>
            import("@/views/system/Menu"),
        meta: { title: "菜单管理"},
    },{
        path:'flow',
        name:'flow',
        component:()=>import("@/views/system/flow/index"),
        meta:{title:"流程管理"}
    },{
        path:"base",
        name:"base",
        component:()=>import("@/views/system/base/index"),
        meta:{title:"基本设置"},
        children: [{
            path:'logistics',
            name:'logistics',
            component:()=>import("@/views/system/base/Logistics"),
            meta:{title:"物流信息管理"}
        },{
            path:'area',
            name:"area",
            component:()=>import("@/views/system/base/Area"),
            meta:{title:"区域管理"}
        }]
    }]
}
];
//实例化vue的时候只挂载commontRouterMap
const createRouter=()=>new Router({
    scrollBehavior:()=>({y:0}),
    routes:commontRouterMap
})
const router =createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher;
}

export default router;