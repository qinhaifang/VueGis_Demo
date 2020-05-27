/**
 * Created by Administrator on 2020/5/27 0027.
 */

import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    }
  ]
})
