/**
 * @description JS方法合集
 * @author 爱呵呵 && 腾腾
 */

import { Document} from 'docx'
//  import * as QR from 'qrcode-base64';
 import { Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, HeightRule, convertInchesToTwip, TableAnchorType, RelativeHorizontalPosition, OverlapType, TableLayoutType, ImageRun, convertMillimetersToTwip, Footer, PageBreak, TextWrappingType, TextWrappingSide, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign } from "docx";
 

 /**
 * 获取文本格式
 * @param textValue 文本内容
 * @param breakValue 是否换行 0 不换行 1换一行 2
 * @param colorValue  字体颜色 十六进制 默认黑色
 * @param textsizeValue 字体大小
 * @param bold 字体加粗
 * @returns
 */
 const getDocxTextRun = (textValue: any, breakValue = 0, colorValue = "000000", textsizeValue = 28, bold = false,) => {
   return new TextRun({ text: textValue, break: breakValue, color: colorValue, size: textsizeValue, bold: bold, })
 }
 /**
 * 获取段落格式
 * @param textRunValue 文本内容或其它内容 数组
 * @param alignmentValue 对齐方式 可不传 默认左对齐
 * @param spacing 上下边距 可不传 line为行间距以240为单位
 * @param firstLine 首航缩进
 * @returns
 */
 const getDocxParagraph = (textRunValue: TextRun[], alignmentValue = AlignmentType.LEFT, spacing = { before: 0, after: 0, line: 240 }, firstLine = 0) => {
   const indent = { left: 270, right: 225, firstLine: firstLine, }
   return new Paragraph({ alignment: alignmentValue, indent: indent, children: textRunValue, spacing: spacing, heading: HeadingLevel.HEADING_2, })
 }
 /**
  * 文字单元格
  * @param textValue 文本内容
  * @param color 背景颜色，默认白色
  * @param colNum 行合并，默认1
  * @param rowNum 列合并，默认1
  * @param size 表格宽度，默认100
  * @param borderC 边框颜色，默认黑色，只有白色时会用
  */
 const getDocxTableCell = (textValue: Paragraph | Table, color = 'ffffff', colNum = 1, rowNum = 1, size = 100, borderC = 'CCCCCC') => {
   var width = { size: size, type: WidthType.PERCENTAGE }
   var margins = { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1), }
   const borders = {
     top: {
       style: BorderStyle.SINGLE,
       size: 1,
       color: borderC,
     },
     bottom: {
       style: BorderStyle.SINGLE,
       size: 1,
       color: borderC,
     },
     left: {
       style: BorderStyle.SINGLE,
       size: 1,
       color: borderC,
     },
     right: {
       style: BorderStyle.SINGLE,
       size: 1,
       color: borderC,
     },
   };
   return new TableCell({ 
       verticalAlign: VerticalAlign.CENTER,
       borders, children: [textValue], shading: { fill: color, color: "auto", }, width: width, margins: margins, columnSpan: colNum, rowSpan: rowNum, })
 }
 

 /**
  * 取得图片格式
  * @param itemImg base64图片地址
  * @param outWidth 输出图片宽度
  * @returns
  */
 const getDocxImg = (itemImg: any, outWidth: any) => {
   const whp = get_size(itemImg)
   const Proportions = whp.Proportions
   const imgWidth = outWidth
   const imgHeight = imgWidth / Proportions
   const image = new ImageRun({
     data: itemImg,
     transformation: {
       width: imgWidth,
       height: imgHeight,
     },
   });
   return image
 }
 
 /**
  * 取得base64图片长宽与长宽比例
  * @param base64
  * @returns
  */
 const get_size = (base64: string) => {
   //确认处理的是png格式的数据
   if (base64.substring(0, 22) === 'data:image/png;base64,') {
     // base64 是用四个字符来表示3个字节
     // 我们只需要截取base64前32个字符(不计开头那22个字符)便可（24 / 3 * 4）
     // 这里的data包含12个字符，9个字节，除去第1个字节，后面8个字节就是我们想要的宽度和高度
     const data = base64.substring(22 + 20, 22 + 32);
     const base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
     const nums = [];
     for (const c of data) {
       nums.push(base64Characters.indexOf(c));
     }
     const bytes = [];
     for (let i = 0; i < nums.length; i += 4) {
       bytes.push((nums[i] << 2) + (nums[i + 1] >> 4));
       bytes.push(((nums[i + 1] & 15) << 4) + (nums[i + 2] >> 2));
       bytes.push(((nums[i + 2] & 3) << 6) + nums[i + 3]);
     }
     const width = (bytes[1] << 24) + (bytes[2] << 16) + (bytes[3] << 8) + bytes[4];
     const height = (bytes[5] << 24) + (bytes[6] << 16) + (bytes[7] << 8) + bytes[8];
     return {
       width,
       height,
       Proportions: width / height
     };
   }
   throw Error('unsupported image type');
 }
 
 
 /**
  * @description 计算两个日期相差天数
  * @params date otherDate -开始时间和结束时间
  * @returns {numebr} 天数
  */
 const diffDays = (date: Date, otherDate: Date): number => Math.ceil(Math.abs(date.valueOf() - otherDate.valueOf()) / (1000 * 60 * 60 * 24))
 
const gen = async (data:any) => {
    const childrens = []
     let coaTable:any[] = [];
      data.forEach((element:any,key:number) => {
      element.arr.forEach((e:any,k:number) => {
        if(k == 0){
          coaTable.push(
            new TableRow({
              children: [
                getDocxTableCell(getDocxParagraph([getDocxTextRun(element.field)], AlignmentType.CENTER), "eeeeee", 1,element.arr.length),
                getDocxTableCell(getDocxParagraph([getDocxTextRun(e.title)], AlignmentType.CENTER), "eeeeee"),
                getDocxTableCell(getDocxParagraph([getDocxTextRun(e.count)], AlignmentType.CENTER), "eeeeee"),
              ], cantSplit: true,
            })
          )
        }else{
          coaTable.push(
            new TableRow({
              children: [
                getDocxTableCell(getDocxParagraph([getDocxTextRun(e.title)], AlignmentType.CENTER), "eeeeee"),
                getDocxTableCell(getDocxParagraph([getDocxTextRun(e.count)], AlignmentType.CENTER), "eeeeee"),
              ], cantSplit: true,
            })
          )
        }
      });
 });
    const coaTables = new Table({
       rows: coaTable,
    })
    childrens.push(coaTables)
    childrens.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 400 } }))


    return new Document({ sections: [{ children: childrens }]})
}

export {
    gen
}