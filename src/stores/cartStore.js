import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: JSON.parse(localStorage.getItem('cartList')) || []
  }),
  getters: {
    totalPrice() {
      return this.list.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
    },
    totalCount() {
      return this.list.reduce((sum, item) => sum + item.count, 0)
    }
  },
  actions: {
    addGoods(goods) {
      const existItem = this.list.find(item => item.id === goods.id)
      if (existItem) {
        existItem.count += 1
      } else {
        this.list.push({ ...goods, count: 1 })
      }
      localStorage.setItem('cartList', JSON.stringify(this.list))
    },
    changeCount(id, count) {
      const item = this.list.find(item => item.id === id)
      if (item) {
        item.count = count
        localStorage.setItem('cartList', JSON.stringify(this.list))
      }
    },
    deleteGoods(id) {
      this.list = this.list.filter(item => item.id !== id)
      localStorage.setItem('cartList', JSON.stringify(this.list))
    },
    clearCart() {
      this.list = []
      localStorage.setItem('cartList', JSON.stringify([]))
    }
  }
})