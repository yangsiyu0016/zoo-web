import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
import router from "@/store/modules/router";
import user from "@/store/modules/user"
export default new Vuex.Store({
    modules:{
        router,
        user
    }
})