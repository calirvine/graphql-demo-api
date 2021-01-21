import {
  arg,
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from 'nexus'
import { CopyData } from '../../typeDefs'

export const copyBlock = objectType({
  name: 'CopyBlock',
  description: 'A title and some text',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('title')
    t.nonNull.string('copy')
  },
})
export const copyInputs = inputObjectType({
  name: 'CopyInputs',
  definition(t) {
    t.nonNull.string('title')
    t.nonNull.string('copy')
  },
})
export const copyQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getCopyBlockById', {
      type: 'CopyBlock',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const block = await ctx.db.block.findUnique({ where: { id } })
        if (!block) return null
        const data = JSON.parse(block.data) as CopyData
        return { ...block, ...data, typeName: 'CopyBlock' }
      },
    })
    t.list.field('getCopyBlocks', {
      type: 'CopyBlock',
      async resolve(_, __, ctx) {
        const blocks = await ctx.db.block.findMany({
          where: { typeName: 'CopyBlock' },
        })
        return blocks.map(({ data, ...rest }) => {
          const copy = JSON.parse(data) as CopyData
          return { ...rest, ...copy, typeName: 'CopyBlock' }
        })
      },
    })
  },
})
export const copyMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCopy', {
      type: 'CopyBlock',
      args: {
        CopyInputs: nonNull(arg({ type: 'CopyInputs' })),
      },
      async resolve(_, { CopyInputs }, ctx) {
        const data = JSON.stringify(CopyInputs)
        const block = await ctx.db.block.create({
          data: { typeName: 'CopyBlock', data },
        })
        return { id: block.id, ...JSON.parse(block.data) }
      },
    })
    t.field('deleteCopyBlock', {
      type: 'Boolean',
      args: { id: nonNull(stringArg()) },
      resolve(_, { id }, ctx) {
        if (!id) return false
        ctx.db.block.delete({ where: { id } })
        return true
      },
    })
    t.field('updateCopyBlock', {
      type: 'CopyBlock',
      args: {
        id: nonNull(stringArg()),
        CopyInputs: nonNull(arg({ type: 'CopyInputs' })),
      },
      async resolve(_, { id, CopyInputs }, ctx) {
        const block = await ctx.db.block.update({
          where: { id },
          data: { data: JSON.stringify(CopyInputs) },
        })
        return { id: block.id, ...JSON.parse(block.data) }
      },
    })
  },
})
