const download0 = (data: Blob, fileName: string, mineType: string) => {
  // create blob
  const blob = new Blob([data], { type: mineType })
  // create href hyperlink，Click to download
  window.URL = window.URL || window.webkitURL
  const href = URL.createObjectURL(blob)
  const downA = document.createElement('a')
  downA.href = href
  downA.download = fileName
  downA.click()
  // Destroy hyperlinks
  window.URL.revokeObjectURL(href)
}

const download = {
  // download Excel method
  excel: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/vnd.ms-excel')
  },
  // download Word method
  word: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/msword')
  },
  // download Zip method
  zip: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/zip')
  },
  // download Html method
  html: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/html')
  },
  // download Markdown method
  markdown: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/markdown')
  },
  // download Json method
  json: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/json')
  },
  // Download images（Allow cross domain access）
  image: ({
    url,
    canvasWidth,
    canvasHeight,
    drawWithImageSize = true
  }: {
    url: string
    canvasWidth?: number // Specify canvas width
    canvasHeight?: number // Specify canvas height
    drawWithImageSize?: boolean // When drawing an image on a canvas, include the width and height values of the image, The default is to bring it along
  }) => {
    const image = new Image()
    // image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth || image.width
      canvas.height = canvasHeight || image.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      if (drawWithImageSize) {
        ctx.drawImage(image, 0, 0, image.width, image.height)
      } else {
        ctx.drawImage(image, 0, 0)
      }
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'image.png'
      a.click()
    }
  },
  base64ToFile: (base64: any, fileName: string) => {
    // Split the Base64 string by the comma (`,`) to separate the prefix from the subsequent content.
    const data = base64.split(',')
    // Use regular expressions to extract the image type information (such as `image/png`, `image/jpeg`, `image/webp`, etc.) from the prefix.
    const type = data[0].match(/:(.*?);/)[1]
    // Extract the specific file format suffix (e.g., `png`, `jpeg`, `webp`) from the image type information.
    const suffix = type.split('/')[1]
    // Use the `atob()` function to decode the Base64 data. The result is a file data stream, which will be output in the form of a string.
    const bstr = window.atob(data[1])
    // Obtain the length of the decoding result string
    let n = bstr.length
    // Create an equal length integer array based on the length of the decoding result string
    // But at the time of creation All elements have initial values of 0
    const u8arr = new Uint8Array(n)
    // Fill each element of the integer array with the UTF-16 code unit of the character at the corresponding position in the decoded result string.
    while (n--) {
      // charCodeAt()：Get the UTF - 16 code unit corresponding to the character at the given index.
      u8arr[n] = bstr.charCodeAt(n)
    }

    // Return the `File` object to the caller of the method.
    return new File([u8arr], `${fileName}.${suffix}`, {
      type: type
    })
  }
}

export default download
