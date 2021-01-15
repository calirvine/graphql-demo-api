import cuid from 'cuid'
import fs from 'fs'
import { StorageService, IFile, FileTypes, FilePath } from './StorageService'

export class FileStorageService extends StorageService {
  basePath: string
  constructor(basePath: string) {
    super()
    this.basePath = basePath
  }
  async save(
    files: IFile | IFile[],
    type?: FileTypes,
  ): Promise<{ id: string; type: string } | false> {
    try {
      const id = cuid()
      // TODO don't just make it image
      const fileType = type || 'image'
      if (Array.isArray(files)) {
        const uploads = files.map(file =>
          this.uploadFile({ ...file, id, type: fileType }),
        )
        await Promise.all(uploads)
        return { id, type: fileType }
      } else {
        await this.uploadFile({ ...files, id, type: fileType })
        return { id, type: fileType }
      }
    } catch (err) {
      return false
    }
  }

  // TODO implement delete
  async delete(filePath: FilePath): Promise<boolean> {
    return true
  }

  private async uploadFile({
    id,
    type,
    file,
    fileName,
  }: IFile & { id: string; type: FileTypes }): Promise<boolean> {
    return new Promise(resolve => {
      const path = `${this.basePath}/${type}s/${id}`
      fs.mkdir(path, { recursive: true }, err => {
        if (err) console.error(err)
        fs.writeFile(`${path}/${fileName}`, file, err => {
          if (err) {
            console.error({ err })
            return resolve(false)
          }
          return resolve(true)
        })
      })
    })
  }
}
