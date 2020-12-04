import { db } from './db'

interface ISessionData {
  userId: string
  role: string
}

export type GetSession = Promise<ISessionData | null>

export async function getSession(token?: string): GetSession {
  if (!token) return null
  const session = await db.session.findUnique({ where: { id: token } })
  if (!session) return null
  if (session.expires && session.expires < new Date()) {
    db.session.delete({ where: { id: token } })
    return null
  }
  const data: ISessionData = JSON.parse(session.data)
  return data
}
