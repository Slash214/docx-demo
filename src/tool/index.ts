import { Packer, Document, AlignmentType, Paragraph, Indent } from "docx";
import { FileChild } from "docx/build/file/file-child";
import { createImageGrid } from '../lib/dynamicGrid'
import { createBackgroundImageParagraph } from "../lib/backgroundImage";
import { createParagraph } from '../lib/newText'
import { createUserInfoTable } from '../lib/coverInfo'
import { urlToBase64 } from "./common";
import { createImageRun } from "../lib/image";
import { saveAs } from "file-saver";
import { imageToBase64 } from "../utils";

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
				font: '40'
			}),
			createParagraph({
				text: item.time,
				color: '#474747',
				font: '32'
			}),
			createParagraph({
				text: item.desc,
				font: '28',
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
	contentImg: string;
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
	let { bgImg = '', schoolName, startTime, endTime, name, className, contentImg } = cover
	const url = await imageToBase64(bgImg)
	const url2 = await imageToBase64(contentImg)
	// console.warn(url)
	const bg = createBackgroundImageParagraph(url)
	const contentBg = createBackgroundImageParagraph(url2)
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
		children: [createImageRun(await imageToBase64(children.avatar), 230),
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

	const table = createUserInfoTable(arr)
	const likes = [
		`我喜欢的动物：${children.animal}`,
		`我喜欢的游戏：${children.game}`,
		`我喜欢的颜色：${children.color}`
	]
	childrens.push(contentBg, userName2, avatarParagraph, table)
	likes.forEach(item => {
		childrens.push(
			createParagraph({
				indent: { left: 1400 },
				text: item, font: '32', spacingBefore: 400, spacingAfter: 400
			})
		)
	})
	childrens.push(createParagraph({ text: '', pageBreak: true }))

	// 记录内容
	for (const item of data) {
		const time = createParagraph({ text: item.time, bold: true, spacingAfter: 400 });
		const content = createParagraph({ text: item.content, spacingAfter: 300, line:  1.5 });
		const imgBase64Promises = item.imgList.map(url => imageToBase64(url));
		const imgBase64Array = await Promise.all(imgBase64Promises);

		const imgTable = createImageGrid(imgBase64Array);
		childrens.push(contentBg, time, content, imgTable, createParagraph({ text: '', spacingAfter: 400 }));
	}

	// 封底
	const lastTitleParagraph = createParagraph({ font: '32', text: '教师寄语', bold: true, spacingAfter: 400 })
	const lastContent1 = createParagraph({ text: desc.teacherMessage, font: '26', spacingAfter: 1000, line: 1.5 })
	const lastTitleParent = createParagraph({ text: '爸爸妈妈的鼓励与期望', font: '32', bold: true, spacingAfter: 400 })
	const lastContent2 = createParagraph({ text: desc.teacherMessage, font: '26', spacingAfter: 400, line: 1.5 })
	childrens.push(contentBg, lastTitleParagraph, lastContent1, lastTitleParent, lastContent2)

	const doc = new Document({
		sections: [{ children: childrens }]
	})

	console.warn('start download')
	Packer.toBlob(doc).then(blob => {
		saveAs(blob, '新版图文.docx')
		// const url = window.URL.createObjectURL(blob);
		// const link = document.createElement('a');
		// link.href = url;
		// link.download = "新版的图文.docx";
		// // 添加链接到DOM
		// document.body.appendChild(link);

		// // 触发下载
		// link.click();

		// // 释放URL对象
		// window.URL.revokeObjectURL(url);
	})
}