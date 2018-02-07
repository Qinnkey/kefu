import Vue from 'vue'
import Router from 'vue-router'
import kefu from '@/components/kefu'

Vue.use(Router)

export default new Router({
  routes: [
    // { path: '*', redirect: '/kefu' },
    {
      path: '/kefu',
      name: 'kefu',
      component: kefu
    }
  ]
})
