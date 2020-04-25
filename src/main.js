import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";
//配置element
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {postNoEnCodeRequest} from './utils/api'
import {putNoEnCodeRequest} from './utils/api'
import {putRequest} from './utils/api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './assets/material.css'
Vue.use(Vuetify)
Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.postNoEnCodeRequest = postNoEnCodeRequest;
Vue.prototype.putNoEnCodeRequest = putNoEnCodeRequest;
Vue.prototype.putRequest = putRequest;
import './permission'
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
