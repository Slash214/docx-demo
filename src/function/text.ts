import * as docx from 'docx'

interface IParagraphOptions {
	text: string;
	fontName?: string;
	fontSize?: number;
	color?: string;
	bold?: boolean;
	italics?: boolean
	alignment?: docx.AlignmentType;
	pageBreak?: boolean;
	spacingAfter?: number;
	spacingBefore?: number
}

const defaultParagraphOptions: IParagraphOptions = {
	text: '',
	fontName: "Arial",
	fontSize: 28,
	color: "000000",
	bold: false,
	italics: false,
	alignment: docx.AlignmentType.LEFT,
	pageBreak: false,
	spacingAfter: 100,
	spacingBefore: 100
}


const pageBreak = new docx.PageBreak();



/**
 * 创建一个docx.Paragraph对象
 *
 * @param {IParagraphOptions} options - 段落选项
 * @param {string} options.text - 段落文本内容
 * @param {string} [options.fontName="Arial"] - 字体名称
 * @param {number} [options.fontSize=28] - 字体大小
 * @param {string} [options.color="000000"] - 字体颜色
 * @param {boolean} [options.bold=false] - 是否加粗
 * @param {boolean} [options.italics=false] - 是否倾斜
 * @param {AlignmentType} [options.alignment=AlignmentType.LEFT] - 段落对齐方式
 * @param {boolean} [options.pageBreak=false] - 是否分页
 * @returns {Paragraph} 创建的段落对象
 */
function createParagraph(options: IParagraphOptions): docx.Paragraph {
	const { text, ...rest } = { ...defaultParagraphOptions, ...options };

	const textRun = new docx.TextRun({
		text,
		...rest,
	});

	const children = [textRun];

	if (rest.pageBreak) {
		children.push(pageBreak);
	}

	const paragraph = new docx.Paragraph({
		children,
		alignment: rest.alignment,
		spacing: {
			before: rest.spacingAfter,
			after: rest.spacingBefore,
		},
	});

	return paragraph;
}

export { createParagraph };




