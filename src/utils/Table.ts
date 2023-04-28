import {
	AlignmentType,
	BorderStyle,
	Document,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableRow,
	WidthType,
	Packer,
	TextRun,
	VerticalAlign,
} from "docx";
import { createImageGrid } from "../lib/grid";
import { createParagraph } from "../lib/text";

interface ICellData {
	text: string;
	width: number;
}

interface IRowData {
	cells: ICellData[];
	merge?: boolean;
}

interface ITableData {
	headers?: string[];
	rows: IRowData[];
	widths?: number[];
	mergeRows?: boolean;
}

function createTableCell(
	text: any,
	width: number,
	merge: boolean,
	type: WidthType = WidthType.PERCENTAGE
): TableCell {
	return new TableCell({
		children: Array.isArray(text) ? text : [new Paragraph(text)],
		width: { size: width, type },
		columnSpan: merge ? 2 : 1,
		borders: {
			top: { size: 1, color: '#bbbbbb', style: BorderStyle.SINGLE },
			bottom: { size: 1, color: '#bbbbbb', style: BorderStyle.SINGLE },
			left: { size: 1, color: '#bbbbbb', style: BorderStyle.SINGLE },
			right: { size: 1, color: '#bbbbbb', style: BorderStyle.SINGLE },
		},
		verticalAlign:VerticalAlign.CENTER
	});
}

function createTableRow(cells: TableCell[], cantSplit = false): TableRow {
	return new TableRow({
		children: cells,
		cantSplit,
	});
}

function createTable(data: ITableData, other: any): Table {
	const { headers, rows, widths, mergeRows } = data;
    
	const tableRows = [
		createTableRow([createTableCell('标题哦', 20, false), createTableCell('内容哦--', 80, false)]),
		createTableRow([createTableCell('标题哦', 20, false), createTableCell('内容哦--', 80, false)]),
		createTableRow([createTableCell('标题哦', 20, false), createTableCell('内容哦--', 80, false)]),
		createTableRow([createTableCell('标题哦', 20, false), createTableCell('内容哦--', 80, false)]),
		createTableRow([createTableCell('标题哦', 20, false), createTableCell('内容哦--', 80, false)]),
		createTableRow([createTableCell([
			createParagraph({ text: '你让谁的ask的贷款2312312的'}),
			createParagraph({ text: '你让谁的ask的贷款2312312的'}),
			createParagraph({ text: '你让谁的ask的贷款2312312的' }),
			createImageGrid(other[0].imgList)
		], 100, true)]),
		createTableRow([createTableCell([createParagraph({ text: '啦啦啦啦啦啦大苏打大苏打' }), createParagraph({ text: '啦啦啦啦啦啦大苏打大苏打' })], 100, true)], true),
	]

	return new Table({
		rows: tableRows,
		width: {
			size: 100,
			type: WidthType.PERCENTAGE,
		},
		margins: {
			top: 200,
			left: 200,
			right: 200,
			bottom: 200,
		},
		alignment: AlignmentType.CENTER,
		borders: {
			top: { size: 1, style: BorderStyle.SINGLE, color: "#bbbbbb" },
			bottom: { size: 1, style: BorderStyle.SINGLE, color: "#bbbbbb" },
			left: { size: 1, style: BorderStyle.SINGLE, color: "#bbbbbb" },
			right: { size: 1, style: BorderStyle.SINGLE, color: "#bbbbbb" },
		},
	});
}


const tableData = [
	{
		cells: [
			{ text: '标题', width: 20 },
			{ text: '内容', with: 80 }
		],
		merge: false
	},
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: false },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: false },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: false },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: false },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: false },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: true },
	{ cells: [{ text: '标题', width: 20 }, { text: '内容', with: 80 }], merge: true },
]




export const testSSSTable = (data: any) => {

	console.log('data-------', data)
	const table = createTable(tableData,data)


	const doc = new Document({
		sections: [{ children: [table] }]
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