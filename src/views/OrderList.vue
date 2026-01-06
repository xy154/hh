<template>
  <div>
    <NavBar />
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 30px 0;">
      <h2 style="font-size: 22px; color: #555; margin-bottom: 20px;">我的订单</h2>
      
      <!-- 空订单提示 -->
      <div v-if="orderList.length === 0" style="text-align: center; padding: 50px 0; color: #999;">
        暂无订单~ 
        <button @click="toGoods" style="margin-left: 10px; padding: 8px 15px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">去购物</button>
      </div>
      
      <!-- 订单列表（最新订单置顶） -->
      <div v-for="order in orderList" :key="order.id" style="border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <span>订单编号：{{ order.id }}</span>
          <!-- 仅右上角显示状态 -->
          <span :style="{ color: statusColor(order.status) }">{{ statusText(order.status) }}</span>
        </div>
        <!-- 订单状态更新时间 -->
        <div style="margin-bottom: 15px; font-size: 14px; color: #999;">
          最后状态更新：{{ order.statusUpdateTime || order.createTime }}
        </div>
        <!-- 订单商品 -->
        <div v-for="item in order.goods" :key="item.id" style="display: flex; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #eee;">
          <img :src="$baseUrl + 'assets/' + item.img" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 4px;" />
          <div style="flex: 1;">
            <p>{{ item.name }}</p>
            <p style="font-size: 14px; color: #666;">x{{ item.count }}</p>
            <p style="font-size: 12px; color: #999;">{{ item.spec?.temp || '常温' }} · {{ item.spec?.sugar || '正常糖' }}</p>
          </div>
          <p style="color: #e63946; font-weight: bold;">¥{{ item.price * item.count }}</p>
        </div>
        <!-- 订单信息 -->
        <div style="margin-top: 15px;">
          <p>收货人：{{ order.receiver }}</p>
          <p>联系电话：{{ order.phone }}</p>
          <p>收货地址：{{ order.address }}</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 10px;">订单总价：¥{{ order.totalPrice }}</p>
        </div>
        <!-- 状态操作按钮（无冗余文字） -->
        <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
          <!-- 所有状态都显示“查看详情” -->
          <button 
            @click="$router.push(`/order/${order.id}`)" 
            style="padding: 8px 15px; background: #48bb78; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            查看详情
          </button>
          
          <!-- 待付款：确认付款 + 取消订单 -->
          <button 
            v-if="order.status === 0" 
            @click="updateOrderStatus(order.id, 1)" 
            style="padding: 8px 15px; background: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            确认付款
          </button>
          <button 
            v-if="order.status === 0" 
            @click="cancelOrder(order.id)" 
            style="padding: 8px 15px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            取消订单
          </button>
          
          <!-- 待发货：自动流转（无按钮） -->
          <span v-if="order.status === 1" style="color: #4299e1; line-height: 32px;">
            物流配送中
          </span>
          
          <!-- 待收货：确认收货 -->
          <button 
            v-if="order.status === 2" 
            @click="updateOrderStatus(order.id, 3)" 
            style="padding: 8px 15px; background: #38b2ac; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            确认收货
          </button>
          
          <!-- 已完成/已取消/未及时支付：删除订单 -->
          <button 
            v-if="order.status === 3 || order.status === 4 || order.status === 5" 
            @click="deleteOrder(order.id)" 
            style="padding: 8px 15px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            删除订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { initOrderAutoUpdate } from '../utils/orderStatus'

const router = useRouter()
const orderList = ref([])
let statusCheckTimer = null
let autoCancelTimer = null

// 页面加载初始化
onMounted(() => {
  loadOrders()
  initOrderAutoUpdate()
  initAutoCancelUnpaidOrder()
  statusCheckTimer = setInterval(loadOrders, 5000)
})

// 页面卸载清除定时器
onUnmounted(() => {
  clearInterval(statusCheckTimer)
  clearInterval(autoCancelTimer)
})

// 加载订单数据（容错+排序）
const loadOrders = () => {
  try {
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const validOrders = Array.isArray(localOrders) ? localOrders : []
    orderList.value = validOrders.sort((a, b) => (b.id - a.id) || 0)
  } catch (e) {
    orderList.value = []
    localStorage.setItem('orders', '[]')
  }
}

// 状态文字映射（区分手动取消/未及时支付）
const statusText = (status) => {
  const map = { 
    0: '待付款', 
    1: '待发货', 
    2: '待收货', 
    3: '已完成', 
    4: '已取消',    // 手动取消
    5: '未及时支付' // 超时未付款
  }
  return map[status] || '未知状态'
}

// 状态颜色映射
const statusColor = (status) => {
  const colors = { 
    0: '#ff9800', 
    1: '#4299e1', 
    2: '#38b2ac', 
    3: '#48bb78',
    4: '#ff4444',   // 已取消（红色）
    5: '#999'       // 未及时支付（灰色）
  }
  return colors[status] || '#333'
}

// 更新订单状态
const updateOrderStatus = (orderId, newStatus) => {
  try {
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = localOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, statusUpdateTime: new Date().toLocaleString() }
      }
      return order
    })
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    loadOrders()
    alert(`订单状态已更新为：${statusText(newStatus)}`)
  } catch (e) {
    alert('操作失败，请重试！')
  }
}

// 手动取消订单（状态=4）
const cancelOrder = (orderId) => {
  if (confirm('确定要取消该订单吗？')) {
    try {
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedOrders = localOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 4, statusUpdateTime: new Date().toLocaleString() }
        }
        return order
      })
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      loadOrders()
      alert('订单已取消！')
    } catch (e) {
      alert('取消失败，请重试！')
    }
  }
}

// 删除订单
const deleteOrder = (orderId) => {
  if (confirm('确定要删除该订单吗？删除后不可恢复！')) {
    try {
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const filteredOrders = localOrders.filter(order => order.id !== orderId)
      localStorage.setItem('orders', JSON.stringify(filteredOrders))
      loadOrders()
      alert('订单已删除！')
    } catch (e) {
      alert('删除失败，请重试！')
    }
  }
}

// 超时未付款自动取消（状态=5）
const initAutoCancelUnpaidOrder = () => {
  autoCancelTimer = setInterval(() => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const now = Date.now()
      const updatedOrders = localOrders.map(order => {
        if (order.status === 0) {
          const createTime = new Date(order.createTime).getTime()
          if (now - createTime >= 60 * 1000) {
            return { ...order, status: 5, statusUpdateTime: new Date().toLocaleString() }
          }
        }
        return order
      })
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      loadOrders()
    } catch (e) {}
  }, 10 * 1000)
}

// 跳转到商品列表
const toGoods = () => {
  router.push('/goods/list')
}
</script>