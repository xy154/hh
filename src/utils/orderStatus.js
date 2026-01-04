export const initOrderAutoUpdate = () => {
  setInterval(() => {
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    if (localOrders.length === 0) return

    const now = Date.now()
    const updatedOrders = localOrders.map(order => {
      // 跳过已完成/已取消/未及时支付订单
      if ([3,4,5].includes(order.status)) return order
      
      const createTime = new Date(order.createTime).getTime()
      const duration = now - createTime

      // 待发货 → 2分钟后自动待收货
      if (order.status === 1 && duration >= 2 * 60 * 1000) {
        return { ...order, status: 2, statusUpdateTime: new Date().toLocaleString() }
      }

      return order
    })

    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }, 10 * 1000)
}