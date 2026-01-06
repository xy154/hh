import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'       // 登录页
import Register from '../views/Register.vue' // 注册页（必须存在）
import Home from '../views/Home.vue'         // 首页
import GoodsList from '../views/GoodsList.vue' // 商品列表页
import GoodsDetail from '../views/GoodsDetail.vue'
import Cart from '../views/Cart.vue'         // 购物车页
import Address from '../views/Address.vue'   // 地址页
import OrderList from '../views/OrderList.vue' // 订单列表页

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/home', component: Home, meta: { requiresAuth: true } }, // 标记需要登录
    { path: '/goods', component: GoodsList, meta: { requiresAuth: true } }, 
    { path: '/goods/detail/:id', component: GoodsDetail, meta: { requiresAuth: true } },
    { path: '/goods/list', component: GoodsList, meta: { requiresAuth: true } }, // 原路径
    { path: '/cart', component: Cart, meta: { requiresAuth: true } },
    { path: '/address', component: Address, meta: { requiresAuth: true } },
    { path: '/orders', component: () => import('../views/OrderList.vue'), meta: { requiresAuth: true } },
    { path: '/order/:id', component: () => import('../views/OrderDetail.vue'), meta: { requiresAuth: true } }
  ]
})

// 完善的路由守卫逻辑（解决原代码匹配问题）
router.beforeEach((to, from, next) => {
  // 1. 通过 meta.requiresAuth 统一标记需要登录的页面（更灵活，无需手动写路径）
  const isNeedAuth = to.meta.requiresAuth
  // 2. 获取当前登录状态（与你业务中的登录存储key保持一致）
  const currentUser = localStorage.getItem('currentUser')

  // 3. 核心拦截逻辑
  if (isNeedAuth) {
    // 需要登录 → 检查是否有登录态
    if (currentUser) {
      // 已登录 → 放行
      next()
    } else {
      // 未登录 → 提示并跳登录页，同时记录目标页面（可选，优化体验）
      alert('请先登录后再访问！')
      next({ 
        path: '/login',
        query: { redirect: to.fullPath } // 登录后可跳回原目标页面
      })
    }
  } else {
    // 不需要登录的页面（登录/注册）→ 直接放行
    next()
  }
})

export default router