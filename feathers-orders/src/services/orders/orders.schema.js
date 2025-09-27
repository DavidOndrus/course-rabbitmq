// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const ordersSchema = {
  $id: 'Orders',
  type: 'object',
  additionalProperties: false,
  required: ['author', 'item', 'price'],
  properties: {
    _id: ObjectIdSchema(),
    author: { type: 'string' },
    item: { type: 'string' },
    price: { type: 'number' },
  }
}
export const ordersValidator = getValidator(ordersSchema, dataValidator)
export const ordersResolver = resolve({})

export const ordersExternalResolver = resolve({})

// Schema for creating new data
export const ordersDataSchema = {
  $id: 'OrdersData',
  type: 'object',
  additionalProperties: false,
  required: ordersSchema.required,
  properties: {
    ...ordersSchema.properties
  }
}
export const ordersDataValidator = getValidator(ordersDataSchema, dataValidator)
export const ordersDataResolver = resolve({})

// Schema for updating existing data
export const ordersPatchSchema = {
  $id: 'OrdersPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...ordersSchema.properties
  }
}
export const ordersPatchValidator = getValidator(ordersPatchSchema, dataValidator)
export const ordersPatchResolver = resolve({})

// Schema for allowed query properties
export const ordersQuerySchema = {
  $id: 'OrdersQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(ordersSchema.properties)
  }
}
export const ordersQueryValidator = getValidator(ordersQuerySchema, queryValidator)
export const ordersQueryResolver = resolve({})
