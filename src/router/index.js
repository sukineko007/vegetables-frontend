import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminLogin from '../views/admin/AdminLogin'
import AdminHome from '../views/admin/AdminHome'
import CustomHome from '../views/custom/CustomHome'
import CustomLogin from '../views/custom/CustomLogin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/adminHome',
    component: AdminHome,
    redirect: { path: '/adminHome/1'},
    children: [
      {
        path: '/adminHome/1',
        component: () => import('../components/admin/Welcome.vue')    //首页
      },
      {
        path: '/adminHome/2',
        component: () => import('../components/admin/GoodManage.vue')   //商品管理
      },
      {
        path: '/adminHome/3',  //订单状态管理
        component: () => import('../components/admin/OrderManage.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'CustomHome',
    component: CustomHome,
    redirect: { path: '/1'},
    children: [
      {
        path: '/1',
        component: () => import('../components/custom/WelCome.vue')
      },
      {
        path: '/2',
        component: () => import('../components/custom/VegetablesShop.vue')
      },
      {
        path: '/3',
        component: () => import('../components/custom/Shopcar.vue')
      },
      {
        path: '/4',
        component: () => import('../components/custom/ConfirmOrder.vue')
      },
      {
        path: '/5',
        component: () => import('../components/custom/MyOrder.vue')
      },
      {
        path: '/6',
        component: () => import('../components/custom/Person.vue')
      },
      {
        path: '/7',
        component: () => import('../components/custom/Address.vue')
      }
    ]
  },
  {
    path: '/login',
    name: '/CustomLogin',
    component: CustomLogin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
