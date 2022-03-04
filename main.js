// #ifndef VUE3
import Vue from 'vue'
import App from './App'


//Vue.prototype.requestUrl = 'http://localhost:9398'; //本地环境
Vue.prototype.requestUrl = 'http://www.pmokanban.com'; // 开发环境
//Vue.prototype.requestUrl = '/ajaxRequest'; // 代理配置

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
