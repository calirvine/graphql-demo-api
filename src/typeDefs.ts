export type BlockTypeNames = 'CopyBlock' | 'ImageBlock' | 'LinkBlock'

export type SectionTypeNames = 'HeroSection' | 'OneBlockSection'

export interface Entity {
  id: string
  typeName: BlockTypeNames | SectionTypeNames
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

export interface CopyBlock extends Entity, CopyData {
  typeName: 'CopyBlock'
}

export interface ImageData {
  assetId: string
  altText: string
  linkId?: string
  title: string
}

export interface ImageBlock extends Entity, ImageData {
  typeName: 'ImageBlock'
}

export interface LinkData {
  title: string
  url: string
  label: string
}

export interface LinkBlock extends Entity, LinkData {
  typeName: 'LinkBlock'
}

export type BlockDataUnion = CopyData | LinkData | ImageData

export interface HeroSectionData {
  sectionName: string
  copyId: string
  imageId: string
  linkId?: string
}

export interface HeroSection extends Entity, HeroSectionData {
  typeName: 'HeroSection'
}

export interface OneBlockSectionData {
  sectionName: string
  copyId: string
  linkId: string
}

export interface OneBlockSection extends Entity, OneBlockSectionData {
  typeName: 'OneBlockSection'
}

export type SectionDataUnion = HeroSectionData | OneBlockSectionData
