import { PrismaClient } from '@prisma/client'
import { Request } from 'apollo-server'
import { ImageProcessor } from './services/ImageProcessor'
import { StorageService } from './services/storage'

export interface Context {
  db: PrismaClient
  req: Request
  imageProcessor: ImageProcessor
  storageService: StorageService
}
