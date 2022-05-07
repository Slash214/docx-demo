import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, HeightRule, convertInchesToTwip, TableAnchorType, RelativeHorizontalPosition, OverlapType, TableLayoutType, ImageRun, convertMillimetersToTwip, Footer, PageBreak, TextWrappingType, TextWrappingSide, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign, Tab } from "docx"

const _genPicture = (base:string) => {
  return new ImageRun({
    data: base,
    transformation: {
      width: 280,
      height: 200
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


export {
  outDocx
}