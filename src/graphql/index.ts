import {
  inputObjectType,
  objectType,
  queryType,
  scalarType,
} from '@nexus/schema'
import { Kind } from 'graphql'

export * from './blocks'

export type Node = { id: string }

export const OK = queryType({
  definition(t) {
    t.nonNull.boolean('ok', {
      resolve() {
        return true
      },
    })
  },
})

export const JsonScalar = scalarType({
  name: 'Json',
  asNexusMethod: 'json',
  description: 'JSON custom scalar type',
  parseValue(value) {
    return JSON.parse(value)
  },
  serialize(value) {
    return JSON.stringify(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value)
    }
    return null
  },
})

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value)
  },
  serialize(value) {
    return value.getTime()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value)
    }
    return null
  },
})

export const PaginationInputs = inputObjectType({
  name: 'PaginationInputs',
  description: 'Cursor based pagination',
  definition(t) {
    t.nonNull.int('limit')
    t.nullable.string('cursor')
  },
})

export const pageInfo = objectType({
  name: 'PageInfo',
  description: 'Cursors and page info for paginated requests',
  definition(t) {
    t.string('endCursor')
    t.string('hasNextPage')
    t.string('count')
  },
})
