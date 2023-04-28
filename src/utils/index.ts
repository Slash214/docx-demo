/**
 * 将图片 url 转成 base64 格式
 * @param url 图片地址
 * @param width 图片宽度
 * @param height 图片高度
 * @return base64 编码
 */
export async function imageToBase64(url: string, width?: number, height?: number):Promise<string> {
	try {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = url
		await new Promise((resolve, reject) => {
			img.onload = resolve
			img.onerror = reject
		})

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('Failed to get canvas context')
		canvas.width = width ?? img.width
		canvas.height = height ?? img.height
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		return canvas.toDataURL('image/png')
	} catch (error) {
		throw new Error(`Failed to convert image: ${error}`);
	} 
}