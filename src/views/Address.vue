<template>
  <div style="background-color: #f8f5f2; min-height: 100vh; padding: 20px 0;">
    <NavBar />
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <h2 style="font-size: 24px; color: #555; margin: 30px 0; font-weight: 600;">收货地址</h2>
      
      <!-- 添加地址按钮 -->
      <button 
        @click="showAddModal = true" 
        style="padding: 10px 20px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px;"
      >
        添加地址
      </button>
      
      <!-- 地址列表（信息分区） -->
      <div v-for="(addr, idx) in addressList" :key="idx" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
        <!-- 地址信息（分区展示） -->
        <div>
          <p style="font-size: 16px; font-weight: 500; color: #333; margin: 0 0 5px 0;">收货人：{{ addr.receiver }}</p>
          <p style="font-size: 14px; color: #666; margin: 0 0 5px 0;">电话：{{ addr.phone }}</p>
          <p style="font-size: 14px; color: #666; margin: 0;">地址：{{ addr.address }}</p>
        </div>
        <!-- 操作按钮 -->
        <div style="display: flex; gap: 10px;">
          <button 
            @click="setDefault(idx)" 
            :disabled="addr.isDefault" 
            style="padding: 6px 12px; border: 1px solid #8b5a2b; color: #8b5a2b; border-radius: 4px; background: transparent; cursor: pointer;"
          >
            {{ addr.isDefault ? '默认地址' : '设为默认' }}
          </button>
          <button 
            @click="deleteAddr(idx)" 
            style="padding: 6px 12px; border: 1px solid #ff4444; color: #ff4444; border-radius: 4px; background: transparent; cursor: pointer;"
          >
            删除
          </button>
        </div>
      </div>
      
      <!-- 空地址提示 -->
      <div v-if="addressList.length === 0" style="text-align: center; padding: 60px 0; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #999; margin-bottom: 20px;">暂无收货地址~</p>
        <button 
          @click="showAddModal = true" 
          style="padding: 10px 20px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          添加第一个地址
        </button>
      </div>
      
      <!-- 添加地址弹窗 -->
      <div v-if="showAddModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
        <div style="background: white; border-radius: 8px; padding: 30px; width: 400px;">
          <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0;">添加收货地址</h3>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 5px;">收货人</label>
            <input v-model="newAddr.receiver" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="请输入收货人姓名" />
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 5px;">手机号码</label>
            <input v-model="newAddr.phone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="请输入手机号码" />
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 5px;">详细地址</label>
            <input v-model="newAddr.address" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="请输入省/市/区/详细地址" />
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button @click="showAddModal = false" style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px; background: transparent; cursor: pointer;">取消</button>
            <button @click="saveAddr" style="padding: 8px 15px; background: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'

const showAddModal = ref(false)
const addressList = ref([])
const newAddr = ref({ receiver: '', phone: '', address: '', isDefault: false })

// 加载地址列表
onMounted(() => {
  const localAddr = localStorage.getItem('address')
  addressList.value = localAddr ? JSON.parse(localAddr) : []
})

// 保存新地址
const saveAddr = () => {
  if (!newAddr.value.receiver || !newAddr.value.phone || !newAddr.value.address) {
    alert('请填写完整地址信息！')
    return
  }
  // 若为第一个地址，自动设为默认
  if (addressList.value.length === 0) {
    newAddr.value.isDefault = true
  }
  addressList.value.push(newAddr.value)
  localStorage.setItem('address', JSON.stringify(addressList.value))
  // 重置表单
  newAddr.value = { receiver: '', phone: '', address: '', isDefault: false }
  showAddModal.value = false
}

// 设置默认地址
const setDefault = (idx) => {
  addressList.value = addressList.value.map((item, i) => ({
    ...item,
    isDefault: i === idx
  }))
  localStorage.setItem('address', JSON.stringify(addressList.value))
}

// 删除地址
const deleteAddr = (idx) => {
  addressList.value.splice(idx, 1)
  // 若删除的是默认地址，将第一个地址设为默认
  if (addressList.value.length > 0 && !addressList.value.some(item => item.isDefault)) {
    addressList.value[0].isDefault = true
  }
  localStorage.setItem('address', JSON.stringify(addressList.value))
}
</script>