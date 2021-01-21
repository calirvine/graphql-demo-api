import {
  objectType,
  extendType,
  inputObjectType,
  extendInputType,
  nonNull,
  stringArg,
  arg,
} from 'nexus'
import { LinkData } from '../../typeDefs'

export const link = objectType({
  name: 'LinkBlock',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('title')
    t.nonNull.string('url')
    t.nonNull.string('label')
  },
})

export const extendImage = extendType({
  type: 'ImageBlock',
  definition(t) {
    t.field('link', {
      type: 'LinkBlock',
      async resolve({ linkId }, _, { db }) {
        if (!linkId) return null
        const link = await db.block.findUnique({ where: { id: linkId } })
        if (!link) return null
        return {
          ...link,
          ...(JSON.parse(link.data) as LinkData),
          typeName: 'LinkBlock',
        }
      },
    })
  },
})

export const linkInput = inputObjectType({
  name: 'LinkInputs',
  definition(t) {
    t.nonNull.string('title')
    t.nonNull.string('url')
    t.nonNull.string('label')
  },
})
export const extendImageInputs = extendInputType({
  type: 'ImageInputs',
  definition(t) {
    t.nullable.field('link', {
      type: 'LinkInputs',
    })
  },
})

export const linkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getLinkBlockById', {
      type: 'LinkBlock',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const block = await ctx.db.block.findUnique({ where: { id } })
        if (!block) return null
        const data = JSON.parse(block.data) as LinkData
        return { ...block, ...data, typeName: 'LinkBlock' }
      },
    })
    t.list.field('getLinkBlocks', {
      type: 'LinkBlock',
      async resolve(_, __, ctx) {
        const blocks = await ctx.db.block.findMany({
          where: { typeName: 'LinkBlock' },
        })
        return blocks.map(({ data, ...ImageBlock }) => {
          const image = JSON.parse(data) as LinkData
          return { ...ImageBlock, ...image, typeName: 'LinkBlock' }
        })
      },
    })
  },
})

export const linkMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createLink', {
      type: 'LinkBlock',
      args: {
        LinkInputs: nonNull(arg({ type: 'LinkInputs' })),
      },
      async resolve(_, { LinkInputs }, ctx) {
        const data = JSON.stringify(LinkInputs)
        const block = await ctx.db.block.create({
          data: { typeName: 'LinkBlock', data },
        })
        return { ...block, ...LinkInputs, typeName: 'LinkBlock' }
      },
    })
    t.field('deleteLinkBlock', {
      type: 'Boolean',
      args: { id: nonNull(stringArg()) },
      resolve(_, { id }, ctx) {
        if (!id) return false
        ctx.db.block.delete({ where: { id } })
        return true
      },
    })
    t.field('updateLinkBlock', {
      type: 'LinkBlock',
      args: {
        id: nonNull(stringArg()),
        LinkInputs: nonNull(arg({ type: 'LinkInputs' })),
      },
      async resolve(_, { id, LinkInputs }, ctx) {
        const block = await ctx.db.block.update({
          where: { id },
          data: { data: JSON.stringify(LinkInputs) },
        })
        return { ...block, ...LinkInputs, typeName: 'LinkBlock' }
      },
    })
  },
})
