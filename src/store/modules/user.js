const user={
    state:{
        user:{
            realName:window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).realName
        },
        allowPath:window.localStorage.getItem("allowPath")
    },
    mutations:{
        SET_USER(state,user){
            state.user=user;
            window.localStorage.setItem('user',JSON.stringify(user))
        },
        SET_ALLOWPATH(state,allowPath){
          state.allowPath=allowPath;
            window.localStorage.setItem('allowPath',allowPath)
        },
        LOGOUT(state){
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('allowPath');
            state.routes = [];
        }
    },
    getters:{
        getuserName:state=>state.userName,
        getAllowPath:state=>state.allowPath
    }
}
export default user;