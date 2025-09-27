import {orders} from './orders/orders.js'

export const services = app => {
  app.configure(orders)
}
