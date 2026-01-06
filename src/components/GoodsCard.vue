<template>
  <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- 商品卡片点击跳详情页 -->
    <router-link 
      :to="`/goods/detail/${goods.id}`" 
      style="text-decoration: none; color: inherit; display: block;"
    >
      <img 
        :src="$baseUrl + 'assets/' + goods.img" 
        style="width: 100%; height: 200px; object-fit: cover;" 
        :alt="goods.name" 
      />
      <div style="padding: 16px;">
        <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #333;">{{ goods.name }}</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">{{ goods.desc || '精选咖啡豆，口感醇厚' }}</p>
        <p style="font-size: 18px; font-weight: bold; color: #e63946;">¥{{ goods.price }}</p>
      </div>
    </router-link>
    <!-- 加入购物车按钮 -->
    <button 
      @click.stop="handleAddCart"
      style="width: 100%; padding: 10px; background-color: #8b5a2b; color: white; border: none; border-radius: 0 0 8px 8px; cursor: pointer; font-size: 14px; transition: background-color 0.3s;"
      :style="{ backgroundColor: hovered ? '#a67c52' : '#8b5a2b' }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      加入购物车
    </button>
  </div>
</template>

<script setup>
// 替换 defineRef 为 ref（兼容所有Vue3版本）
import { defineProps, defineEmits, ref } from 'vue'

// 接收商品数据
const props = defineProps({
  goods: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      price: 0,
      img: '',
      desc: ''
    })
  }
})

// 触发加购事件
const emit = defineEmits(['addCart'])

// 按钮hover状态（用ref替代defineRef）
const hovered = ref(false)

// 处理加购按钮点击
const handleAddCart = () => {
  emit('addCart', props.goods)
}
</script>

<style scoped>
a {
  text-decoration: none;
}
button:hover {
  background-color: #a67c52 !important;
}
button:focus {
  outline: none;
}
</style>