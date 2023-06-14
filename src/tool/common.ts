const urlToBase64 = (url: string, width = 0): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.setAttribute("crossOrigin", 'Anonymous');
        image.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            let lastWidth = 0, lastHeight = 0
            if (width) {
                const scaleFactor = width / image.width
                const targetHeight = image.height * scaleFactor
                canvas.width = width
                canvas.height = targetHeight
                lastHeight = targetHeight
                lastWidth = width
            } else {
                canvas.width = image.width
                canvas.height = image.height
                lastHeight = image.height
                lastWidth = image.width
            }
            
            let type = width ? 'image/png' : 'image/jpeg'
            ctx?.drawImage(image, 0, 0, lastWidth, lastHeight)
            const result = canvas.toDataURL(type)
            resolve(result)
        }
        image.src = url
        image.onerror = () => {
            reject(new Error('图片流异常'))
        }
    })
}



export {
    urlToBase64
}
