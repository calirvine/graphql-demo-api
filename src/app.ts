import { ApolloServer } from 'apollo-server'
import path from 'path'

import { schema } from './schema'
import { db } from './datasources/db'
import { ImageProcessor } from './services/ImageProcessor'
import { FileStorageService } from './services/storage'

const imageProcessor = new ImageProcessor()

//replace with s3 storage service in production
const storageService = new FileStorageService(path.join(__dirname, 'public'))

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { db, req, imageProcessor, storageService }
  },
})

export function start(PORT = 4000) {
  server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
}
