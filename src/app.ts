import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import express from 'express'
import multer from 'multer'
import cors from 'cors'

import { schema } from './schema'
import { db } from './datasources/db'
import { ImageProcessor } from './services/ImageProcessor'
import { FileStorageService } from './services/storage'

const imageProcessor = new ImageProcessor()

//replace with s3 storage service in production
const storageService = new FileStorageService(path.join(__dirname, 'public'))

const app = express()

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { db, req }
  },
})

app.use('/assets', express.static(path.join(__dirname, 'public')))

app.use(cors())

const uploads = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
})

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

app.post('/upload', uploads.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send({ error: 'No image present' })
  const { originalname, buffer, mimetype } = req.file
  if (!SUPPORTED_MIME_TYPES.includes(mimetype))
    return res.status(400).send({ error: 'Unsupported file format' })

  const result = await imageProcessor.processForDisplay(buffer, originalname)
  if (!result) return res.status(500).send({ error: 'Unable to process image' })
  const { files, previewUri, metadata, baseName } = result

  const savedFile = await storageService.save(files)

  if (!savedFile) return res.status(500).send({ error: 'File storage failed' })

  const { id } = savedFile

  const asset = {
    id,
    baseName,
    metadata: JSON.stringify(metadata),
    hasThumbnail: files.length > 1,
    hasSmall: files.length > 2,
    hasMedium: files.length > 3,
    hasLarge: files.length > 4,
    previewUri,
  }
  const record = await db.asset.create({ data: asset })
  return res.status(201).send({ id: record.id })
})

server.applyMiddleware({ app })

export function start(PORT = 4000) {
  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready on port ${PORT}\n🚀 graphql is available at ${server.graphqlPath}`,
    ),
  )
}
