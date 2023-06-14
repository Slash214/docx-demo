/**
 * @author 爱呵呵
 * 创建九宫格图片
 * @param images 图片的base64数组
 * @param layout 布局类型, 默认为2，接受2或3，代表2x2或3x3布局
 * @param withBackground 是否添加背景色， 默认不添加
 * @returns 返回Table对象
 */

import { Paragraph, Table, TableCell, TableRow, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx"
import { createImageRun } from './image'


const createImageGrid = (images: Array<string>, layout: number = 2, withBackground: boolean = false) => {
	const tableRows = []

	// 根据布局类型计算图片尺寸
	const cellSize = layout === 2 ? 240 : 170

	// 默认的cell表格颜色
	const cellBorder = {
		color: '#ffffff',
		size: 50,
		style: BorderStyle.SINGLE
	}

	// 默认的间隔
	const defaultMargin = {
		top: 200,
		bottom: 200,
		right: 200,
		left: 200,
	}

	// 生成九宫格
	for (let i = 0; i < layout; i++) {
		const cells = []
		for (let j = 0; j < layout; j++) {
			const index = i * layout + j
			if (index >= images.length) break
			const url = images[index]
			const image = createImageRun(url, cellSize)
			const cell = new TableCell({
				children: [new Paragraph({
					children: [image],
					alignment: AlignmentType.CENTER,
				})],
				verticalAlign: VerticalAlign.CENTER,
				margins: defaultMargin,
				shading: withBackground ? {
					fill: '#f2f2f2'
				} : undefined,
				width: {
					size: 100 / layout,
					type: WidthType.PERCENTAGE,
				},
				borders: {
					top: cellBorder,
					left: cellBorder,
					right: cellBorder,
					bottom: cellBorder,
				}
			})

			cells.push(cell)
		}

		const row = new TableRow({
			children: cells
		})

		tableRows.push(row)
	}

	const table = new Table({
		width: {
			size: 100,
			type: WidthType.PERCENTAGE,
		},
		borders: {
			top: { size: 0, style: BorderStyle.NONE },
			bottom: { size: 0, style: BorderStyle.NONE },
			left: { size: 0, style: BorderStyle.NONE },
			right: { size: 0, style: BorderStyle.NONE },
		},
		rows: tableRows
	})

	return table
}

export {
	createImageGrid
}
