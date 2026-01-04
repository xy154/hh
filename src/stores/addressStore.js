import { defineStore } from 'pinia'

export const useAddressStore = defineStore('address', {
  state: () => ({
    list: JSON.parse(localStorage.getItem('addressList')) || [
      { id: 1, name: '张三', phone: '13800138000', address: '北京市朝阳区建国路88号' }
    ],
    selectedId: 1
  }),
  getters: {
    selectedAddress() {
      return this.list.find(item => item.id === this.selectedId) || this.list[0]
    }
  },
  actions: {
    selectAddress(id) {
      this.selectedId = id
    }
  }
})