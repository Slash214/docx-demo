import { Paragraph, ImageRun, HorizontalPositionAlign, VerticalPositionAlign, IParagraphOptions } from 'docx';

/**
 * 创建一个背景图的段落
 *
 * @param base64Img - 一个 base64 编码的图像字符串
 * @param width - 图像的宽度，默认值为 795
 * @param height - 图像的高度，默认值为 1125
 * @returns 一个包含背景图的段落对象
 * @throws 如果 base64Img 为空或者不是一个有效的 base64 编码的字符串，会抛出一个错误
 *
 * @example
 * let base64Img = ...;  // 这里是你的 base64 编码的图像字符串
 * const backgroundImageParagraph = createBackgroundImageParagraph(base64Img, 795, 1125);
 * children.push(backgroundImageParagraph);
 *
 * @author 爱呵呵
 */
const createBackgroundImageParagraph = (base64Img: string, width: number = 795, height: number = 1125): Paragraph => {
	if (!base64Img) {
		throw new Error("Invalid image data. Please provide a valid base64 image.");
	}
	const paragraph: IParagraphOptions = {
		children: [
			new ImageRun({
				data: base64Img,
				transformation: {
					width: width,
					height: height,
				},
				floating: {
					zIndex: 0,
					behindDocument: true,
					allowOverlap: true,
					horizontalPosition: {
						align: HorizontalPositionAlign.LEFT
					},
					verticalPosition: {
						align: VerticalPositionAlign.CENTER
					},
				},
			}),
		]
	};

	return new Paragraph(paragraph);
};

export {
	createBackgroundImageParagraph
}
