import { Packer, Document, AlignmentType, Paragraph } from "docx";
import { FileChild } from "docx/build/file/file-child";
// import { createParagraph } from '../lib/text'
// import { createImageGrid } from '../lib/grid'
import { createImageGrid } from '../lib/dynamicGrid'
import { createBackgroundImageParagraph } from "../lib/backgroundImage";
import { createParagraph } from '../lib/newText'
import { urlToBase64 } from "./common";
import { createImageRun, ImageAlignment } from "../lib/image";
import { createMultiTextParagraph } from "../lib/multitext";
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


interface Cover {
	schoolName: string;
	name: string;
	className: string;
	startTime: string;
	endTime: string;
	bgImg: string;
}

interface Children {
	name: string;
	avatar: string;
	sex: string;
	height: string;
	weight: string;
	birthday: string;
	chineseZodiac: string;
	animal: string;
	game: string;
	color: string;
}

interface DataItem {
	id: number;
	name: string;
	time: string;
	content: string;
	imgList: string[];
}

interface Desc {
	parentEncouragement: string;
	teacherMessage: string;
}

interface PhotoAlbum {
	cover: Cover;
	children: Children;
	data: DataItem[];
	desc: Desc;
}


// 新的图文相册
export const outPhotoAlbum = async (items: PhotoAlbum) => {
	const { data, children, cover, desc } = items

	const childrens: FileChild[] = []

	// 封面
	let { bgImg = '', schoolName, startTime, endTime, name, className } = cover
	const url: any = await urlToBase64(bgImg)
	// console.warn(url)
	const bg = createBackgroundImageParagraph(url)
	const title = createParagraph({
		size: 44,
		text: schoolName,
		spacingBefore: 2000,
		spacingAfter: 1000,
		alignment: AlignmentType.CENTER
	})
	const emptyText = createParagraph({
		text: '',
		spacingAfter: 6000,
	})
	const userName = createParagraph({ size: 32, text: name, alignment: AlignmentType.CENTER, spacingBefore: 400 })
	const greadName = createParagraph({ size: 32, text: className, alignment: AlignmentType.CENTER, spacingBefore: 400 })
	const time = createParagraph({ size: 32, text: `${startTime}-${endTime}`, alignment: AlignmentType.CENTER, spacingBefore: 400 })
	const bottom = createParagraph({ size: 24, text: `*纪念册内容来源于叙事记录`, alignment: AlignmentType.RIGHT, spacingBefore: 1500, pageBreak: true })

	childrens.push(bg, title, emptyText, userName, greadName, time, bottom)

	// 儿童信息
	const userName2 = createParagraph({ size: 48, text: name, spacingBefore: 400 })
	const avatarParagraph = new Paragraph({
		children: [createImageRun(await urlToBase64(children.avatar), 230),
		],
		alignment: AlignmentType.CENTER,
		spacing: {
			after: 800,
			before: 800
		}
	});

	const arr = [
		{ t1: `姓名：${children.name}`, t2: `性别：${children.sex === '1' ? '男' : '女'}` },
		{ t1: `生日：${children.birthday}`, t2: `生肖：${children.chineseZodiac}` },
		{ t1: `身高：${children.height}`, t2: `体重：${children.weight}` },
	]
	childrens.push(bg, userName2, avatarParagraph)

	const c:any = []
	arr.forEach(async (item) => {
		const line = createMultiTextParagraph({
			texts: [item.t1, item.t2],
			fontSize: 32,
			alignment: AlignmentType.LEFT,
			spacingBefore: 200,
			spacingAfter: 200,
			spaceBetweenTexts: 10,
		})

		c.push(line)
	})
	const parentParagraph = new Paragraph({
		alignment: AlignmentType.CENTER,
		children: c
	})
	console.log(parentParagraph)
	childrens.push(parentParagraph)
	// 记录内容

	// 封底

	const doc = new Document({
		sections: [{ children: childrens }]
	})

	Packer.toBlob(doc).then(blob => {
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = "新版的图文.docx";
		// 添加链接到DOM
		document.body.appendChild(link);

		// 触发下载
		link.click();

		// 释放URL对象
		window.URL.revokeObjectURL(url);
	})
}