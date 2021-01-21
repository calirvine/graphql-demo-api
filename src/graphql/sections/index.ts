import { unionType } from 'nexus'

export * from './hero'
export * from './oneBlock'

export const sectionUnion = unionType({
  name: 'SectionUnion',
  definition(t) {
    t.members('HeroSection', 'OneBlockSection')
  },
  resolveType: member => {
    return member.typeName
  },
})
