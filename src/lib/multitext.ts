/**
 * 处理多文本段落的情况 
 * @author 爱呵呵
 */

import docx from 'docx'
import { Paragraph, TextRun, AlignmentType } from 'docx';

interface IParagraphOptions {
  texts: string[];
  fontName?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italics?: boolean;
  alignment?: AlignmentType;
  spacingBefore?: number;
  spacingAfter?: number;
  spaceBetweenTexts?: number;
}

const defaultParagraphOptions: IParagraphOptions = {
  texts: [],
  fontName: 'Arial',
  fontSize: 12,
  color: '000000',
  bold: false,
  italics: false,
  alignment: AlignmentType.LEFT,
  spacingBefore: 0,
  spacingAfter: 0,
  spaceBetweenTexts: 4,
};

function createMultiTextParagraph(options: IParagraphOptions): Paragraph {
  const { texts, spaceBetweenTexts, ...rest } = { ...defaultParagraphOptions, ...options };

  const textRuns: TextRun[] = [];
  texts.forEach((text, index) => {
    const textRun = new TextRun({
      text: text || ' ', // 如果文本为空，则使用一个空格
      font: rest.fontName,
      size: rest.fontSize,
      color: rest.color,
      bold: rest.bold,
      italics: rest.italics,
    });

    textRuns.push(textRun);

    // 在每个文本之后添加空格，除非是最后一个文本
    if (index !== texts.length - 1 && spaceBetweenTexts !== undefined) {
      for (let i = 0; i < spaceBetweenTexts; i++) {
        const spaceRun = new TextRun({
          text: ' ',
          font: rest.fontName,
          size: rest.fontSize,
          color: rest.color,
        });
        textRuns.push(spaceRun);
      }
    }
  });

  return new Paragraph({
    children: textRuns,
    alignment: rest.alignment,
    spacing: {
      before: rest.spacingBefore,
      after: rest.spacingAfter,
    },
  });
}

export {
	createMultiTextParagraph
}

