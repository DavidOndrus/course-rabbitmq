import { accounts } from './accounts/accounts.js'
export const services = app => {
  app.configure(accounts)

  // All services will be registered here
}
