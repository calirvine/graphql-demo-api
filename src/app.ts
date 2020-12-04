import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { db } from './datasources/db'

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { db, req }
  },
})

export function start(PORT = 4000) {
  server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
}
