<template>
  <div>
    <!-- 导航栏 -->
    <NavBar />
    <!-- 购物车主容器 -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 30px;">
      <h2 style="font-size: 24px; color: #333; margin-bottom: 20px; font-weight: 600;">我的购物车</h2>
      
      <!-- 空购物车提示 -->
      <div v-if="cartList.length === 0" style="text-align: center; padding: 60px 0; color: #999;">
        <p style="font-size: 16px; margin-bottom: 20px;">购物车空空如也~</p>
        <button 
          @click="$router.push('/goods/list')" 
          style="padding: 10px 20px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
        >
          去选购商品
        </button>
      </div>
      
      <!-- 购物车商品列表 -->
      <div v-else>
        <div 
          v-for="(item, idx) in cartList" 
          :key="`${item.id}-${item.spec.temp}-${item.spec.sugar}-${idx}`" 
          style="display: flex; align-items: center; padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 15px; background: #fff;"
        >
          <!-- 商品图片 -->
          <img 
            :src="`/assets/${item.img}`" 
            style="width: 80px; height: 80px; object-fit: cover; margin-right: 20px; border-radius: 6px;" 
            :alt="item.name"
          />
          <!-- 商品信息 -->
          <div style="flex: 1;">
            <p style="font-size: 16px; color: #333; margin: 0 0 8px 0; font-weight: 500;">{{ item.name }}</p>
            <!-- 规格展示 -->
            <p style="font-size: 12px; color: #999; margin: 0 0 8px 0;">
              {{ item.spec.temp }} · {{ item.spec.sugar }}
            </p>
            <p style="font-size: 14px; color: #e63946; font-weight: bold; margin: 0;">¥{{ item.price }}/份</p>
          </div>
          <!-- 数量操作 -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <button 
              @click="decreaseCount(idx)" 
              :disabled="item.count <= 1" 
              style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 4px; background: #f8f8f8; cursor: pointer; display: flex; align-items: center; justify-content: center;"
            >-</button>
            <span style="width: 40px; text-align: center; font-size: 14px;">{{ item.count }}</span>
            <button 
              @click="increaseCount(idx)" 
              style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 4px; background: #f8f8f8; cursor: pointer; display: flex; align-items: center; justify-content: center;"
            >+</button>
          </div>
          <!-- 删除按钮 -->
          <button 
            @click="removeItem(idx)" 
            style="margin-left: 20px; color: #ff4444; border: none; background: transparent; cursor: pointer; font-size: 14px;"
          >
            删除
          </button>
        </div>
        
        <!-- 结算区域 -->
        <div style="margin-top: 30px; text-align: right;">
          <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 15px;">
            总计：¥{{ totalPrice }}
          </p>
          <button 
            @click="toCheckout" 
            style="padding: 12px 30px; background-color: #8b5a2b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;"
          >
            去结算
          </button>
        </div>
      </div>

      <!-- 收货地址选择弹窗 -->
      <div v-if="showAddrSelectModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
        <div style="background: white; border-radius: 8px; padding: 30px; width: 500px;">
          <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0;">选择收货地址</h3>
          <!-- 地址选项列表 -->
          <div v-for="(addr, idx) in addressList" :key="idx" style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px; cursor: pointer;" @click="selectedAddr = addr">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="font-size: 16px; font-weight: 500; margin: 0 0 5px 0;">{{ addr.receiver }}</p>
                <p style="font-size: 14px; color: #666; margin: 0 0 5px 0;">{{ addr.phone }}</p>
                <p style="font-size: 14px; color: #666; margin: 0;">{{ addr.address }}</p>
              </div>
              <input type="radio" name="addr" :checked="selectedAddr.receiver === addr.receiver" style="transform: scale(1.2);" />
            </div>
          </div>
          <!-- 弹窗操作按钮 -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button @click="showAddrSelectModal = false" style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px; background: transparent; cursor: pointer;">取消</button>
            <button @click="confirmAddr" style="padding: 8px 15px; background: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">确认选择</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 购物车列表（初始化读取本地存储）
const cartList = ref([])

// 地址选择相关变量
const showAddrSelectModal = ref(false)
const addressList = ref([])
const selectedAddr = ref({})

// 页面加载读取购物车数据
onMounted(() => {
  try {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      const parsedCart = JSON.parse(cartData)
      // 确保是数组且有必要字段
      if (Array.isArray(parsedCart)) {
        cartList.value = parsedCart.map(item => ({
          id: item.id || '',
          name: item.name || '',
          price: item.price || 0,
          img: item.img || '',
          spec: item.spec || { temp: '热', sugar: '正常糖' },
          count: item.count || 1
        }))
      }
    }
  } catch (error) {
    console.error('读取购物车失败：', error)
    cartList.value = []
  }
})

// 计算总价
const totalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => {
    return sum + (item.price * item.count)
  }, 0)
})

// 数量操作
const decreaseCount = (idx) => {
  if (cartList.value[idx].count > 1) {
    cartList.value[idx].count--
    // 同步到本地存储
    localStorage.setItem('cart', JSON.stringify(cartList.value))
  }
}
const increaseCount = (idx) => {
  cartList.value[idx].count++
  // 同步到本地存储
  localStorage.setItem('cart', JSON.stringify(cartList.value))
}

// 删除商品
const removeItem = (idx) => {
  cartList.value.splice(idx, 1)
  // 同步到本地存储
  localStorage.setItem('cart', JSON.stringify(cartList.value))
}

// 加载地址列表
const loadAddressList = () => {
  const localAddr = localStorage.getItem('address')
  addressList.value = localAddr ? JSON.parse(localAddr) : []
  selectedAddr.value = addressList.value.find(addr => addr.isDefault) || addressList.value[0] || {}
}

// 去结算（打开地址选择弹窗）
const toCheckout = () => {
  if (cartList.value.length === 0) {
    alert('购物车为空，无法结算！')
    return
  }
  loadAddressList()
  if (addressList.value.length === 0) {
    alert('请先添加收货地址！')
    router.push('/address')
    return
  }
  showAddrSelectModal.value = true
}

// 确认选择地址生成订单
const confirmAddr = () => {
  if (!selectedAddr.value.receiver) {
    alert('请选择收货地址！')
    return
  }
  // 生成订单
  const newOrder = {
    id: Date.now(),
    status: 0,
    receiver: selectedAddr.value.receiver,
    phone: selectedAddr.value.phone,
    address: selectedAddr.value.address,
    goods: [...cartList.value],
    totalPrice: totalPrice.value,
    createTime: new Date().toLocaleString(),
    statusUpdateTime: new Date().toLocaleString()
  }
  // 保存订单
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  existingOrders.push(newOrder)
  localStorage.setItem('orders', JSON.stringify(existingOrders))
  // 清空购物车
  cartList.value = []
  localStorage.removeItem('cart')
  // 关闭弹窗并跳转
  showAddrSelectModal.value = false
  alert('订单创建成功！')
  router.push('/orders')
}
</script>

<style scoped>
button:hover {
  opacity: 0.9;
  transition: opacity 0.2s;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>