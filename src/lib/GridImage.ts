/**
 * @author 爱呵呵
 * 九宫格图片
 */

import { Table, BorderStyle, TableCell, Paragraph, VerticalAlign, WidthType, TableRow, AlignmentType } from 'docx'
import { createImageRun } from "./image";

const createImageGrid = async (images: Array<string>, gridSize: number = 3, pageWidth: number = 612, pageMargin: number = 72) => {
	const count = images.length;
	const rows = Math.ceil(count / gridSize);
	const pagePadding = pageMargin * 2;
	const tableWidth = pageWidth - pagePadding;
	// const cellWidth = tableWidth / gridSize;
	const borderColor = '#ffffff';
	const borderSize = 1;
	const borderStyle = BorderStyle.SINGLE;

	const imgPromises = images.map((el: string) => createImageRun(el));
	const imageData = await Promise.all(imgPromises);

	const tableRows = [];

	for (let i = 0; i < rows; i++) {
		const cells = [];
		for (let j = 0; j < gridSize; j++) {
			const index = i * gridSize + j;
			if (index >= count) {
				break;
			}
			const image = imageData[index];
			const cell = new TableCell({
				children: [new Paragraph({ children: [image], alignment: AlignmentType.CENTER })],
				verticalAlign: VerticalAlign.CENTER,
				width: {
					size: 100 / gridSize,
					type: WidthType.PERCENTAGE
				},
				margins: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				},
				borders: {
					top: { color: borderColor, size: borderSize, style: borderStyle },
					bottom: { color: borderColor, size: borderSize, style: borderStyle },
					right: { color: borderColor, size: borderSize, style: borderStyle },
					left: { color: borderColor, size: borderSize, style: borderStyle }
				}
			});
			cells.push(cell);
		}
		const row = new TableRow({
			children: cells
		});
		tableRows.push(row);
	}

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
	});

	return table;
}

export { createImageGrid }
