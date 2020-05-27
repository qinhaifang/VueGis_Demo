import Vue from 'vue'
import App from './App.vue'
import 'cesium/Widgets/widgets.css'

import $ from 'jquery'
import initCesium from "./cesium/initCesium"// eslint-disable-line no-unused-vars

Vue.prototype.$initCesium = initCesium
Vue.prototype.$ = $
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
