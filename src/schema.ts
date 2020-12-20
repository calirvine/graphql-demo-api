import { makeSchema } from 'nexus'
import * as typeDefs from './graphql'
import { join } from 'path'

export const schema = makeSchema({
  types: typeDefs,
  outputs: {
    typegen: join(
      __dirname,
      '..',
      'node_modules',
      '@types',
      'typegen-nexus',
      'index.d.ts',
    ),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: require.resolve('./context.ts'),
    export: 'Context',
  },
})
