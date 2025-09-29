// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const accountsSchema = {
  $id: 'Accounts',
  type: 'object',
  additionalProperties: false,
  required: ['owner', 'points'],
  properties: {
    _id: ObjectIdSchema(),
    owner: { type: 'string' },
    points: { type: 'number' },
  }
}
export const accountsValidator = getValidator(accountsSchema, dataValidator)
export const accountsResolver = resolve({})

export const accountsExternalResolver = resolve({})

// Schema for creating new data
export const accountsDataSchema = {
  $id: 'AccountsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...accountsSchema.properties
  }
}
export const accountsDataValidator = getValidator(accountsDataSchema, dataValidator)
export const accountsDataResolver = resolve({})

// Schema for updating existing data
export const accountsPatchSchema = {
  $id: 'AccountsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    $inc: { type: 'object' },
    $setOnInsert: { type: 'object' },
  }
}
export const accountsPatchValidator = getValidator(accountsPatchSchema, dataValidator)
export const accountsPatchResolver = resolve({})

// Schema for allowed query properties
export const accountsQuerySchema = {
  $id: 'AccountsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(accountsSchema.properties)
  }
}
export const accountsQueryValidator = getValidator(accountsQuerySchema, queryValidator)
export const accountsQueryResolver = resolve({})
