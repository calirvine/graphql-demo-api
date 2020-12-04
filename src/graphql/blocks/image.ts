import {
  objectType,
  inputObjectType,
  extendType,
  arg,
  stringArg,
  nonNull,
  blocks,
} from '@nexus/schema'
import { IUrl } from './url'
import { TYPE_NAMES } from '../index'

export interface IImageData {
  src: string
  altText: string
  link?: IUrl
}
export interface IImage extends IImageData {
  id: string
}

export const ImageBlock = objectType({
  name: 'ImageBlock',
  description: 'All of the elements needed to make an image',
  definition(t) {
    t.id('id')
    t.string('src')
    t.string('altText')
    t.nullable.field('link', {
      type: 'UrlBlock',
    })
  },
})

export const imageInputs = inputObjectType({
  name: 'ImageInputs',
  definition(t) {
    t.nonNull.string('src')
    t.nonNull.string('altText')
    t.nullable.field('link', { type: 'UrlInputs' })
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
        const data: IImageData = JSON.parse(block.data)
        return { id: block.id, ...data }
      },
    })
    t.list.field('getImageBlocks', {
      type: 'ImageBlock',
      async resolve(_, __, ctx) {
        const blocks = await ctx.db.block.findMany({
          where: { typeName: TYPE_NAMES.IMAGE },
        })
        return blocks.map(({ id, data }) => {
          const image: IImageData = JSON.parse(data)
          return { id, ...image }
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
        return { id: block.id, ...JSON.parse(block.data) }
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
        return { id: block.id, ...JSON.parse(block.data) }
      },
    })
  },
})
