import {
  objectType,
  extendType,
  inputObjectType,
  nonNull,
  stringArg,
} from 'nexus'

import { HeroSectionData, OneBlockSectionData } from '../../typeDefs'

export const page = objectType({
  name: 'Page',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('slug')
    t.nonNull.list.nonNull.field('sections', {
      type: 'SectionUnion',
      async resolve({ id }, _, { db }) {
        const page = await db.page.findUnique({
          where: { id },
          include: { sections: { include: { section: true } } },
        })
        if (!page) throw new Error('Page doesnt exist')
        return page.sections.map(({ section }) => {
          if (section.typeName === 'OneBlockSection') {
            const data = JSON.parse(section.data) as OneBlockSectionData
            return {
              ...section,
              ...data,
              typeName: 'OneBlockSection',
            }
          }
          if (section.typeName === 'HeroSection') {
            const data = JSON.parse(section.data) as HeroSectionData
            return {
              ...section,
              ...data,
              typeName: 'HeroSection',
            }
          }
          throw new Error('Section returned that doesnt exist')
        })
      },
    })
  },
})

export const pageQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('getPageBySlug', {
      type: 'Page',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve(_, { slug }, { db }) {
        return db.page.findUnique({ where: { slug } })
      },
    })
    t.nonNull.list.nonNull.field('getAllPages', {
      type: 'Page',
      resolve(_, __, { db }) {
        return db.page.findMany()
      },
    })
  },
})

export const newPageInput = inputObjectType({
  name: 'NewPageInputs',
  definition(t) {
    t.nonNull.string('slug')
    t.list.nonNull.string('sectionIds')
  },
})

export const addSectionToPageInput = inputObjectType({
  name: 'AddSectionToPageInputs',
  definition(t) {
    t.nonNull.string('slug')
    t.nonNull.string('sectionId')
  },
})

export const pageMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPage', {
      type: 'Page',
      args: {
        PageInputs: nonNull('NewPageInputs'),
      },
      async resolve(_, { PageInputs }, { db }) {
        const connectSections = PageInputs.sectionIds
          ? PageInputs.sectionIds.map(id => ({ id }))
          : undefined
        return db.page.create({
          data: {
            slug: PageInputs.slug,
            sections: {
              connect: connectSections,
            },
          },
        })
      },
    })
    t.field('addSectionToPage', {
      type: 'Page',
      args: {
        PageInputs: nonNull('AddSectionToPageInputs'),
      },
      resolve(_, { PageInputs: { sectionId, slug } }, { db }) {
        return db.page.update({
          data: {
            sections: {
              connect: { id: sectionId },
            },
          },
          where: {
            slug,
          },
        })
      },
    })
  },
})
