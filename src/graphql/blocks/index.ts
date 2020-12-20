import {
  unionType,
  inputObjectType,
  extendType,
  arg,
  nonNull,
  queryType,
  objectType,
} from 'nexus'

import * as copyTypes from './copy'
import * as imageTypes from './image'
import * as urlTypes from './url'
import { Node } from '../index'
import { Prisma } from '@prisma/client'
import { decodeCursor, encodeCursor } from '../../utils/cursors'
import { db } from '../../datasources/db'

export type Blocks = Node &
  (urlTypes.IUrlData | copyTypes.ICopyData | imageTypes.IImageData)

export enum TYPE_NAMES {
  COPY = 'CopyBlock',
  IMAGE = 'ImageBlock',
  URL = 'UrlBlock',
}

export { copyTypes, imageTypes, urlTypes }

export const Block = unionType({
  name: 'Block',
  description: 'The union of copy, image, and url blocks',
  definition(t) {
    t.members('CopyBlock', 'ImageBlock', 'UrlBlock')
  },
  resolveType: item => {
    if ('src' in item) return 'ImageBlock'
    if ('copy' in item) return 'CopyBlock'
    if ('url' in item) return 'UrlBlock'
    return null
  },
})

export const BlockFilterInputs = inputObjectType({
  name: 'BlockFilterInputs',
  definition(t) {
    t.list.nonNull.string('include')
  },
})

export const paginatedBlocks = objectType({
  name: 'PaginatedBlocks',
  description: 'Cursor based pagination of blocks',
  definition(t) {
    t.list.field('nodes', {
      type: 'Block',
    })
    t.field('pageInfo', {
      type: 'PageInfo',
    })
  },
})

export const queryBlock = extendType({
  type: 'Query',
  definition(t) {
    t.field('getBlocks', {
      type: 'PaginatedBlocks',
      args: {
        BlockFilterInputs: arg({ type: 'BlockFilterInputs' }),
        PaginationFilterInputs: nonNull(arg({ type: 'PaginationInputs' })),
      },
      async resolve(
        _,
        { BlockFilterInputs, PaginationFilterInputs: { limit, cursor } },
        ctx,
      ) {
        let queryConfig: Prisma.FindManyBlockArgs = {
          take: limit + 1,
        }
        let filtersQuery = {}
        if (BlockFilterInputs?.include && BlockFilterInputs.include.length) {
          const filters = BlockFilterInputs.include.map(filter => ({
            typeName: { contains: filter },
          }))
          filtersQuery = { where: { OR: filters } }
        }
        if (cursor) {
          queryConfig = {
            ...queryConfig,
            skip: 1,
            cursor: { timestamp: decodeCursor(cursor) },
          }
        }

        const dbQueryResults = (
          await ctx.db.block.findMany({
            ...filtersQuery,
            ...queryConfig,
          })
        ).map(res => ({
          id: res.id,
          ...JSON.parse(res.data),
          cursor: encodeCursor(res.timestamp),
        }))
        const hasNextPage = dbQueryResults.length > limit

        if (dbQueryResults.length === 0) {
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
              count: await db.block.count(filtersQuery),
            },
            nodes: [],
          }
        }

        const nodes = hasNextPage ? dbQueryResults.slice(0, -1) : dbQueryResults

        const pageInfo = {
          endCursor: nodes[nodes.length - 1].cursor,
          hasNextPage: hasNextPage,
          count: await db.block.count(filtersQuery),
        }
        return {
          pageInfo,
          nodes: nodes,
        }
      },
    })
  },
})
