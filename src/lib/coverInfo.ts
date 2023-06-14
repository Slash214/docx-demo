import { Table, TableRow, TableCell, WidthType, AlignmentType, Paragraph, BorderStyle } from 'docx';
import { createParagraph } from './newText'

interface CoverInfo {
	t1: string;
	t2: string;
}

const createUserInfoTable = (coverinfo: CoverInfo[]): Table => {
	const rows: TableRow[] = []
	const border = { size: 0, style: BorderStyle.NONE, color: '#ffffff' }
	const borders = {
		top: border,
		bottom: border,
		left: border,
		right: border
	}

	coverinfo.forEach(item => {
		rows.push(
			new TableRow({
				children: [
					new TableCell({
						width: { size: 50, type: WidthType.PERCENTAGE },
						children: [createParagraph({
							text: item.t1, font: '44', indent: { left: 800 }, spacingAfter: 200, spacingBefore: 200
						})],
						borders
					}),
					new TableCell({
						width: { size: 50, type: WidthType.PERCENTAGE },
						children: [createParagraph({ text: item.t2, font: '44', indent: { left: 800 },  spacingAfter: 200, spacingBefore: 200 })],
						borders
					})
				]
			})
		)
	})

	const table = new Table({
		borders,
		width: { size: 88, type: WidthType.PERCENTAGE },
		alignment: AlignmentType.CENTER,
		rows
	})

	return table
}

export { createUserInfoTable }
