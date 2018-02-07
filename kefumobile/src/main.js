// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Upload , Carousel, CarouselItem} from 'element-ui'

import axios from './config/axios'
import './assets/css/iconfont.css'
import { emoji } from './api/emoji.js'

Vue.use(Upload)
Vue.use(Carousel)
Vue.use(CarouselItem)


Vue.prototype.emoji = emoji;
Vue.prototype.$axios=axios;

Vue.config.productionTip = false

var userIo = 'http://localhost:8082/im/user';
// console.log(io)
var socket = io.connect(userIo);
Vue.prototype.socket = socket;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
