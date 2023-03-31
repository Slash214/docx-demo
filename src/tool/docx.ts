import { Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, HeightRule, convertInchesToTwip, TableAnchorType, RelativeHorizontalPosition, OverlapType, TableLayoutType, ImageRun, convertMillimetersToTwip, Footer, PageBreak, TextWrappingType, TextWrappingSide, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign, Tab } from "docx"
import { text } from "stream/consumers";


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
 * 存储base64到docx的image属性标签里面去 生成图片
 * @param base base64的图片 
 * @returns new ImageRun
 */
const _genPicture = (base:string, width:number = 240) => {
  // 这里希望图片给一个宽度，高度根据宽度等比缩放
  const whp = get_size(base) 
  const height = width / whp.Proportions
  return new ImageRun({
    data: base,
    transformation: {
      width,
      height
    }
  })
}

const genChildren = async (data: any[]) => {
  const children: any = []
  if (!(data instanceof Array) || !data.length) return children
   
  for (const val of data) {
    console.log('开始处理')
    let { content, title, time, name, imgList } = val || {}

    let templateObj:any = {
      outlineLevel:1,
      spacing: { line: 1.2 * 240 },
      alignment: AlignmentType.LEFT,
    }

    let mintext = 28, midtext = 32, bigtext = 48,
    color3 = '#333333', breakValue = 0, color6 = '#666666', color9 = '#999999', imgBox: any[] = [], contentSon: any[] = []

    // 时间-作者
    templateObj['children'] = [
      new TextRun({
        text: name,
        break: breakValue,
        color: color3,
        size: mintext
      }),
      new TextRun({
        text: time,
        break: breakValue,
        color: color3,
        size: midtext
      })
    ]
    children.push(new Paragraph(templateObj))

    // 标题
    templateObj['children'] = [
      new TextRun({
        text: `标题：${title}`,
        break: breakValue,
        color: color3,
        size: mintext,
      })
    ]
    children.push(new Paragraph(templateObj))
   
    // 内容
    templateObj['children'] = [
      new TextRun({
        text: `内容：${content}`,
        break: breakValue,
        color: '#666666',
        size: mintext,
      })
    ]
    children.push(new Paragraph(templateObj))


    // for (let url of imgList) {
    //   imgBox.push(await _genPicture(url, 180))
    //   imgBox.push(new TextRun("  "))
    // }
    
    // 这里的图文我采用 九宫格图片 一行 放 3 个
    for (let j = 0; j < imgList.length; j++) {
      imgBox.push(await _genPicture(imgList[j], 190))
      if ((j + 1) % 3 !== 0) imgBox.push(new TextRun("  "))
    }  

    // 图片
    let picture = new Paragraph({
      outlineLevel: 1,
      spacing: { line: 1.5 * 240, after: 1000 },
      alignment: AlignmentType.LEFT,
      // indent: { left: 270, right: 225},
      children: imgBox
    })

    children.push(picture)    
  }

  return children
}

const _genTable = async (caption: string[], row: number, data: any[]) => {
  let children:any[] = []

  // let caption = ['班级', '姓名', '时间', '描述内容']
  // 这里是设置的表格的边框和背景色  borders 边框    borderStyles 边框样式
  let shadwhite = { fill: '#ffffff', color: "auto", }, 
  shadf2f2 = { fill: '#f2f2f2', color: "auto", }, borderC = 'bbbbbb',
  borderStyles = { style: BorderStyle.SINGLE, size: 1, color: borderC },
  borders = {
    top: borderStyles,
    bottom:borderStyles,
    left:borderStyles,
    right: borderStyles,
  }

  for (const item of data) {

    let allImages:any = []
    let { imgList } = item || {}
    // 图片存入数组， 在word里面显示图片 ，但图片的距离是根据
    //  push(new TextRun({ break: 2 })) 和 push(new TextRun("  ")) 来实现的，
    // 并没有看见图片的margin这种类似的值。
    
    if (imgList?.length) {
      for (let i = 0; i < imgList.length; i++) {
        allImages.push(await _genPicture(imgList[i], 187))
        if ((i + 1) % 3 === 0) allImages.push(new TextRun({ break: 2 }))
        else allImages.push(new TextRun("  "))
      }
    }

    // console.error('图片', allImages)

    let rows:any = []
    for (let j = 0; j < row; j++) {

      let son:any = ''
      if (+j + 1 === +row) {
        son = new TableRow({
          children: [
            new TableCell({
              borders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: allImages
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }, 
              margins: { 
                left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
                top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)
              }
            }),
          ]
        })
      } else {
        son = new TableRow({
          children: [
            new TableCell({
              borders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: caption[j], size: 28 })]
                })
              ],
              shading: shadf2f2,
              width: { size: 19, type: WidthType.PERCENTAGE }, 
              margins: { left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
                top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
            new TableCell({
              borders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: `${item[j]}`, size: 28 })]
                })
              ],
              shading: shadwhite,
              width: { size: 81, type: WidthType.PERCENTAGE }, 
              margins: { 
                left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
                top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)
              }
            }),
          ]
        }) 
      }

      rows.push(son)
    }
    let table = new Table({ rows })
    children.push(table)
    children.push(new Paragraph({ children: [new PageBreak()] }))
  }
    
  return children
}


/**
 * 生成基础表格
 * @param {Array} caption 字符串数组 ['value1', 'value2'] 长度必等于 row - 1 
 * @param {number} row  几行表格 max = 10
 * @param {Array} data  key为数字value 为值的 数组 [{ 0: 'value', 1: 'vlaue' ... imgList: [] }]
 * @returns 
 */
 const outTable = async (caption: string[], row: number, data: any[]) => {
  try {
    let children:any = await _genTable(caption, row, data)
    
    return new Document({ sections: [{ children }] })
  } catch (error) {
    console.error('Word文档生成失败', error)
    return error
  }
}


const outIrrge = async (data: any[], len: number) => {
  try {
    let children:any = await _genIrrtable(data, len)
    return new Document({ sections: [{ children }] })
  } catch (error) {
    console.error('Word文档生成失败', error)
    return error
  }
}


/**
 * 生 成基础 的word文档图文样式
 * @param {number} row 几行文字 maxRow = 10
 * @param {Array} data 数字数组 [ { 0 : val , imgList: string[] }]
 * @returns docx 渲染文档
 */
 const outGraphic = async (row: number, data: any[]) =>  {
  try {
    const children: any = await _genContent(row, data)
    return new Document({ sections: [{ children }]})
  } catch (error) {
    console.error('文档生成失败' + error)
    return error
  }
}


const _genIrrtable = async (data:any[], len: number) => {
  let children:any[] = []
  let borderC = 'bbbbbb', borderStyles = { style: BorderStyle.SINGLE, size: 1, color: borderC },
  borders = {
    top: borderStyles,
    bottom:borderStyles,
    left:borderStyles,
    right: borderStyles,
  }

  // for (let item of data) {
  //   let rows: any[] = []
  //   let b:any[] = []
  //   let c: any = new TableCell({
  //     borders,
  //     children: [
  //       new Paragraph({
  //         alignment: AlignmentType.CENTER,
  //         children: [
  //           new TextRun({
  //             text: `${item.field}`,
  //             size: 30,
  //           }),
  //         ]
  //       })
  //     ],
  //     verticalAlign: VerticalAlign.CENTER,
  //     width: { size: 100, type: WidthType.PERCENTAGE }, 
  //     margins: {
  //       top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1),
  //       left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
  //     },
  //     rowSpan: item.arr.length
  //   })
  //   b.push(c)
  //   let arr1 = [], arr2 = []
  //   for (let k of item.arr) {
  //      arr1.push(
  //       new TextRun({
  //         text: `${k.title}`,
  //         size: 30,
  //         break: 1,
  //       }),
  //      )

  //      arr2.push(
  //       new TextRun({
  //         text: `${k.count}`,
  //         size: 30,
  //         break: 1,
  //       }),
  //      )
  //   }
  //   let d: any = new TableCell({
  //     borders,
  //     children: [
  //       new Paragraph({
  //         spacing: { line: 1.3 * 240 },
  //         alignment: AlignmentType.CENTER,
  //         children: arr1
  //       })
  //     ],
  //     width: { size: 100, type: WidthType.PERCENTAGE }, 
  //     margins: {
  //       top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1),
  //       left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
  //     },
  //   })
    
  //   let p: any = new TableCell({
  //     borders,
  //     children: [
  //       new Paragraph({
  //         spacing: { line: 1.3 * 240 },
  //         alignment: AlignmentType.CENTER,
  //         children: arr2
  //       })
  //     ],
  //     width: { size: 100, type: WidthType.PERCENTAGE }, 
  //     margins: {
  //       top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1),
  //       left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1),
  //     },
  //   })
  //   b.push(d)
  //   b.push(p)
  //   rows.push(new TableRow({ children: b }))
  //   let table = new Table({ rows })
  //   children.push(table)
  // }

  for (let item of data) {
    let rows: any[] = []
    let brow: any[] = []
    item.arr.forEach((e: any, key:number) => {
      if (key === 0) {

      } else {

      }
    })
    rows.push(new TableRow({ children: brow }))
    let table = new Table({ rows })
    children.push(table)
  }

  return children
}

const _genContent = async (row: number, data: any[]) => {
    let children:any[] = []

    if (!(data instanceof Array) || !data.length) return children
  
    for (const item of data) {
      let { imgList = [] } = item || {}

      let obj = {
        fontSize: 28,
        fontColor: '#888888',
      }

      let templateStyle:any = {
        outlineLevel: 1,
        spacing: { line: 1.2 * 240 },
        alignment: AlignmentType.LEFT,
      }, 
      breakValue = 0,
      imgBox: any[] = []

      // 这里开始生成 row = 5
      console.log(item)
      for (let j = 0; j < row; j++) {
          templateStyle['children'] = [
              new TextRun({
                text: `${item[j]}`,
                break: breakValue,
                color: obj.fontColor,
                size: obj.fontSize,
              })
          ]
          children.push(new Paragraph(templateStyle))
      }

      // 九宫格图片 一行 放 3 个
      if (imgList?.length && imgList instanceof Array) {
          for (let j = 0; j < imgList.length; j++) {
              imgBox.push(await _genPicture(imgList[j], 190))
              if ((j + 1) % 3 !== 0) imgBox.push(new TextRun("  "))
          }
  
          // 图片
          let picture = new Paragraph({
              outlineLevel: 1,
              spacing: { line: 1.5 * 240, after: 1000 },
              alignment: AlignmentType.LEFT,
              children: imgBox
          })
          children.push(picture)
      }
    }
      

    return children
}




export {
  outGraphic,
  outTable,
  outIrrge
}