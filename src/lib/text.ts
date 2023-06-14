/**
 * @author 爱呵呵
 * @description 生成docx.Paragraph段落 
 * 选项接口，定义了用于创建段落的各种选项
 */

import * as docx from "docx";

/**
 * 段落选项接口
 * @interface IParagraphOptions
 * @property {string} text - 段落文本内容
 * @property {string} [font] - 字体名称
 * @property {number} [size] - 字体大小
 * @property {string} [color] - 字体颜色
 * @property {boolean} [bold] - 是否加粗
 * @property {boolean} [italics] - 是否倾斜
 * @property {docx.AlignmentType} [alignment] - 段落对齐方式
 * @property {boolean} [pageBreak] - 是否分页
 * @property {number} [line] - 行高
 * @property {docx.IIndentAttributesProperties} [indent] - 缩进
 * @property {number} [spacingAfter] - 段后间距
 * @property {number} [spacingBefore] - 段前间距
 */
 interface IParagraphOptions {
	text: string;
	font?: string;
	size?: number;
	color?: string;
	bold?: boolean;
	italics?: boolean;
	alignment?: docx.AlignmentType;
	pageBreak?: boolean;
	line?: number;
	indent?: docx.IIndentAttributesProperties;
	spacingAfter?: number;
	spacingBefore?: number;
}

/**
 * 使用提供的选项创建一个段落
 * @function createParagraph
 * @param {IParagraphOptions} options - 段落选项
 * @returns {docx.Paragraph} - 创建的段落
 */
function createParagraph(options: IParagraphOptions) {
	const {
		text,
		font = "Arial",
		size = 28,
		color = "000000",
		bold = false,
		italics = false,
		alignment = docx.AlignmentType.LEFT,
		pageBreak = false,
		indent = {},
		spacingBefore = 0,
		spacingAfter = 0,
		line = 1
	} = options;

	const Text = new docx.TextRun({
		text,
		bold,
		italics,
		color,
		size,
		font,
	})

	const children = [Text]
	if (pageBreak) {
		children.push(new docx.PageBreak())
	}

	const paragraph = new docx.Paragraph({
		children,
		alignment,
		spacing: {
			before: spacingBefore,
			after: spacingAfter,
			line: line * 240
		},
		indent
	})

	return paragraph;
}

export {
	createParagraph
}

