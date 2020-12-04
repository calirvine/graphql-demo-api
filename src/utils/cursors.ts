import Base64 from 'base-64'

export function encodeCursor(timestamp: string) {
  return Base64.encode(timestamp)
}

export function decodeCursor(cursor: string) {
  return Base64.decode(cursor)
}
