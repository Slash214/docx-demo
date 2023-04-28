import { Packer, Document } from "docx";
import { FileChild } from "docx/build/file/file-child";
import { createParagraph } from '../lib/text'
// import { createImageGrid } from '../lib/grid'
import { createImageGrid } from '../lib/dynamicGrid'

/**
 * 导出九宫格word {title， time， desc， imgList，} 后续优化
 * @param data 
 */
export const outGridWord = (data: any) => {
	const children: FileChild[] = []

	for (let [index, item] of data.entries()) {
		children.push(
			createParagraph({
				text: item.title,
				color: '#888888',
				fontSize: 40
			}),
			createParagraph({
				text: item.time,
				color: '#474747',
				fontSize: 32
			}),
			createParagraph({
				text: item.desc,
				fontSize: 28,
				color: '#999999'
			}),
			createImageGrid(item.imgList)
		)

		if (index !== data.length - 1) {
			children.push(createParagraph({
				text: '',
				pageBreak: true
			}))
		}
	}

	const doc = new Document({
		sections: [{ children }]
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

/** */
interface ObservationRecord {
	type: string;
	class: string;
	child: string;
	teacher: string;
	time: string;
	devStatus: any[]
	content: any
}

export const outActivityRecord = (data: ObservationRecord) => {
	
}

