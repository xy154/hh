<template>
  <div>
    <NavBar />
    <!-- 头部banner -->
    <div style="background-color: #e8d6c4; padding: 32px 0;">
      <div class="container text-center">
        <h1 style="font-size: 36px; font-weight: bold; color: #8b5a2b; margin-bottom: 16px;">品味醇香 享受生活</h1>
        <p style="font-size: 20px; margin-bottom: 24px;">精选全球优质咖啡豆，现磨现卖</p>
        <router-link to="/goods/list" style="background-color: #c89b7b; color: white; padding: 12px 24px; border-radius: 4px; transition: background-color 0.3s;">
          立即选购
        </router-link>
      </div>
    </div>
    <!-- 推荐商品 -->
    <div class="container" style="padding: 32px 0; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">推荐商品</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <GoodsCard 
          v-for="goods in recommendGoods" 
          :key="goods.id" 
          :goods="goods" 
          @addCart="showSpecModal(goods)"
        />
      </div>
    </div>

    <!-- 规格选择弹窗 -->
    <div v-if="showModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; border-radius: 8px; padding: 30px; width: 400px;">
        <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0;">选择规格 - {{ currentGoods.name }}</h3>
        <div style="margin-bottom: 15px;">
          <label style="font-size: 16px; color: #333; display: block; margin-bottom: 8px;">温度：</label>
          <div style="display: flex; gap: 10px;">
            <button 
              @click="modalSpec.temp = '热'" 
              :style="{ padding: '8px 20px', border: modalSpec.temp === '热' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.temp === '热' ? '#8b5a2b' : 'white', color: modalSpec.temp === '热' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >热饮</button>
            <button 
              @click="modalSpec.temp = '冰'" 
              :style="{ padding: '8px 20px', border: modalSpec.temp === '冰' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.temp === '冰' ? '#8b5a2b' : 'white', color: modalSpec.temp === '冰' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >冰饮</button>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="font-size: 16px; color: #333; display: block; margin-bottom: 8px;">糖度：</label>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button 
              @click="modalSpec.sugar = '正常糖'" 
              :style="{ padding: '8px 20px', border: modalSpec.sugar === '正常糖' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.sugar === '正常糖' ? '#8b5a2b' : 'white', color: modalSpec.sugar === '正常糖' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >正常糖</button>
            <button 
              @click="modalSpec.sugar = '少糖'" 
              :style="{ padding: '8px 20px', border: modalSpec.sugar === '少糖' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.sugar === '少糖' ? '#8b5a2b' : 'white', color: modalSpec.sugar === '少糖' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >少糖</button>
            <button 
              @click="modalSpec.sugar = '半糖'" 
              :style="{ padding: '8px 20px', border: modalSpec.sugar === '半糖' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.sugar === '半糖' ? '#8b5a2b' : 'white', color: modalSpec.sugar === '半糖' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >半糖</button>
            <button 
              @click="modalSpec.sugar = '无糖'" 
              :style="{ padding: '8px 20px', border: modalSpec.sugar === '无糖' ? '1px solid #8b5a2b' : '1px solid #ddd', background: modalSpec.sugar === '无糖' ? '#8b5a2b' : 'white', color: modalSpec.sugar === '无糖' ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer' }"
            >无糖</button>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="font-size: 16px; color: #333; margin-right: 10px;">数量：</label>
          <button 
            @click="modalCount > 1 && modalCount--" 
            style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; background: #f8f8f8; cursor: pointer;"
          >-</button>
          <input 
            v-model="modalCount" 
            type="number" 
            min="1" 
            style="width: 60px; padding: 8px; border: 1px solid #ddd; text-align: center;"
          />
          <button 
            @click="modalCount++" 
            style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 0 4px 4px 0; background: #f8f8f8; cursor: pointer;"
          >+</button>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button @click="showModal = false" style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px; background: transparent; cursor: pointer;">取消</button>
          <button @click="addToCartFromHome" style="padding: 8px 15px; background: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">确认加购</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import GoodsCard from '../components/GoodsCard.vue'
import { ref } from 'vue'

// 推荐商品
const recommendGoods = [
  { id: 1, name: '美式咖啡', price: 22, img: 'coffee1.jpg', desc: '经典美式，口感醇厚' },
  { id: 2, name: '拿铁咖啡', price: 28, img: 'coffee2.jpg', desc: '奶香拿铁，丝滑浓郁' },
  { id: 3, name: '卡布奇诺', price: 30, img: 'coffee3.jpg', desc: '绵密奶泡，香气四溢' },
  { id: 4, name: '摩卡咖啡', price: 32, img: 'coffee4.jpg', desc: '巧克力与咖啡的融合' },
]

// 弹窗变量
const showModal = ref(false)
const currentGoods = ref({})
const modalSpec = ref({ temp: '热', sugar: '正常糖' })
const modalCount = ref(1)

// 打开规格弹窗
const showSpecModal = (goods) => {
  currentGoods.value = goods
  modalSpec.value = { temp: '热', sugar: '正常糖' }
  if (goods.id === 7) {
    modalSpec.value.temp = '冰'
    modalSpec.value.sugar = '无糖'
  }
  modalCount.value = 1
  showModal.value = true
}

// 加购逻辑
const addToCartFromHome = () => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!Array.isArray(cart)) cart = []
    const sameItemIndex = cart.findIndex(item => 
      item.id === currentGoods.value.id && 
      item.spec?.temp === modalSpec.value.temp && 
      item.spec?.sugar === modalSpec.value.sugar
    )
    if (sameItemIndex > -1) {
      cart[sameItemIndex].count += modalCount.value
    } else {
      cart.push({
        id: currentGoods.value.id,
        name: currentGoods.value.name,
        price: currentGoods.value.price,
        img: currentGoods.value.img,
        spec: { ...modalSpec.value },
        count: modalCount.value
      })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`成功加入${modalCount.value}份【${modalSpec.value.temp}·${modalSpec.value.sugar}】${currentGoods.value.name}！`)
    showModal.value = false
  } catch (e) {
    alert('加购失败，请重试！')
  }
}
</script>

<style scoped>
a:hover {
  background-color: #a67c52 !important;
}
</style>