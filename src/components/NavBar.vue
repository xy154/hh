<template>
  <nav style="background-color: #8b5a2b; padding: 16px 0; color: white;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
      <!-- 咖啡店名称 -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">☕</span>
        <h1 style="font-size: 20px; margin: 0;">Coffee Mall</h1>
      </div>
      <!-- 导航链接 -->
      <div style="display: flex; gap: 24px; align-items: center;">
        <router-link to="/home" style="color: white; text-decoration: none;">首页</router-link>
        <router-link to="/goods/list" style="color: white; text-decoration: none;">全部商品</router-link>
        <router-link to="/cart" style="color: white; text-decoration: none;">购物车</router-link>
        <router-link to="/address" style="color: white; text-decoration: none;">收货地址</router-link>
        <router-link to="/orders" style="color: white; text-decoration: none;">我的订单</router-link>
        <!-- 退出登录按钮 -->
        <button 
          @click="logout" 
          style="background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer;"
        >
          退出登录
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 退出登录
const logout = () => {
  localStorage.removeItem('currentUser')
  alert('已退出登录！')
  router.push('/login')
}
</script>