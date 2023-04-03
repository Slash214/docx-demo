import * as docx from "docx";
import { Packer, Paragraph, Document } from "docx";
import { createParagraph } from './word'
import { createImageGrid } from './table'

const genImage = (img: string): docx.ImageRun => {
	// let w = 0, h = 0
	// async function getSize() {
	// 	let { width, height } = await getBase64ImageSize(img)	
	//     w = width, h = height
	// }
	// console.log('我坐下来', w, h)
	return new docx.ImageRun({
		data: img,
		transformation: { width: 190, height: 190 }
	})

}

async function getBase64ImageSize(base64Image: string): Promise<{ width: number, height: number }> {
	return new Promise((resolve, reject) => {
		// 创建图片对象
		const image = new Image();
		// 图片加载完成后获取宽高属性
		image.onload = function () {
			resolve({ width: image.width, height: image.height });
		};
		// 图片加载失败时返回错误信息
		image.onerror = function () {
			reject(new Error('Failed to load image'));
		};
		// 设置图片的src属性，加载图片
		image.src = base64Image;
	});
}


export const wordImage = (images: any[]) => {
	// 定义九宫格的行数和列数
	const rows = 3;
	const cols = 3;

	const cellBorder = {
		color: '#ffffff',
		size: 50,
		style: docx.BorderStyle.SINGLE
	}

	// 定义单元格的背景颜色
	const cellColor = "cccccc";


	const imgList = images[0].imgList
	console.error(imgList)
	// return
	const defaultMargin = {
		top: 200,
		bottom: 200,
		right: 300,
		left: 300,
	};


	const newArr = Array.from({ length: 3 }, (_, i) => imgList.slice(i * 3, i * 3 + 3))

	console.log(newArr)

	let row:any = []
	newArr.map((item: any, index: number) => {

		let sb: any = []
		item.map((son: any, idx: number) => {
			sb.push(
				new docx.TableCell({
					shading: {
						fill: cellColor,
					},
					margins: defaultMargin,
					children: [new Paragraph({
						children: [
							genImage(son.url)
						]
					})],
					borders: {
						top: cellBorder,
						left: cellBorder,
						right: cellBorder,
						bottom: cellBorder
					}
				})
			)
		})


		row.push(
			new docx.TableRow({
			   children: sb
		   })
	   )
	})

	console.log(row)
	// return
	imgList.map((item: any, index: number) => {

	})



	// 创建表格
	const table = new docx.Table({
		width: {
			size: 100,
			type: docx.WidthType.PERCENTAGE,
		},
		borders: {
			top: { size: 0, style: docx.BorderStyle.NONE },
			bottom: { size: 0, style: docx.BorderStyle.NONE },
			left: { size: 0, style: docx.BorderStyle.NONE },
			right: { size: 0, style: docx.BorderStyle.NONE },
		},
		rows: row
	});



	const doc = new docx.Document({
		sections: [
			{ children: [table] }
		]
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


export const wordImage2 = (data: any) => {
	
	const children: any = []


	for (let [index, item] of data.entries()) {
		children.push(createParagraph({ text: item.title, color: '#888888', fontSize: 40 }))
		children.push(createParagraph({ text: item.time, color: '#474747', fontSize: 32 }))
		children.push(createParagraph({ text: item.desc, color: '#999999', fontSize: 28 }))
		// console.log(index)
		children.push(createImageGrid(item.imgList))
		children.push(createParagraph({ text: '', pageBreak: true }))
        // console.warn(item)
		// 表格
	}
	const doc = new Document({
		sections: [
		   { children }
	   ]
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

