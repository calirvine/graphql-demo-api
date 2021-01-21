import {
  inputObjectType,
  objectType,
  extendType,
  nonNull,
  arg,
  stringArg,
} from 'nexus'
import { CopyData, ImageData, LinkData, HeroSectionData } from '../../typeDefs'

export const hero = objectType({
  name: 'HeroSection',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('sectionName')
    t.nonNull.field('copy', {
      type: 'CopyBlock',
      async resolve({ copyId }, _, { db }) {
        const copy = await db.block.findUnique({
          where: { id: copyId },
        })
        if (!copy) throw new Error('Copy block reference doesnt exist')
        const data = JSON.parse(copy.data) as CopyData
        return { ...copy, ...data, typeName: 'CopyBlock' }
      },
    })
    t.nonNull.field('image', {
      type: 'ImageBlock',
      async resolve({ imageId }, _, { db }) {
        const image = await db.block.findUnique({
          where: { id: imageId },
        })
        if (!image) throw new Error('Image block reference doesnt exist')
        const data = JSON.parse(image.data) as ImageData
        return { ...image, ...data, typeName: 'ImageBlock' }
      },
    })
    t.nullable.field('cta', {
      type: 'LinkBlock',
      async resolve({ linkId }, _, { db }) {
        if (!linkId) return null
        const cta = await db.block.findUnique({ where: { id: linkId } })
        if (!cta) throw new Error('Link block reference doesnt exist')
        const data = JSON.parse(cta.data) as LinkData
        return { ...cta, ...data, typeName: 'LinkBlock' }
      },
    })
  },
})

export const heroSectionInputs = inputObjectType({
  name: 'HeroSectionInputs',
  definition(t) {
    t.nonNull.string('sectionName')
    t.nonNull.string('copyId')
    t.nonNull.string('imageId')
    t.string('linkId')
  },
})

export const heroQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('getHeroSection', {
      type: 'HeroSection',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, { db }) {
        const section = await db.section.findUnique({ where: { id } })
        if (!section) return null
        const data = JSON.parse(section.data) as HeroSectionData
        return { ...section, ...data, typeName: 'HeroSection' }
      },
    })
  },
})

export const heroMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createHeroSection', {
      type: 'HeroSection',
      args: {
        HeroSectionInputs: nonNull(arg({ type: 'HeroSectionInputs' })),
      },
      async resolve(_, { HeroSectionInputs }, { db }) {
        const data = JSON.stringify(HeroSectionInputs)

        const section = await db.section.create({
          data: { typeName: 'HeroSection', data },
        })
        return {
          ...section,
          ...HeroSectionInputs,
          linkId: HeroSectionInputs.linkId ?? undefined,
          typeName: 'HeroSection',
        }
      },
    })
    t.field('updateHeroSection', {
      type: 'HeroSection',
      args: {
        id: nonNull(stringArg()),
        HeroSectionInputs: nonNull(arg({ type: 'HeroSectionInputs' })),
      },
      async resolve(_, { id, HeroSectionInputs }, { db }) {
        try {
          const section = await db.section.update({
            where: { id },
            data: { data: JSON.stringify(HeroSectionInputs) },
          })
          return {
            ...section,
            ...HeroSectionInputs,
            linkId: HeroSectionInputs.linkId ?? undefined,
            typeName: 'HeroSection',
          }
        } catch (err) {
          return null
        }
      },
    })
  },
})
