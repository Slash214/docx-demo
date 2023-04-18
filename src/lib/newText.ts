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
}

const spacingBefore = 100;
const spacingAfter = 100;
const pageBreak = new docx.PageBreak();

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
			before: spacingBefore,
			after: spacingAfter,
		},
	});

	return paragraph;
}

export { createParagraph };





