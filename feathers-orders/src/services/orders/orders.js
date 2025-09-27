// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  ordersDataValidator,
  ordersPatchValidator,
  ordersQueryValidator,
  ordersResolver,
  ordersExternalResolver,
  ordersDataResolver,
  ordersPatchResolver,
  ordersQueryResolver
} from './orders.schema.js'
import { OrdersService, getOptions } from './orders.class.js'
import {publishCreatedEvent} from './hooks/publish-created-event.js';

export const ordersPath = 'orders'
export const ordersMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './orders.class.js'
export * from './orders.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const orders = app => {
  // Register our service on the Feathers application
  app.use(ordersPath, new OrdersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ordersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ordersPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(ordersExternalResolver), schemaHooks.resolveResult(ordersResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(ordersQueryValidator), schemaHooks.resolveQuery(ordersQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(ordersDataValidator), schemaHooks.resolveData(ordersDataResolver)],
      patch: [schemaHooks.validateData(ordersPatchValidator), schemaHooks.resolveData(ordersPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      create: [publishCreatedEvent]
    },
    error: {
      all: []
    }
  })
}
