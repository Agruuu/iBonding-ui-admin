import * as FileApi from '@/api/infra/file'
import CryptoJS from 'crypto-js'
import { UploadRawFile, UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import axios from 'axios'

/**
 * Obtain upload URL
 */
export const getUploadUrl = (): string => {
  return import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/infra/file/upload'
}

export const useUpload = () => {
  // Backend upload address
  const uploadUrl = getUploadUrl()
  // Do you want to use front-end direct connection for uploading
  const isClientUpload = UPLOAD_TYPE.CLIENT === import.meta.env.VITE_UPLOAD_TYPE
  // rewriteElUploadUpload method
  const httpRequest = async (options: UploadRequestOptions) => {
    // Mode 1：Front end upload
    if (isClientUpload) {
      // 1.1 Generate file name
      const fileName = await generateFileName(options.file)
      // 1.2 Obtain the pre signed address of the file
      const presignedInfo = await FileApi.getFilePresignedUrl(fileName)
      // 1.3 Upload files（out of commission ElUpload of ajaxUpload Reasons for the method：It uses FormData upload，Minio I won't support it）
      return axios
        .put(presignedInfo.uploadUrl, options.file, {
          headers: {
            'Content-Type': options.file.type
          }
        })
        .then(() => {
          // 1.4. Record file information to the backend（asynchronous）
          createFile(presignedInfo, fileName, options.file)
          // Notification successful，Keep the data format consistent with the returned results uploaded by the backend
          return { data: presignedInfo.url }
        })
    } else {
      // Mode 2：Backend upload
      // rewrite el-upload httpRequest The successful file upload will trigger a successful hook，Failed, walk the hook of failure
      return new Promise((resolve, reject) => {
        FileApi.updateFile({ file: options.file })
          .then((res) => {
            if (res.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch((res) => {
            reject(res)
          })
      })
    }
  }

  return {
    uploadUrl,
    httpRequest
  }
}

/**
 * Create file information
 * @param vo Pre signature information for files
 * @param name File Name
 * @param file file
 */
function createFile(vo: FileApi.FilePresignedUrlRespVO, name: string, file: UploadRawFile) {
  const fileVo = {
    configId: vo.configId,
    url: vo.url,
    path: name,
    name: file.name,
    type: file.type,
    size: file.size
  }
  FileApi.createFile(fileVo)
  return fileVo
}

/**
 * Generate file name（Using algorithmsSHA256）
 * @param file The file to be uploaded
 */
async function generateFileName(file: UploadRawFile) {
  // Read file content
  const data = await file.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(data)
  // calculation SHA256
  const sha256 = CryptoJS.SHA256(wordArray).toString()
  // Splicing suffix
  const ext = file.name.substring(file.name.lastIndexOf('.'))
  return `${sha256}${ext}`
}

/**
 * Upload type
 */
enum UPLOAD_TYPE {
  // Upload directly from the client（Only supportedS3service）
  CLIENT = 'client',
  // Client sends to backend for upload
  SERVER = 'server'
}
