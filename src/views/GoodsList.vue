<template>
  <div class="page-container">
    <NavBar />
    <div class="content">
      <h2 class="title">咖啡商品</h2>
      <!-- 商品列表 -->
      <div class="goods-grid">
        <div class="goods-card" v-for="goods in coffeeList" :key="goods.id">
          <!-- 商品卡片（跳详情页） -->
          <div class="card-body" @click="$router.push(`/goods/detail/${goods.id}`)">
            <!-- 恢复原图尺寸 -->
            <img :src="`/assets/${goods.img}`" :alt="goods.name" class="goods-img" />
            <div class="goods-info">
              <h3 class="goods-name">{{ goods.name }}</h3>
              <p class="goods-desc">{{ goods.desc }}</p>
              <p class="goods-price">¥{{ goods.price }}</p>
            </div>
          </div>
          <!-- 加入购物车按钮 -->
          <button class="add-cart-btn" @click.stop="showSpecModal(goods)">
            加入购物车
          </button>
        </div>
      </div>
    </div>

    <!-- 规格弹窗（保留原逻辑） -->
    <div class="modal-mask" v-if="showModal">
      <div class="modal-content">
        <h3 class="modal-title">选择规格 - {{ currentGoods.name }}</h3>
        <div class="spec-item">
          <label class="spec-label">温度：</label>
          <div class="spec-btn-group">
            <button class="spec-btn" :class="{ active: modalSpec.temp === '热' }" @click="modalSpec.temp = '热'">热饮</button>
            <button class="spec-btn" :class="{ active: modalSpec.temp === '冰' }" @click="modalSpec.temp = '冰'">冰饮</button>
          </div>
        </div>
        <div class="spec-item">
          <label class="spec-label">糖度：</label>
          <div class="spec-btn-group">
            <button class="spec-btn" :class="{ active: modalSpec.sugar === '正常糖' }" @click="modalSpec.sugar = '正常糖'">正常糖</button>
            <button class="spec-btn" :class="{ active: modalSpec.sugar === '少糖' }" @click="modalSpec.sugar = '少糖'">少糖</button>
            <button class="spec-btn" :class="{ active: modalSpec.sugar === '半糖' }" @click="modalSpec.sugar = '半糖'">半糖</button>
            <button class="spec-btn" :class="{ active: modalSpec.sugar === '无糖' }" @click="modalSpec.sugar = '无糖'">无糖</button>
          </div>
        </div>
        <div class="spec-item">
          <label class="spec-label">数量：</label>
          <div class="count-group">
            <button class="count-btn" @click="modalCount > 1 && modalCount--">-</button>
            <input type="number" v-model="modalCount" min="1" class="count-input" />
            <button class="count-btn" @click="modalCount++">+</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showModal = false">取消</button>
          <button class="modal-btn confirm" @click="addToCartFromList">确认加购</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref } from 'vue'

// 恢复10个商品数据
const coffeeList = ref([
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
])

// 弹窗变量（保留原逻辑）
const showModal = ref(false)
const currentGoods = ref({})
const modalSpec = ref({ temp: '热', sugar: '正常糖' })
const modalCount = ref(1)

// 打开弹窗（保留原逻辑）
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

// 加购逻辑（保留原逻辑）
const addToCartFromList = () => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!Array.isArray(cart)) cart = []
    const sameItem = cart.find(item => 
      item.id === currentGoods.value.id && 
      item.spec.temp === modalSpec.value.temp && 
      item.spec.sugar === modalSpec.value.sugar
    )
    if (sameItem) {
      sameItem.count += modalCount.value
    } else {
      cart.push({
        ...currentGoods.value,
        spec: modalSpec.value,
        count: modalCount.value
      })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`成功加入${modalCount.value}份【${modalSpec.value.temp}·${modalSpec.value.sugar}】${currentGoods.value.name}！`)
    showModal.value = false
  } catch (e) {
    alert('加购失败！')
  }
}
</script>

<style scoped>
/* 页面容器 */
.page-container {
  background-color: #f8f5f2;
  min-height: 100vh;
  padding: 20px 0;
}
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.title {
  font-size: 24px;
  color: #555;
  margin: 30px 0;
  font-weight: 600;
}

/* 商品网格（恢复原布局） */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 恢复原列宽 */
  gap: 20px;
}
.goods-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}
.card-body {
  cursor: pointer;
}
/* 恢复原图片尺寸 */
.goods-img {
  width: 100%;
  height: 240px; /* 与你原布局一致 */
  object-fit: cover;
}
.goods-info {
  padding: 15px;
}
.goods-name {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}
.goods-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods-price {
  font-size: 16px;
  color: #e63946;
  font-weight: bold;
  margin: 0;
}

/* 加购按钮（保留原样式） */
.add-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #8b5a2b;
  color: white;
  border: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.add-cart-btn:hover {
  background-color: #a67c52;
}

/* 弹窗样式（保留原逻辑） */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 400px;
}
.modal-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}
.spec-item {
  margin-bottom: 15px;
}
.spec-label {
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 8px;
}
.spec-btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.spec-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
}
.spec-btn.active {
  border-color: #8b5a2b;
  background: #8b5a2b;
  color: white;
}
.count-group {
  display: flex;
}
.count-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background: #f8f8f8;
  cursor: pointer;
}
.count-input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  outline: none;
}
.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-btn {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.cancel {
  border: 1px solid #ddd;
  background: transparent;
}
.confirm {
  background: #8b5a2b;
  color: white;
  border: none;
}
</style>