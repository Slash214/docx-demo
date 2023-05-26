/**
 * @author 爱呵呵
 * @descrion 生成docx.ImageRun 图片返回
 */

import { HorizontalPositionAlign, ImageRun, VerticalPositionAlign } from "docx"

/**
 * 用于确定图片应该如何对齐的枚举
 */
enum ImageAlignment {
	Left = "LEFT",
	Center = "CENTER",
	Right = "RIGHT"
}

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
	} else if (type === 'jpeg' || type === 'jpg') {
		let i = 0;
		while (view[i] === 255 && view[i + 1] === 216) {
			i += 2;
			while (view[i] !== 255) {
				i++;
			}
			while (view[i] === 255) {
				i++;
			}
			const marker = view[i];
			i += 2;
			if ((marker & 0xf0) === 0xc0 || (marker & 0xf0) === 0xd0 || (marker & 0xf0) === 0xe0) {
				height = (view[i] << 8) + view[i + 1];
				width = (view[i + 2] << 8) + view[i + 3];
				break;
			}
			i += (view[i] << 8) + view[i + 1];
		}
	} else if (type === 'gif') {
		width = (view[7] << 8) + view[6];
		height = (view[9] << 8) + view[8];
	} else if (type === 'bmp') {
		width = (view[21] << 24) + (view[20] << 16) + (view[19] << 8) + view[18];
		height = (view[25] << 24) + (view[24] << 16) + (view[23] << 8) + view[22];
	} else {
		throw Error('unsupported image type');
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
	let whp = scaleSize(base64)
	let newHeight = width / whp.Proportions
	// const horizontalAlignment =
	// 	alignment === ImageAlignment.Center ? HorizontalPositionAlign.CENTER :
	// 		alignment === ImageAlignment.Right ? HorizontalPositionAlign.RIGHT :
	// 			HorizontalPositionAlign.LEFT;
	return new ImageRun({
		data: base64,
		transformation: {
			width,
			height: newHeight
		},
		// floating: {
		// 	zIndex: 0,
		// 	behindDocument: false,
		// 	allowOverlap: true,
		// 	horizontalPosition: {
		// 		align: horizontalAlignment,
		// 	},
		// 	verticalPosition: {
		// 		align: VerticalPositionAlign.CENTER,
		// 	},
		// },
	})
}

export {
	createImageRun,
	ImageAlignment
}