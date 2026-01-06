<template>
  <div style="padding: 20px 0;">
    <NavBar />
    <div class="container">
      <h2 class="title">提交订单</h2>
      <div class="grid" style="grid-template-columns: 1fr 2fr;">
        <!-- 收货地址 -->
        <div class="card">
          <h3 class="title">收货地址</h3>
          <!-- 无地址 -->
          <div v-if="!defaultAddress" style="text-align: center; padding: 20px;">
            <p style="color: #666; margin-bottom: 16px;">暂无收货地址</p>
            <router-link to="/address" class="btn">去添加</router-link>
          </div>
          <!-- 有地址 -->
          <div v-else>
            <p style="font-weight: 500;">{{ defaultAddress.receiver }} {{ defaultAddress.phone }}</p>
            <p style="color: #666; margin: 8px 0;">{{ defaultAddress.address }}</p>
            <router-link to="/address" class="btn btn-outline" style="font-size: 14px;">更换地址</router-link>
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="card">
          <h3 class="title">订单商品</h3>
          <div v-for="item in cartList" :key="item.id" style="display: flex; padding: 8px 0; border-bottom: 1px solid #eee;">
            <img :src="`${import.meta.env.BASE_URL}assets/${item.img}`" style="width: 40px; height: 40px; object-fit: cover; margin-right: 8px;" />
            <div style="flex: 1;">
              <p>{{ item.name }}</p>
              <p style="color: #666; font-size: 14px;">x{{ item.count }}</p>
            </div>
            <p style="color: #c89b7b; font-weight: bold;">¥{{ (item.price * item.count).toFixed(2) }}</p>
          </div>
          <div style="margin-top: 16px; font-size: 18px; font-weight: bold; text-align: right;">
            总计：¥{{ totalPrice }}
          </div>
          <button @click="submitOrder" class="btn" style="width: 100%; margin-top: 16px;" :disabled="!defaultAddress">
            提交订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const cartList = ref([]);
const defaultAddress = ref(null);
const router = useRouter();

// 获取购物车和默认地址
onMounted(() => {
  // 购物车
  const cart = localStorage.getItem('cart') || '[]';
  cartList.value = JSON.parse(cart);
  // 默认地址
  axios.get(`http://localhost:3000/api/address/default/${currentUser.id}`).then(res => {
    if (res.data.code === 0) {
      defaultAddress.value = res.data.data;
    }
  });
});

// 总价
const totalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2);
});

// 提交订单
const submitOrder = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/order', {
      user_id: currentUser.id,
      total_price: totalPrice.value,
      receiver: defaultAddress.value.receiver,
      phone: defaultAddress.value.phone,
      address: defaultAddress.value.address,
      goods_list: cartList.value,
      status: 0 // 待付款
    });
    if (res.data.code === 0) {
      // 清空购物车
      localStorage.setItem('cart', '[]');
      alert('订单提交成功！');
      router.push(`/order/detail/${res.data.order_id}`);
    }
  } catch (err) {
    alert('提交订单失败！');
  }
};
</script>