import { Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, HeightRule, convertInchesToTwip, TableAnchorType, RelativeHorizontalPosition, OverlapType, TableLayoutType, ImageRun, convertMillimetersToTwip, Footer, PageBreak, TextWrappingType, TextWrappingSide, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign, Tab } from "docx"


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
const _genPicture = (base:string) => {
  // 这里希望图片给一个宽度，高度根据宽度等比缩放
  const whp = get_size(base) 
  const width = 240
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
      spacing: { line: 1.5 * 240 },
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
        size: midtext
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
        size: midtext,
      })
    ]
    children.push(new Paragraph(templateObj))
   
    // 内容
    templateObj['children'] = [
      new TextRun({
        text: `内容：${content}`,
        break: breakValue,
        color: color9,
        size: midtext,
      })
    ]
    children.push(new Paragraph(templateObj))

    for (let url of imgList) {
      imgBox.push(await _genPicture(url))
      imgBox.push(new TextRun("  "))
    }

    

    // 图片
    let picture = new Paragraph({
      outlineLevel: 1,
      spacing: { line: 1.5 * 240, after: 1000 },
      alignment: AlignmentType.LEFT,
      indent: { left: 270, right: 225},
      children: imgBox
    })

    children.push(picture)    
  }

  return children
}

const genTable = async (data: any[]) => {
  const children:any[] = []

  // 这里是设置的表格的边框和背景色
  let shadwhite = { fill: '#ffffff', color: "auto", }, 
  shadf2f2 = { fill: '#f2f2f2', color: "auto", }, 

  borderC = 'bbbbbb',
  borders = {
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
  }

  for (const item of data) {

    let allImages:any = []
    let { newImg } = item || {}
    // 图片存入数组， 在word里面显示图片 ，但图片的距离是根据
    //  push(new TextRun({ break: 2 })) 和 push(new TextRun("  ")) 来实现的，
    // 并没有看见图片的margin这种类似的值。
    
    if (newImg.length) {
      for (let i = 0; i < newImg.length; i++) {
        allImages.push(await _genPicture(newImg[i]))
        if ((i + 1) % 2 === 0) allImages.push(new TextRun({ break: 2 }))
        else allImages.push(new TextRun("  "))
      }
    }

    console.error('图片', allImages)

    let table = new Table({ 
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders,
              columnSpan: 0.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `班级`, size: 28 })]
                })
              ],
              shading: shadf2f2,
              width: { size: 19, type: WidthType.PERCENTAGE }, 
              margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
            new TableCell({
              borders,
              columnSpan: 1.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: `${item.classname}`, size: 32 })]
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
        }),
        new TableRow({
          children: [
            new TableCell({
              borders,
              columnSpan: 0.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `姓名`, size: 28 })]
                })
              ],
              shading: shadf2f2,
              width: { size: 19, type: WidthType.PERCENTAGE }, 
              margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
            new TableCell({
              borders,
              columnSpan: 1.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: `${item.name}`, size: 28 })]
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
        }),
        new TableRow({
          children: [
            new TableCell({
              borders,
              columnSpan: 0.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `时间`, size: 28 })]
                })
              ],
              shading: shadf2f2,
              width: { size: 19, type: WidthType.PERCENTAGE }, 
              margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
            new TableCell({
              borders,
              columnSpan: 1.5,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: `${item.time}`, size: 28 })]
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
        }),
        new TableRow({
          children: [
            new TableCell({
              borders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `描述内容`, size: 28 })]
                })
              ],
              shading: shadf2f2,
              width: { size: 19, type: WidthType.PERCENTAGE }, 
              margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
            new TableCell({
              borders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: `${item.content}`, size: 28 })]
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
        }),
        new TableRow({
          children: [
            new TableCell({
              borders,
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: allImages
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }, 
              margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1)}
            }),
          ]
        })
      ]
    })

    children.push(table)
    children.push(new Paragraph({ children: [new PageBreak()] }))
  }
    
  return children
}


// 上方为内部方法

const outDocx = async (data: any[]) => {
  try {
      let children:any = await genChildren(data)
      console.log('获取的dom', children)
      const DocumentTemple = { sections: [{ children }] }

      let doc:any = new Document(DocumentTemple)
      return doc
  } catch (error) {
    console.error('Word文档生成失败', error)
  }
}

const outTable = async (data: any[]) => {
  try {
    let children:any = await genTable(data)
    console.log('获取的dom', children)
    const DocumentTemple = { sections: [{ children }] }
    let doc:any = new Document(DocumentTemple)
    return doc
  } catch (error) {
    console.error('Word文档生成失败', error)
  }
}


export {
  outDocx,
  outTable
}