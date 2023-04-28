import { Table, BorderStyle, TableCell, Paragraph, Alignment, VerticalAlign, WidthType, TableRow } from 'docx'
import { createImageRun } from "./image";


const createImageGrid = async (images: Array<string>, pageWidth: number = 612, pageMargin: number = 72) => {
	// 根据图片数量计算表格的行列
	const count = images.length
	const cols = 3
	const rows = Math.ceil(count / cols)

	// 计算页面边距和表格宽度
	const pagePadding = pageMargin * 2
	const tableWidth = pageWidth - pagePadding

	// 计算每个单元格的宽度和高度
	const cellGap = 5
	const cellWidth = (tableWidth - cellGap * (cols - 1)) / cols
	const cellHeight = cellWidth

	// 设置表格边框和单元格边框的样式
	const borderColor = '#ffffff'
	const borderSize = 1
	const borderStyle = BorderStyle.SINGLE
	const cellBorder = {
		color: borderColor,
		size: borderSize,
		style: borderStyle
	}

	// 加载所有图像，并创建单元格对象
	const imgList = images.map((el: string) => {
		return createImageRun(el, cellWidth)
	})

	const imageData = await Promise.all(imgList)

	// 构造表格
	const tableRows = []
	let index = 0
	for (let i = 0; i < rows; i++) {
		const cells = []
		for (let j = 0; j < cols; j++) {
			const image = imageData[index]
			const cell = new TableCell({
				children: [new Paragraph({ children: [image] })],
				verticalAlign: VerticalAlign.CENTER,
				shading: {
					fill: '#f2f2f2'
				},
				width: {
					size: 100 / cols,
					type: WidthType.PERCENTAGE
				},
				margins: {
					top: cellGap,
					bottom: cellGap,
					left: j === 0 ? 0 : cellGap,
					right: j === cols - 1 ? 0 : cellGap,
				},
				borders: {
					top: cellBorder,
					bottom: cellBorder,
					right: cellBorder,
					left: cellBorder
				}
			})
			cells.push(cell)
			index++
			if (index > count) break
		}
		const row = new TableRow({
			children: cells
		})
		tableRows.push(row)

		
		// if (index < rows - 1) {
		// 	const blankRow = new TableRow({
		// 		children: [new TableCell({
		// 			children: [new Paragraph('')],
		// 			shading: {
		// 				fill: '#ffffff'
		// 			},
		// 			width: {
		// 				size: tableWidth,
		// 				type: WidthType.DXA,
		// 			},
		// 			borders: {
		// 				top: {
		// 					size: 0,
		// 					style: BorderStyle.NONE,
		// 				},
		// 				bottom: {
		// 					size: 0,
		// 					style: BorderStyle.NONE,
		// 				},
		// 				left: {
		// 					size: 0,
		// 					style: BorderStyle.NONE,
		// 				},
		// 				right: {
		// 					size: 0,
		// 					style: BorderStyle.NONE,
		// 				},
		// 			},
		// 		})]
		// 	})

		// 	tableRows.push(blankRow)
		// }
	}

	// 创建表格对象
	const table = new Table({
		width: {
			size: tableWidth,
			type: WidthType.DXA,
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

export { createImageGrid }