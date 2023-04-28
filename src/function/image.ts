import { ImageRun } from "docx"

/**
 * 根据图片的base64编码获取图片长宽及长宽比例
 * @param base64 图片base64编码
 * @returns 包含图片长宽及长宽比例的对象
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


const DEFAULT_IMAGE_WIDTH = 240;

/**
 * 生成等比缩放的docx.ImageRun对象。
 *
 * @param {string} base64 - 图片的base64编码。
 * @param {number} [imgWidth=170] - 图片的宽度。
 * @returns {ImageRun} - 生成的docx.ImageRun对象。
 * @throws {Error} - 当不支持的图片类型或base64编码错误时抛出异常。
 */
const createImageRun = (base64: string, imgWidth = DEFAULT_IMAGE_WIDTH): ImageRun => {
	// 获取图片长宽与长宽比例
	const whp = scaleSize(base64);
	// 根据传入宽度计算等比缩放后的高度
	const newHeight = Math.round(imgWidth / whp.Proportions)
	return new ImageRun({
		data: base64,
		transformation: {
			width: imgWidth,
			height: newHeight
		}
	});
};

export {
	createImageRun
}