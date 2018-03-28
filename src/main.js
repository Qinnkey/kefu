// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './config/axios'
Vue.prototype.$axios=axios;
Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import './assets/css/iconfont.css'
import { emoji } from './api/emoji.js'

import VueSocketio from 'vue-socket.io';
Vue.prototype.emoji = emoji;

Vue.prototype.globalClick = function (callback) {   //页面全局点击
    document.onclick = callback;
}

//测试环境
var userIo = 'http://183.129.196.178:8082/im/user';
var custIo = 'http://183.129.196.178:8082/im/agent';
////线上环境
//var userIo = 'http://115.236.20.100:8082/im/user';
//var custIo = 'http://115.236.20.100:8082/im/agent';
// var userIo = 'http://localhost:8082/im/user';
// var custIo = 'http://localhost:8082/im/agent';

// 路由拦截
router.beforeEach((to, from, next) => {
    if(to.name == 'kefu'){
    	//线上地址
		var socket = io.connect(userIo);
    	Vue.prototype.socket = socket;
    }else if(to.name == 'index'){
    	localStorage.setItem('currentPage','index');
		Vue.use(VueSocketio, custIo);
    }else if(to.name == 'history'){
    	localStorage.setItem('currentPage','history');
      	Vue.use(VueSocketio, custIo);
    }else if(to.name == 'plugins'){
      	localStorage.setItem('currentPage','plugins');
        Vue.use(VueSocketio, custIo);
    }
    next()
    // if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    //     if (store.state.token) {  // 通过vuex state获取当前的token是否存在
    //         next();
    //     }
    //     else {
    //         next({
    //             path: '/login',
    //             query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
    //         })
    //     }
    // }else {
    //     next();
    // }
})
//import {socketio} from "../static/js/socket.io.js"
//import {jquery} from "../static/js/jquery-1.7.2.min.js"
//import {weiKeFu_IM} from "../static/js/WeiKeFu_IM.js"
//window.socketio = socketio
//window.jquery = jquery;
//window.weiKeFu_IM = weiKeFu_IM

//import UserSocketio from 'vue-socket.io';
//Vue.use(UserSocketio, 'http://localhost:8082/im/user');

//import VueSocketio from 'vue-socket.io';
//Vue.use(VueSocketio, 'http://localhost:8082/im/agent');

//Vue.use(VueSocketio, 'http://localhost:8082/im/agent?custId=88&shopId=100&userId=10');


/* eslint-disable no-new */
window.onbeforeunload = onbeforeunload_handler;     
    window.onunload = onunload_handler;     
    function onbeforeunload_handler()  
    {     
        var warning="确认退出?";             
        return warning;     
    }     
         
    function onunload_handler()  
    {     
        var warning="谢谢光临";     
    }    
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data:{
  	Bus: new Vue()
  }
})
