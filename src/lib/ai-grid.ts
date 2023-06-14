import { ImageRun  } from 'docx'

const createImageRun = (imageBase64: string, maxWidth: number, maxHeight: number) => {
	// 获取原始图片的宽度和高度，这需要你的图片库支持
	const { width: originalWidth, height: originalHeight } = getOriginalSize(imageBase64)
  
	// 计算缩放比例
	const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
  
	// 计算缩放后的尺寸
	const width = originalWidth * ratio
	const height = originalHeight * ratio
  
	// 创建并返回 ImageRun 对象，这需要你的 docx 库支持
	return new ImageRun({
	  data: Buffer.from(imageBase64, 'base64'),
	  transformation: {
		width: width,
		height: height
	  }
	})
  }

const createImgeCell = (imageBase64: string, cellWidth: number, cellHeight: number, borer: any) => {
	const image = createImageRun
}