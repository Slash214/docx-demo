import { Packer, Document, Paragraph } from "docx";
import { FileChild } from "docx/build/file/file-child";
import { imageToBase64 } from ".";
import { createImageGrid } from "../function/grid";
import { createImageRun } from "../function/image";
import { createParagraph } from "../function/text";
import { ImageAndTextData } from "../typings";

export const generateWordDocWithImageAndText = async (data: ImageAndTextData[]) => {
	const children: FileChild[] = []

	for (const [index, item] of data.entries()) {
		console.log(index)
		children.push(
			createParagraph({ text: item.title, color: '#666666' }),
			createParagraph({ text: item.name, color: '#dddddd' }),
			createParagraph({ text: item.time, color: '#dddddd' }),
			createParagraph({ text: item.content, color: '#444444' }),
			await createImageGrid(item.imgList, 3, 170)
		)

	}

	const doc = new Document({
		sections: [{ children }]
	})

	return doc
} 