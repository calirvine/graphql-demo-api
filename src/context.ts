import { PrismaClient } from '@prisma/client'
import { Request } from 'apollo-server'

export interface Context {
  db: PrismaClient
  req: Request
}
