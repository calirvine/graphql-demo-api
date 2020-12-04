import { makeSchema } from '@nexus/schema'
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
  typegenAutoConfig: {
    sources: [{ source: require.resolve('./context'), alias: 'ContextModule' }],
    contextType: 'ContextModule.Context',
  },
})
