/**
 * @descrion 生成九宫格表格 
 * @author 爱呵呵
 */

import { Paragraph, Table, TableCell, TableRow, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx"
import { createImageRun } from './image'

const createImageGrid = (images: Array<any>) => {
	const tableRows = []

	// 根据图片数量计算表格的行列
	const count = images.length,
		cols = Math.ceil(Math.sqrt(count)),
		rows = Math.ceil(count / cols)

	let index = 0


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


	// 构造表格
	for (let i = 0; i < rows; i++) {
		console.error(i)
		const cells = []
		for (let j = 0; j < cols; j++) {
			const url = images[index] || ''
			// console.warn('获取的图片', url)
			const image = createImageRun(url)
			const cell = new TableCell({
				children: [new Paragraph({
					children: [image],
					alignment: AlignmentType.CENTER,
				})],
				verticalAlign: VerticalAlign.CENTER,
				margins: defaultMargin,
				shading: {
					fill: '#f2f2f2'
				},
				width: {
					size: 100 / cols,
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
			index++

			if (index >= count) break

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
	// console.warn(table)
	return table
}

export {
	createImageGrid
}