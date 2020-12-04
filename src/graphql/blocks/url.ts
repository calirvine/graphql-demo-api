import {
  objectType,
  inputObjectType,
  extendType,
  arg,
  nonNull,
  stringArg,
} from '@nexus/schema'
import { TYPE_NAMES } from '../index'

export interface IUrlData {
  url: string
  label: string
}
export interface IUrl extends IUrlData {
  id: string
}

export const urlType = objectType({
  name: 'UrlBlock',
  description: 'An object containing all the data required to build a link',
  definition(t) {
    t.id('id')
    t.string('url')
    t.string('label')
  },
})

export const urlInputs = inputObjectType({
  name: 'UrlInputs',
  definition(t) {
    t.nonNull.string('url')
    t.nonNull.string('label')
  },
})
export const urlQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getUrlBlockById', {
      type: 'UrlBlock',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const block = await ctx.db.block.findUnique({ where: { id } })
        if (!block) return null
        const data: IUrlData = JSON.parse(block.data)
        return { id: block.id, ...data }
      },
    })
    t.list.field('getUrlBlocks', {
      type: 'UrlBlock',
      async resolve(_, __, ctx) {
        const blocks = await ctx.db.block.findMany({
          where: { typeName: TYPE_NAMES.URL },
        })
        return blocks.map(({ id, data }) => {
          const url: IUrlData = JSON.parse(data)
          return { id, ...url }
        })
      },
    })
  },
})
export const urlMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUrl', {
      type: 'UrlBlock',
      args: {
        UrlInputs: nonNull(arg({ type: 'UrlInputs' })),
      },
      async resolve(_, { UrlInputs }, ctx) {
        const data = JSON.stringify(UrlInputs)
        const block = await ctx.db.block.create({
          data: { typeName: TYPE_NAMES.URL, data },
        })
        return { id: block.id, ...JSON.parse(block.data) }
      },
    })
    t.field('deleteUrlBlock', {
      type: 'Boolean',
      args: { id: nonNull(stringArg()) },
      resolve(_, { id }, ctx) {
        if (!id) return false
        ctx.db.block.delete({ where: { id } })
        return true
      },
    })
    t.field('updateUrlBlock', {
      type: 'UrlBlock',
      args: {
        id: nonNull(stringArg()),
        UrlInputs: nonNull(arg({ type: 'UrlInputs' })),
      },
      async resolve(_, { id, UrlInputs }, ctx) {
        const block = await ctx.db.block.update({
          where: { id },
          data: { data: JSON.stringify(UrlInputs) },
        })
        return { id: block.id, ...JSON.parse(block.data) }
      },
    })
  },
})
