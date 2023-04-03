/**
 * @author 爱呵呵
 * @descrion 关于docx 段落导出
 */

import * as docx from "docx";
import { Packer } from "docx";

/**
 * @param text: 段落文本内容
 * @param fontName: 字体名称
 * @param fontSize: 字体大小
 * @param color: 字体颜色
 * @param bold: 是否加粗
 * @param italics: 是否倾斜
 * @param alignment: 段落对齐方式
 * @param pageBreak: 是否分页
 */
interface IParagraphOptions {
	text: string;
	fontName?: string;
	fontSize?: number;
	color?: string;
	bold?: boolean;
	italics?: boolean;
	alignment?: docx.AlignmentType;
	pageBreak?: boolean
}


/**
 * 
 * @param {IParagraphOptions} options - 段落选项
 * @returns {docx.Paragraph} 创建的段落
 */
function createParagraph(options: IParagraphOptions) {
	const {
		text,
		fontName = "Arial",
		fontSize = 28,
		color = "000000",
		bold = false,
		italics = false,
		alignment = docx.AlignmentType.LEFT,
		pageBreak = false
	} = options;

	const Text = new docx.TextRun({
		text,
		bold,
		italics,
		color,
		size: fontSize,
		font: fontName,
		
	})

	const children = [Text]
	if (pageBreak) {
		children.push(new docx.PageBreak())
	}

	const paragraph = new docx.Paragraph({
		children,
		alignment,
		spacing: {
			before: 200,
			after: 200
		}
	})

	return paragraph;
}

export {
	createParagraph
}

export const outWord = () => {


	const arr = []

	for (let i = 0; i < 100; i++) {
		arr.push(
			createParagraph({
				text: `哦哦哦哦哦阿斯弗内容内容${i}`,
				fontSize: 50,
				color: '#888888'
			})
		)
	}

	const doc = new docx.Document({
		sections: [{
			children: arr
		}],
	})

	Packer.toBlob(doc).then(blob => {
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = "example.docx";
		// 添加链接到DOM
		document.body.appendChild(link);

		// 触发下载
		link.click();

		// 释放URL对象
		window.URL.revokeObjectURL(url);
	})
}