<template>
  <div style="padding: 20px 0; background-color: #f8f5f2;">
    <div class="container" style="max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 28px; color: #8b5a2b;">☕</span>
        <h2 style="font-size: 24px; color: #8b5a2b; margin: 10px 0;">Coffee Mall</h2>
      </div>
      
      <h2 style="text-align: center; margin-bottom: 20px; color: #555;">用户登录</h2>
      <input v-model="username" placeholder="用户名" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;" />
      <input v-model="password" type="password" placeholder="密码" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px;" />
      <button @click="login" style="width: 100%; padding: 12px; background-color: #8b5a2b; color: white; border: none; border-radius: 4px; cursor: pointer;">登录</button>
      <p style="text-align: center; margin-top: 15px;">
        还没有账号？ <a href="#" @click.prevent="toRegister" style="color: #8b5a2b; text-decoration: underline;">去注册</a>
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

// 登录逻辑（适配前端localStorage用户）
const login = () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码！')
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.username === username.value && u.password === password.value)
  
  if (!user) {
    alert('用户名或密码错误！')
    return
  }

  localStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    username: user.username,
    phone: user.phone
  }))
  alert('登录成功！')
  router.push('/home')
}

const toRegister = () => {
  router.push('/register')
}
</script>