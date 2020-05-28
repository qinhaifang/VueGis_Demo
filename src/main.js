import Vue from 'vue'
import App from './App.vue'
import 'cesium/Widgets/widgets.css'

import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
Vue.use(echarts,ElementUI)
import $ from 'jquery'
import initCesium from "./cesium/initCesium"// eslint-disable-line no-unused-vars

Vue.prototype.$initCesium = initCesium
Vue.prototype.$ = $
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
