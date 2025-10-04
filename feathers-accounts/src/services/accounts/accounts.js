// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  accountsDataValidator,
  accountsPatchValidator,
  accountsQueryValidator,
  accountsResolver,
  accountsExternalResolver,
  accountsDataResolver,
  accountsPatchResolver,
  accountsQueryResolver
} from './accounts.schema.js'
import { AccountsService, getOptions } from './accounts.class.js'
import {publishChangedEvent} from './hooks/publish-changed-event.js';

export const accountsPath = 'accounts'
export const accountsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './accounts.class.js'
export * from './accounts.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const accounts = app => {
  // Register our service on the Feathers application
  app.use(accountsPath, new AccountsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: accountsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(accountsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(accountsExternalResolver),
        schemaHooks.resolveResult(accountsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(accountsQueryValidator),
        schemaHooks.resolveQuery(accountsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(accountsDataValidator),
        schemaHooks.resolveData(accountsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(accountsPatchValidator),
        schemaHooks.resolveData(accountsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      patch: [publishChangedEvent],
    },
    error: {
      all: []
    }
  })
}
