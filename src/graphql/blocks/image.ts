import {
  objectType,
  inputObjectType,
  extendType,
  arg,
  stringArg,
  nonNull,
} from 'nexus'

import { TYPE_NAMES, ImageData } from '../../typeDefs'

export const image = objectType({
  name: 'Image',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('previewDataUri')
    t.nonNull.string('srcPath')
  },
})

export const imageBlock = objectType({
  name: 'ImageBlock',
  description: 'All of the elements needed to make an image',
  definition(t) {
    t.id('id')
    t.field('image', {
      type: 'Image',
      async resolve(ImageBlock, _, { db }) {
        const asset = await db.asset.findUnique({
          where: { id: ImageBlock.assetId },
        })
        if (!asset) throw new Error('Image asset doesnt exist :(')
        const srcPath = `${process.env.ROOT_URL}/images/${asset.id}`
        const previewDataUri = asset.previewUri
        return { id: asset.id, srcPath, previewDataUri }
      },
    })
    t.string('altText')
  },
})

export const imageInputs = inputObjectType({
  name: 'ImageInputs',
  definition(t) {
    t.nonNull.string('assetId')
    t.nonNull.string('altText')
    t.nonNull.string('title')
  },
})
export const imageQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getImageBlockById', {
      type: 'ImageBlock',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const block = await ctx.db.block.findUnique({ where: { id } })
        if (!block) return null
        const data = JSON.parse(block.data) as ImageData
        return { ...block, ...data, typeName: TYPE_NAMES.IMAGE }
      },
    })
    t.list.field('getImageBlocks', {
      type: 'ImageBlock',
      async resolve(_, __, ctx) {
        const blocks = await ctx.db.block.findMany({
          where: { typeName: TYPE_NAMES.IMAGE },
        })
        return blocks.map(({ data, ...ImageBlock }) => {
          const image = JSON.parse(data) as ImageData
          return { ...ImageBlock, ...image, typeName: TYPE_NAMES.IMAGE }
        })
      },
    })
  },
})
export const imageMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createImage', {
      type: 'ImageBlock',
      args: {
        ImageInputs: nonNull(arg({ type: 'ImageInputs' })),
      },
      async resolve(_, { ImageInputs }, ctx) {
        const data = JSON.stringify(ImageInputs)
        const block = await ctx.db.block.create({
          data: { typeName: TYPE_NAMES.IMAGE, data },
        })
        return { ...block, ...ImageInputs, typeName: TYPE_NAMES.IMAGE }
      },
    })
    t.field('deleteImageBlock', {
      type: 'Boolean',
      args: { id: nonNull(stringArg()) },
      resolve(_, { id }, ctx) {
        if (!id) return false
        ctx.db.block.delete({ where: { id } })
        return true
      },
    })
    t.field('updateImageBlock', {
      type: 'ImageBlock',
      args: {
        id: nonNull(stringArg()),
        ImageInputs: nonNull(arg({ type: 'ImageInputs' })),
      },
      async resolve(_, { id, ImageInputs }, ctx) {
        const block = await ctx.db.block.update({
          where: { id },
          data: { data: JSON.stringify(ImageInputs) },
        })
        return { ...block, ...ImageInputs, typeName: TYPE_NAMES.IMAGE }
      },
    })
  },
})
