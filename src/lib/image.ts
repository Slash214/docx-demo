/**
 * @author 爱呵呵
 * @descrion 生成docx.ImageRun 图片返回
 */

import { ImageRun, } from "docx"


/**
 * 取得base64图片长宽与长宽比例
 * @param base64
 * @returns
 */
const scaleSize = (base64: string) => {
	const match = base64.match(/^data:image\/(\w+);base64,/);
	if (!match) {
		throw Error('unsupported image type');
	}
	const type = match[1];
	const bytes = atob(base64.slice(match[0].length));
	const buffer = new ArrayBuffer(bytes.length);
	const view = new Uint8Array(buffer);
	for (let i = 0; i < bytes.length; i++) {
		view[i] = bytes.charCodeAt(i);
	}
	let width = 0, height = 0;
	if (type === 'png') {
		width = (view[16] << 24) + (view[17] << 16) + (view[18] << 8) + view[19];
		height = (view[20] << 24) + (view[21] << 16) + (view[22] << 8) + view[23];
	}
	return {
		width,
		height,
		Proportions: width / height
	};
}


/**
 * 创建一个新的图片对象
 * @param base64 - 一个base64编码的图像
 * @param imgWidth - 图像的宽度（可选）
 * @param alignment - 图像应该如何对齐（默认为左对齐）
 * @returns 一个新的ImageRun对象
 */
const createImageRun = (base64: string, imgWidth?: number): ImageRun => {
	// 固定图片容器大小
	let width = 170
	if (imgWidth) width = imgWidth
	const whp = scaleSize(base64)
	return new ImageRun({
		data: base64,
		transformation: {
			width,
			height: width / whp.Proportions
		},
	})
}

export {
	createImageRun
}