import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: JSON.parse(localStorage.getItem('orderList')) || []
  }),
  actions: {
    createOrder(order) {
      const newOrder = {
        id: Date.now(),
        createTime: new Date().toLocaleString(),
        status: '已完成',
        ...order
      }
      this.list.push(newOrder)
      localStorage.setItem('orderList', JSON.stringify(this.list))
      return newOrder.id
    },
    getOrderById(id) {
      return this.list.find(item => item.id === Number(id))
    }
  }
})