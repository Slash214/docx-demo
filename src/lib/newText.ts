import * as docx from 'docx';

/**
 * 选项接口，定义了用于创建段落的各种选项
 * @author 爱呵呵
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
	spacingBefore?: number;
	spacingAfter?: number;
}

/**
 * 默认的段落选项，会在没有提供相应选项时被使用
 */
const defaultParagraphOptions: IParagraphOptions = {
	text: '',
	font: "Arial",
	size: 28,
	color: "000000",
	bold: false,
	italics: false,
	alignment: docx.AlignmentType.LEFT,
	pageBreak: false,
	spacingBefore: 100,
	spacingAfter: 100,
}

/**
 * 创建一个新的段落
 * 
 * @param options - 一个包含创建段落所需选项的对象
 * @returns 一个新的段落对象
 * 
 * @example
 * const paragraph = createParagraph({
 *     text: 'Hello, world!',
 *     spacingBefore: 200,
 *     spacingAfter: 300,
 * });
 * 
 * @author 爱呵呵
 */
function createParagraph(options: IParagraphOptions): docx.Paragraph {
	// 将提供的选项和默认选项合并
	const { text, ...rest } = { ...defaultParagraphOptions, ...options };

	const textRun = new docx.TextRun({
		text,
		...rest,
	});

	const children: (docx.TextRun | docx.PageBreak)[] = [textRun];

	if (rest.pageBreak) {
		children.push(new docx.PageBreak());
	}

	return new docx.Paragraph({
		children,
		alignment: rest.alignment,
		spacing: {
			before: rest.spacingBefore,
			after: rest.spacingAfter,
		},
	});
}

export { createParagraph };
