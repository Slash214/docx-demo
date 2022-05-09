const urlToBase64 = (url:string) => {
    return new Promise((resolve, reject) => {
        let image = new Image()
        image.setAttribute("crossOrigin",'Anonymous');
        image.onload = () => {
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            canvas.getContext('2d')?.drawImage(image, 0, 0)
            const result = canvas.toDataURL('image/png')
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