<template>
  <div style="padding: 20px 0; background-color: #f8f5f2;">
    <div class="container" style="max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 28px; color: #8b5a2b;">☕</span>
        <h2 style="font-size: 24px; color: #8b5a2b; margin: 10px 0;">Coffee Mall</h2>
      </div>
      
      <h2 style="text-align: center; margin-bottom: 20px; color: #555;">用户注册</h2>
      <input v-model="username" placeholder="用户名" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;" />
      <input v-model="password" type="password" placeholder="密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;" />
      <input v-model="phone" placeholder="手机号" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px;" />
      <button @click="register" style="width: 100%; padding: 12px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">注册</button>
      <p style="text-align: center; margin-top: 15px;">
        已有账号？ <a href="#" @click.prevent="toLogin" style="color: #8b5a2b; text-decoration: underline;">去登录</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const phone = ref('')

// 注册逻辑（前端localStorage存储）
const register = () => {
  // 1. 验证输入完整性
  if (!username.value || !password.value || !phone.value) {
    alert('请填写完整的注册信息！')
    return
  }

  // 2. 验证手机号格式（简单校验）
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(phone.value)) {
    alert('请输入正确的手机号！')
    return
  }

  // 3. 获取现有用户列表
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  // 4. 检查用户名是否重复
  const isUsernameExist = users.some(user => user.username === username.value)
  if (isUsernameExist) {
    alert('该用户名已被注册，请更换！')
    return
  }

  // 5. 创建新用户并保存
  const newUser = {
    id: Date.now(), // 时间戳作为唯一ID
    username: username.value,
    password: password.value,
    phone: phone.value,
    createTime: new Date().toLocaleString()
  }
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))

  // 6. 提示并跳转登录
  alert('注册成功！请登录')
  router.push('/login')
}

// 跳转到登录页
const toLogin = () => {
  router.push('/login')
}
</script>