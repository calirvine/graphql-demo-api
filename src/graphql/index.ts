import { inputObjectType, objectType, queryType } from 'nexus'

export * from './blocks'
export * from './scalars'
export * from './sections'
export * from './page'

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
    t.nullable.string('endCursor')
    t.nullable.string('startCursor')
    t.nonNull.boolean('hasNextPage')

    t.nonNull.int('count')
  },
})
