import sharp from 'sharp'
import { IFile } from './storage'

interface IMetadata {
  height: number
  width: number
  aspectRatio: number
}

export class ImageProcessor {
  async processForDisplay(
    imageBuffer: Buffer,
    originalName: string,
  ): Promise<
    | {
        previewUri: string
        files: IFile[]
        metadata: IMetadata
        baseName: string
      }
    | false
  > {
    try {
      const sharpInstance = sharp(imageBuffer)
      const { height, width } = await sharpInstance.metadata()
      const aspectRatio = width && height ? width / height : 0

      const metadata: IMetadata = {
        height: height || 0,
        width: width || 0,
        aspectRatio: aspectRatio,
      }

      const images = [
        sharpInstance
          .clone()
          .resize(200, undefined, {
            fit: 'contain',
          })
          .png()
          .toBuffer(),

        metadata.width >= 300
          ? sharpInstance
              .clone()
              .resize(300, undefined, { fit: 'contain' })
              .png()
              .toBuffer()
          : null,

        metadata.width >= 600
          ? sharpInstance
              .clone()
              .resize(600, undefined, { fit: 'contain' })
              .png()
              .toBuffer()
          : null,
        metadata.width >= 1400
          ? sharpInstance
              .clone()
              .resize(1400, undefined, { fit: 'contain' })
              .png()
              .toBuffer()
          : sharpInstance.png().toBuffer(),
      ].filter((image): image is Promise<Buffer> => image !== null)

      const fileNamePrefixes = ['thumbnail', 'small', 'medium', 'large']
      let counter = 0

      const nameParts = originalName.split('.')
      nameParts.pop()
      const fileName = nameParts.join('.')
      const baseName = `${fileName}.png`

      const files: IFile[] = await Promise.all(images).then(res =>
        res.map(image => {
          const count = counter++
          const fileNamePrefix = fileNamePrefixes[count] as
            | 'thumbnail'
            | 'small'
            | 'medium'
            | 'large'

          return {
            file: image,
            size: fileNamePrefix,
            fileName: `${fileNamePrefix}-${baseName}`,
          }
        }),
      )

      const preview = await Promise.all([
        sharpInstance
          .clone()
          .resize(20, undefined, {
            fit: 'contain',
          })
          .png()
          .toBuffer(),
        sharpInstance.png().toBuffer(),
      ])

      files.push({
        fileName: `original-${fileName}.png`,
        size: 'original',
        file: preview[1],
      })

      return {
        previewUri: preview[0].toString('base64'),
        files,
        metadata,
        baseName,
      }
    } catch (err) {
      return false
    }
  }
}
