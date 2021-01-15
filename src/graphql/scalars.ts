import { Kind } from 'graphql'
import { scalarType } from 'nexus'

export const JsonScalar = scalarType({
  name: 'Json',
  serialize: value => value,
  parseValue: value => JSON.parse(value),
  parseLiteral: ast =>
    ast.kind === 'StringValue' ? JSON.parse(ast.value) : null,
  asNexusMethod: 'json',
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
