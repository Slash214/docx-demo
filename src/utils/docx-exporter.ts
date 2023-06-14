import { Packer, Document, Paragraph } from "docx";
import { FileChild } from "docx/build/file/file-child";
import { imageToBase64 } from ".";
// import { createImageGrid } from "../function/grid";
// import { createImageRun } from "../function/image";
import { createParagraph } from "../lib/text";
import { ImageAndTextData } from "../typings";
import { createImageGrid } from '../lib/GridImage'

export const generateWordDocWithImageAndText = async (data: ImageAndTextData[]) => {
	const children: FileChild[] = []

	for (const [index, item] of data.entries()) {
		console.log(index)
		children.push(
			createParagraph({ text: item.title, color: '#666666', size: 32 }),
			createParagraph({ text: item.name, color: '#bbbbbb', size: 32 }),
			createParagraph({ text: item.time, color: '#aaaaaa', size: 32 }),
			createParagraph({ text: item.content, color: '#444444', size: 28, line: 1.5 }),
			await createImageGrid(item.imgList, 3, 170),
			createParagraph({ text: '', spacingAfter: 400 })
		)

	}

	const doc = new Document({
		sections: [{ children }]
	})

	return doc
} 