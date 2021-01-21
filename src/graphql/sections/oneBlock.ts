import {
  inputObjectType,
  objectType,
  extendType,
  nonNull,
  arg,
  stringArg,
} from 'nexus'

import { CopyData, LinkData, OneBlockSectionData } from '../../typeDefs'

export const oneBlock = objectType({
  name: 'OneBlockSection',
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

    t.nonNull.field('cta', {
      type: 'LinkBlock',
      async resolve({ linkId }, _, { db }) {
        const cta = await db.block.findUnique({ where: { id: linkId } })
        if (!cta) throw new Error('Link block reference doesnt exist')
        const data = JSON.parse(cta.data) as LinkData
        return { ...cta, ...data, typeName: 'LinkBlock' }
      },
    })
  },
})

export const oneBlockSectionInputs = inputObjectType({
  name: 'OneBlockSectionInputs',
  definition(t) {
    t.nonNull.string('sectionName')
    t.nonNull.string('copyId')
    t.nonNull.string('linkId')
  },
})

export const oneBlockQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('getOneBlockSection', {
      type: 'OneBlockSection',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, { db }) {
        const section = await db.section.findUnique({ where: { id } })
        if (!section) return null
        const data = JSON.parse(section.data) as OneBlockSectionData
        return { ...section, ...data, typeName: 'OneBlockSection' }
      },
    })
  },
})

export const oneBlockMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOneBlockSection', {
      type: 'OneBlockSection',
      args: {
        OneBlockSectionInputs: nonNull(arg({ type: 'OneBlockSectionInputs' })),
      },
      async resolve(_, { OneBlockSectionInputs }, { db }) {
        const data = JSON.stringify(OneBlockSectionInputs)

        const section = await db.section.create({
          data: { typeName: 'OneBlockSection', data },
        })
        return {
          ...section,
          ...OneBlockSectionInputs,
          linkId: OneBlockSectionInputs.linkId ?? undefined,
          typeName: 'OneBlockSection',
        }
      },
    })
    t.field('updateOneBlockSection', {
      type: 'OneBlockSection',
      args: {
        id: nonNull(stringArg()),
        OneBlockSectionInputs: nonNull(arg({ type: 'OneBlockSectionInputs' })),
      },
      async resolve(_, { id, OneBlockSectionInputs }, { db }) {
        try {
          const section = await db.section.update({
            where: { id },
            data: { data: JSON.stringify(OneBlockSectionInputs) },
          })
          return {
            ...section,
            ...OneBlockSectionInputs,
            linkId: OneBlockSectionInputs.linkId ?? undefined,
            typeName: 'OneBlockSection',
          }
        } catch (err) {
          return null
        }
      },
    })
  },
})
