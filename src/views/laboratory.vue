<template>
    <div class="main">
        <el-affix :offset="0">
            <div class="fix">
                <el-button @click="exportWord" type="primary">导出表格图片</el-button>
                <el-button @click="exportChart" type="success">导出图表</el-button>
                <el-button @click="exportGrid" type="info">导出段落九宫格</el-button>
                <el-button @click="router.back" type="primary">返回</el-button>
            </div>
        </el-affix>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { imageToBase64 } from '../utils'
import {
    AlignmentType,
    BorderStyle,
    Document,
    ImageRun,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType,
} from 'docx'
import { saveAs } from 'file-saver'
import { createImageGrid } from '../lib/grid'
import { Radar } from '@antv/g2plot'
import { createImageRun } from '../lib/image'

const router = useRouter()
const imgList = Array.from({ length: 9 }).fill(
    'https://image.magicbaba.com/newFile/plupload/user_11429/jpeg/20230526/file_647057e7daf44.jpeg',
)

const exportWord = async () => {
    console.log('导出', imgList)

    const children: any = []
    const imgDataPromisees = imgList.map((el: any) => imageToBase64(el))
    const imgData = await Promise.all(imgDataPromisees)

    console.log(imgData)

    const item = await createImageGrid(imgData, 3, false)
    children.push(item)
    const doc = new Document({
        sections: [{ children }],
    })

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, '九宫格图片docx')
    })
}

const chartData = Array.from({ length: 7 }, (_, key) => ({
    name: `G${key}Plots`,
    star: 100 * (key + 5),
}))

const exportChart = async () => {
    // 创建一个空数组来存放 Base64 图片
    let base64Images = []

    // 循环生成5个图表
    for (let i = 0; i < 5; i++) {
        // 创建一个新的 div 作为图表的容器
        let container = document.createElement('div')
        // 设置样式使其不在页面上显示
        container.style.display = 'none'
        document.body.appendChild(container)

        // 创建图表
        const radarPlot = new Radar(container, {
            renderer: 'canvas', // 使用 Canvas 渲染
            data: chartData.map((d) => ({ ...d, star: Math.sqrt(d.star) })),
            xField: 'name',
            yField: 'star',
            meta: {
                star: {
                    min: 0,
                    nice: true,
                },
            },
            area: {},
        })

        // 渲染图表
        radarPlot.render()

        // 等待图表渲染完成
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 将图表转换为 Base64 图片
        let canvas = container.querySelector('canvas')
        let base64Image = canvas?.toDataURL()
        base64Images.push(base64Image)

        // 移除图表容器
        document.body.removeChild(container)
    }

    console.log(base64Images) // 打印 Base64 图片数组

    // return
    const children: any = []

    base64Images.map((item: any) => {
        children.push(
            new Paragraph({
                children: [createImageRun(item, 500)],
                alignment: AlignmentType.CENTER,
            }),
        )
    })

    const doc = new Document({
        sections: [{ children }],
    })

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, '图表图片docx')
    })
}

const urls =
    'https://image.magicbaba.com/newFile/plupload/user_11429/jpg/20230614/file_6489266db0b84.jpg'
const exportGrid = async () => {
    console.log('urls', urls)

    const img = await imageToBase64(urls)
    console.log(img)
    const image = createImageRun(img, 240)
    const cellBorder = {
        color: '#ffffff',
        size: 50,
        style: BorderStyle.SINGLE,
    }
    const table3 = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                    new TableCell({
                        verticalAlign: VerticalAlign.CENTER,
                        children: [new Paragraph({ children: [image], alignment:AlignmentType.CENTER})],
                        margins: {
                            left: 200,
                            top: 200,
                            right: 200,
                            bottom: 200,
                        },
                        shading: {
                            fill: '#f2f2f2',
                        },
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: cellBorder,
                            left: cellBorder,
                            right: cellBorder,
                            bottom: cellBorder,
                        },
                    }),
                ],
            }),
        ],
    })

    const paragraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: {
            type: ShadingType.SOLID,
            fill: 'F2F2F2',
            color: 'F2F2F2',
        },
        children: [
            new TextRun({
                children: [
                    new ImageRun({
                        data: img,
                        transformation: {
                            width: 240,
                            height: 240,
                        },
                    }),
                ],
            }),
            new TextRun({
                text: '      ',
                shading: {
                    type: ShadingType.SOLID,
                    color: 'FFFFFF',
                    fill: 'FFFFFF',
                },
            }),
            new TextRun({
                children: [
                    new ImageRun({
                        data: img,
                        transformation: {
                            width: 240,
                            height: 240,
                        },
                    }),
                ],
            }),
        ],
    })

    const children: any = []
    children.push(table3)
    const doc = new Document({
        sections: [{ children }],
    })

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, '段落九宫格.docx')
    })
}
</script>

<style scoped lang="scss">
.main {
    width: 80%;
    margin: 40px auto;
}
</style>
