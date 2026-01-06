<template>
  <div style="background-color: #f8f5f2; min-height: 100vh; padding: 20px 0;">
    <NavBar />
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <!-- 商品详情容器 -->
      <div style="display: flex; gap: 30px; margin: 30px 0; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <!-- 商品图片 -->
        <div style="flex: 0 0 400px;">
          <img 
            :src="`${import.meta.env.BASE_URL}assets/${goodsInfo.img}`" 
            style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;" 
            :alt="goodsInfo.name"
          />
        </div>
        <!-- 商品信息 + 规格选择 -->
        <div style="flex: 1;">
          <h2 style="font-size: 28px; color: #333; margin: 0 0 15px 0; font-weight: 600;">{{ goodsInfo.name }}</h2>
          <p style="font-size: 24px; color: #e63946; font-weight: bold; margin: 0 0 20px 0;">¥{{ goodsInfo.price }}</p>
          <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 0; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #666; line-height: 1.6;">
              <span style="font-weight: 500; color: #333;">商品描述：</span>
              {{ goodsInfo.desc }}
            </p>
          </div>

          <!-- 温度选择 -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 16px; color: #333; font-weight: 500;">温度：</span>
            </div>
            <div style="display: flex; gap: 15px;">
              <button 
                @click="selectedSpec.temp = '热'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.temp === '热' }]"
              >热饮</button>
              <button 
                @click="selectedSpec.temp = '冰'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.temp === '冰' }]"
              >冰饮</button>
            </div>
          </div>

          <!-- 糖度选择 -->
          <div style="margin-bottom: 25px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 16px; color: #333; font-weight: 500;">糖度：</span>
            </div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <button 
                @click="selectedSpec.sugar = '正常糖'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.sugar === '正常糖' }]"
              >正常糖</button>
              <button 
                @click="selectedSpec.sugar = '少糖'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.sugar === '少糖' }]"
              >少糖</button>
              <button 
                @click="selectedSpec.sugar = '半糖'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.sugar === '半糖' }]"
              >半糖</button>
              <button 
                @click="selectedSpec.sugar = '无糖'" 
                :class="['spec-btn', { 'spec-btn-active': selectedSpec.sugar === '无糖' }]"
              >无糖</button>
            </div>
          </div>

          <!-- 数量选择 -->
          <div style="margin-bottom: 30px;">
            <label style="font-size: 16px; color: #333; margin-right: 10px; font-weight: 500;">购买数量：</label>
            <button 
              @click="decreaseCount" 
              :disabled="count <= 1" 
              style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; background: #f8f8f8; cursor: pointer;"
            >-</button>
            <input 
              v-model="count" 
              type="number" 
              min="1" 
              style="width: 60px; padding: 8px; border: 1px solid #ddd; text-align: center;"
            />
            <button 
              @click="increaseCount" 
              style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 0 4px 4px 0; background: #f8f8f8; cursor: pointer;"
            >+</button>
          </div>

          <!-- 按钮组：加入购物车 + 返回列表（同色） -->
          <div style="display: flex; gap: 15px;">
            <button 
              @click="addToCart" 
              style="padding: 12px 30px; background-color: #8b5a2b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;"
            >
              加入购物车
            </button>
            <button 
              @click="router.push('/goods/list')" 
              style="padding: 12px 30px; background-color: #8b5a2b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;"
            >
              返回商品列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 商品信息
const goodsInfo = ref({
  id: '',
  name: '',
  price: 0,
  img: '',
  desc: ''
})
const count = ref(1)
const selectedSpec = ref({ temp: '热', sugar: '正常糖' })

// 完整咖啡商品列表
const coffeeList = [
  { id: 1, name: '美式咖啡', price: 22, img: 'coffee1.jpg', desc: '经典美式，口感醇厚，零添加更纯粹' },
  { id: 2, name: '拿铁咖啡', price: 28, img: 'coffee2.jpg', desc: '奶香拿铁，丝滑浓郁，奶咖黄金配比' },
  { id: 3, name: '卡布奇诺', price: 30, img: 'coffee3.jpg', desc: '绵密奶泡，香气四溢，意式经典风味' },
  { id: 4, name: '摩卡咖啡', price: 32, img: 'coffee4.jpg', desc: '巧克力与咖啡的完美融合，甜而不腻' },
  { id: 5, name: '焦糖玛奇朵', price: 34, img: 'coffee5.jpg', desc: '焦糖酱搭配奶泡，层次丰富，甜香浓郁' },
  { id: 6, name: '馥芮白', price: 36, img: 'coffee6.jpg', desc: '双倍浓缩，鲜奶打底，口感醇厚不苦涩' },
  { id: 7, name: '冷萃咖啡', price: 38, img: 'coffee7.jpg', desc: '低温慢萃12小时，低酸顺滑，冰爽解暑' },
  { id: 8, name: '耶加雪菲', price: 42, img: 'coffee8.jpg', desc: '埃塞俄比亚单品豆，花香果香，果酸明亮' },
  { id: 9, name: '曼特宁咖啡', price: 40, img: 'coffee9.jpg', desc: '印尼苏门答腊豆，醇厚低酸，带香料余韵' },
  { id: 10, name: '生椰拿铁', price: 35, img: 'coffee10.jpg', desc: '新鲜生椰乳搭配拿铁，椰香浓郁，清爽不腻' }
]

// 页面加载获取商品信息
onMounted(() => {
  const goodsId = Number(route.params.id)
  const targetGoods = coffeeList.find(item => item.id === goodsId)
  if (targetGoods) {
    goodsInfo.value = targetGoods
    // 冷萃咖啡默认冰饮+无糖
    if (goodsId === 7) {
      selectedSpec.value.temp = '冰'
      selectedSpec.value.sugar = '无糖'
    }
  } else {
    alert('商品不存在！')
    router.push('/goods/list')
  }
})

// 数量操作
const decreaseCount = () => {
  if (count.value > 1) {
    count.value--
  }
}
const increaseCount = () => {
  count.value++
}

// 加入购物车
const addToCart = () => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!Array.isArray(cart)) cart = []

    const sameItemIndex = cart.findIndex(item => 
      item.id === goodsInfo.value.id && 
      item.spec?.temp === selectedSpec.value.temp && 
      item.spec?.sugar === selectedSpec.value.sugar
    )

    if (sameItemIndex > -1) {
      cart[sameItemIndex].count += count.value
    } else {
      cart.push({
        id: goodsInfo.value.id,
        name: goodsInfo.value.name,
        price: goodsInfo.value.price,
        img: goodsInfo.value.img,
        spec: { ...selectedSpec.value },
        count: count.value
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`✅ 成功加入${count.value}份【${selectedSpec.value.temp}·${selectedSpec.value.sugar}】${goodsInfo.value.name}！`)
    count.value = 1
  } catch (e) {
    alert('加购失败，请重试！')
  }
}
</script>

<style scoped>
.spec-btn {
  padding: 10px 25px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
}
.spec-btn-active {
  border-color: #8b5a2b;
  background: #8b5a2b;
  color: white;
}
.spec-btn:hover:not(.spec-btn-active) {
  border-color: #ccc;
  background: #f8f8f8;
}
button:hover {
  opacity: 0.9;
  transition: opacity 0.2s;
}
input[type="number"] {
  outline: none;
}
</style>