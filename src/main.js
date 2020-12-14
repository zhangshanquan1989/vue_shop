import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式
import './assets/css/global.css'
// 先安装依赖，后导入树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// axios 请求拦截器 ，为请求头添加token权限
//     request方法是请求拦截器  通过use挂载一个回调函数  config为请求对象
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	// 在最后必须 return config
	return config
})
// 把axios包挂在到vue原型对象上
Vue.prototype.$http = axios

// 注册为全局可用组件
Vue.component('tree-table',TreeTable)


// 注册全局过滤器
Vue.filter('dataFormat', function(originVal){
	const dt = new Date(originVal)
	
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')
	
	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds()+ '').padStart(2, '0')
	
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
