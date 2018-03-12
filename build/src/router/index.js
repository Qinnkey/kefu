import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import history from '@/pages/history'
import plugins from '@/pages/plugins'
import kefu from '@/pages/kefu'
import transfer from '@/pages/transfer'
import PagesEntry from '@/components/pages_entry'
import personList from '@/components/personList'
import Resource from 'vue-resource'

Vue.use(Router)
Vue.use(Resource)

export default new Router({
  routes: [
  {path :'/transfer',name:'transfer', component:transfer},
	{ path: '*', redirect: '/index' },
	{path: '/index', name: 'pages_entry', component: PagesEntry, children:[
		{ path: '/index', name: 'index', component: index },
		{ path: '/history', name: 'history', component: history },
		
	]},
    {path: '/plugins', name: 'plugins', component: plugins },
    {path: '/kefu', name: 'kefu', component: kefu },
    {path: '/personList', name: 'personList', component: personList }
  ]
})
