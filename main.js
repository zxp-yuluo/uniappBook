import Vue from 'vue'
import App from './App'

import store from './store'  
Vue.prototype.$store = store  

Vue.config.productionTip = false

App.mpType = 'app'

Vue.filter('latelyFollower',value => {
	value = value>10000? (value/10000).toFixed(1) + '万': value
	return value
})

const app = new Vue({
    ...App
})
app.$mount()
