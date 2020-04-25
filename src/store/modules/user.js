const user={
    state:{
        user:{
            realName:window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).realName
        }
    },
    mutations:{
        SET_USER(state,user){
            state.user=user;
            window.localStorage.setItem('user',JSON.stringify(user))
        },
        LOGOUT(state){
            window.localStorage.removeItem('user');
            state.routes = [];
        }
    },
    getters:{
        getuserName:state=>state.userName
    }
}
export default user;