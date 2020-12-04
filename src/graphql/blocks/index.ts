import {
  unionType,
  inputObjectType,
  extendType,
  arg,
  nonNull,
  queryType,
  objectType,
} from '@nexus/schema'

import * as copyTypes from './copy'
import * as imageTypes from './image'
import * as urlTypes from './url'
import { Node } from '../index'
import { FindManyBlockArgs, Prisma } from '@prisma/client'
import { decodeCursor } from '../../utils/cursors'

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
          take: limit,
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

        const results = await ctx.db.block.findMany({
          ...filtersQuery,
          ...queryConfig,
        })
      },
    })
  },
})
