export enum TYPE_NAMES {
  COPY = 'CopyBlock',
  IMAGE = 'ImageBlock',
  LINK = 'LinkBlock',
}

export interface Entity {
  id: string
  typeName: TYPE_NAMES
  timestamp: Date
}

export interface Asset {
  id: string
  baseName: string
  metadata: string
  previewUri: string
  hasThumbnail: boolean
  hasSmall: boolean
  hasMedium: boolean
  hasLarge: boolean
}

export interface CopyData {
  title: string
  copy: string
}

export interface CopyBlock extends Entity {
  typeName: TYPE_NAMES.COPY
  title: string
  copy: string
}

export interface ImageData {
  assetId: string
  altText: string
  linkId?: string
  title: string
}

export interface ImageBlock extends Entity {
  typeName: TYPE_NAMES.IMAGE
  assetId: string
  altText: string
  linkId?: string
  title: string
}

export interface LinkData {
  title: string
  url: string
  label: string
}

export interface LinkBlock extends Entity {
  typeName: TYPE_NAMES.LINK
  title: string
  url: string
  label: string
}
