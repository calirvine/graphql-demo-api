export type FileTypes = 'image' | 'video' | 'document'

export interface IFile {
  file: Buffer
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  fileName: string
}

interface IPath {
  path: string
}

interface ITypeAndId {
  type: string
  id: string
}

export type FilePath = IPath | ITypeAndId

export abstract class StorageService {
  constructor() {}

  abstract save(
    files: IFile | IFile[],
    type?: FileTypes,
  ): Promise<{ id: string; type: string } | false>
  abstract delete(filePath: FilePath): Promise<boolean>
}
