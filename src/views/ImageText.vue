<template>
    <div class="container">
        <el-affix :offset="0">
            <el-button type="primary" @click="download">下载</el-button>
            <el-button type="primary">返回</el-button>
        </el-affix>
        <div class="list">
            <div class="item" v-for="item of list" :key="item.id">
                <h4>{{ item.title }}</h4>
                <span>{{ item.time }}</span>
                <p>{{ item.desc }}</p>
                <div class="imglist">
                    <div class="img-item" v-for="items of item.imgList">
                        <img :src="items" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Tips :percentage="state.percentage" :show="state.downloadflag" :ok="state.ok" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getImageText } from '../api'
import { testSSSTable } from '../utils/Table';

interface List {
    id: number
    time: string
    desc: string
    title: string
    imgList: []
}

let state = reactive({
    percentage: 0,
    downloadflag: false,
    ok: false,
})

const list = ref<List[]>([])

onMounted(() => {
    getData()
})

const getData = async () => {
    const { data } = await getImageText()
    console.log(data)
    list.value = data
}

const download = async () => {
    console.log('开始下载')

    // testSSSTable()
    // return
    // outWord()
    // wordImage([1, 2, 3, 4, 5, 6, 7, 8, 9])
    // return
    // 可以考虑使用for...of循环而不是Promise.all()来处理图像数组。
    //  这是因为Promise.all()并行处理所有承诺，如果您有大量图像需要处理，则可能效率低下。

    // 100 图片内  2800 毫秒
    // 1000 数组 9000 图片
    const startTime = performance.now()
    state.downloadflag = true
    const data = await Promise.all(
        list.value.map(async (item, index) => {
         state.percentage = (100 / list.value.length) * (index + 1)
            const newImgList = await Promise.all(
                item.imgList.map(async (img) => {
                    const base64Url = await convertUrlToBase64(img)
                    return base64Url 
                }),
            )
            return { ...item, imgList: newImgList }
        }),
    )

    const endTime = performance.now()
    const executionTime = endTime - startTime
    // console.log(data)
    testSSSTable(data)
    // outGridWord(data)
    console.log(`Execution time: ${executionTime} milliseconds`)

    // 执行速度：4200-4300 毫秒
    // state.downloadflag = true
    // const startTime = performance.now()
    // const data = []
    // for (const [index, item] of list.value.entries()) {
    //     state.percentage = (100 / list.value.length) * (index + 1)
    //     const newImgList = []
    //     for (const img of item.imgList) {
    //         const base64Url = await urlToBase64(img.url)
    //         newImgList.push({ url: base64Url })
    //     }
    //     data.push({ ...item, imgList: newImgList })
    // }
    // const endTime = performance.now()
    // const executionTime = endTime - startTime
    // console.log(data)
    // state.percentage = 100
    // console.log(`Execution time: ${executionTime} milliseconds`)
}


/**
 * 将图片 URL 转换为 Base64 格式
 * @param {string} imageUrl 图片 URL
 * @param {number} [width] 缩放后的宽度
 * @returns {Promise<string>} 图片的 Base64 格式
 */
 async function convertUrlToBase64(imageUrl: string, width?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 允许跨域
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { naturalWidth, naturalHeight } = img;
      // 如果传入了宽度，则等比缩放
      if (width) {
        const scale = width / naturalWidth;
        naturalWidth *= scale;
        naturalHeight *= scale;
      }
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, naturalWidth, naturalHeight);
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = imageUrl;
  });
}


</script>

<style scoped lang="scss">
.container {
    width: 1024px;
    margin: 40px auto;
    .list {
        .item {
            margin-bottom: 80px;
            text-align: justify;
            line-height: 1.5;
            h4 {
                font-weight: 600;
                font-size: 20px;
                color: #101010;
            }
            span {
                display: block;
                padding: 10px 0;
                font-size: 14px;
                color: #149ff5;
            }
            p {
                color: #999;
                letter-spacing: 0.2em;
                font-size: 14px;
            }
            .imglist {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                margin-top: 20px;
                .img-item {
                    display: block;
                    width: 32%;
                    margin: 0 2% 2% 0;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                }
            }
        }
    }
}
</style>
