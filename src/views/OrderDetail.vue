<template>
  <div style="background-color: #f8f5f2; min-height: 100vh; padding: 20px 0;">
    <NavBar />
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <h2 style="font-size: 24px; color: #555; margin: 30px 0; font-weight: 600;">订单详情</h2>
      
      <div v-if="order" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <!-- 订单基础信息 -->
        <div style="border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">订单编号：</span>
            {{ order.id }}
          </p>
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">下单时间：</span>
            {{ order.createTime }}
          </p>
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">订单状态：</span>
            <span :style="{ color: statusColor(order.status), fontWeight: '500' }">
              {{ statusText(order.status) }}
            </span>
          </p>
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">收货人：</span>
            {{ order.receiver }}
          </p>
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">联系电话：</span>
            {{ order.phone }}
          </p>
          <p style="font-size: 16px; color: #666; margin: 8px 0;">
            <span style="font-weight: 500; color: #333;">收货地址：</span>
            {{ order.address }}
          </p>
        </div>
        
        <!-- 商品清单 -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 18px; color: #333; margin-bottom: 15px; font-weight: 600;">商品清单</h3>
          <div v-for="goods in order.goods" :key="goods.id" style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px dashed #eee;">
            <img :src="`/assets/${goods.img}`" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />
            <div style="flex: 1;">
              <p style="font-size: 16px; color: #333; margin: 0;">{{ goods.name }}</p>
              <p style="font-size: 14px; color: #999; margin: 5px 0 0 0;">x{{ goods.count }}</p>
              <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">{{ goods.spec.temp }} · {{ goods.spec.sugar }}</p>
            </div>
            <p style="font-size: 16px; color: #e63946; font-weight: bold;">¥{{ (goods.price * goods.count).toFixed(2) }}</p>
          </div>
        </div>
        
        <!-- 订单总计 -->
        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #333; margin-top: 20px;">
          订单总计：¥{{ order.totalPrice }}
        </div>
        
        <!-- 返回按钮 -->
        <router-link 
          to="/orders" 
          style="display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #8b5a2b; color: white; border-radius: 4px; text-decoration: none;"
        >
          返回订单列表
        </router-link>
      </div>
      
      <div v-else style="text-align: center; padding: 60px 0; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #999; margin-bottom: 20px;">订单不存在~</p>
        <router-link 
          to="/orders" 
          style="padding: 10px 20px; background-color: #8b5a2b; color: white; border-radius: 4px; text-decoration: none;"
        >
          返回订单列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = Number(route.params.id)
const order = ref(null)

// 状态文字映射（与订单列表页一致）
const statusText = (status) => {
  const map = { 
    0: '待付款', 
    1: '待发货', 
    2: '待收货', 
    3: '已完成', 
    4: '已取消', 
    5: '未及时支付' 
  }
  return map[status] || '未知状态'
}

// 状态颜色映射（与订单列表页一致）
const statusColor = (status) => {
  const colors = { 
    0: '#ff9800', 
    1: '#4299e1', 
    2: '#38b2ac', 
    3: '#48bb78',
    4: '#ff4444',
    5: '#999'
  }
  return colors[status] || '#333'
}

// 加载订单详情
onMounted(() => {
  try {
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    order.value = localOrders.find(item => item.id === orderId)
  } catch (e) {
    order.value = null
  }
})
</script>