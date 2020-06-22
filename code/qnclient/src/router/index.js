/**
 * 程序名：前端路由配置
 * 功能：配置前端路由
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Base from '@/components/Base'
import Index from '@/components/Index'
import Home from '@/components/Home'
import Display from '@/components/Display'
import ThankYou from '@/components/ThankYou'
import Fail from '@/components/Fail'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base,
      children:[
        {
          path: '/',
          name: 'Index',
          component: Index
        },
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        {
          path: '/login',
          name: 'Login',
          component: Login
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
        },
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
      ]
    },
    {
      path: '/display/:id',
      name: 'Display',
      component: Display
    },
    {
      path: '/thankyou',
      name: 'ThankYou',
      component: ThankYou
    },
    {
      path: '/fail/:message',
      name: 'Fail',
      component: Fail
    },
  ]
})
