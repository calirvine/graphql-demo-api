import Base64 from 'base-64'

export function encodeCursor(timestamp: Date) {
  return Base64.encode(timestamp.toISOString())
}

export function decodeCursor(cursor: string) {
  return new Date(Base64.decode(cursor))
}
