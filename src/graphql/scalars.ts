import { Kind } from 'graphql'
import { asNexusMethod, objectType, scalarType } from 'nexus'
import { GraphQLUpload } from 'apollo-server'

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

// Not really a scalar but it didn't really fit elsewhere
export const file = objectType({
  name: 'File',
  definition(t) {
    t.nonNull.string('filename')
    t.nonNull.string('mimetype')
    t.nonNull.string('encoding')
  },
})

if (!GraphQLUpload)
  throw new Error(
    'Node runtime doesnt support uploads, failing catastrophically.',
  )

export const Upload = asNexusMethod(GraphQLUpload, 'upload')
