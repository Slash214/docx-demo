<template>
  <el-affix :offset="120">
    <div class="btn">
        <el-button @click="exportWord" type="primary">导出Word文档</el-button>
    </div>
  </el-affix>
  <div class="main">
      <article class="item" v-for="i in state.word" :key="i.id">
        <div class="info">
            <span v-text="i.name"></span>
            <time v-text="i.time"></time>
        </div>
        <p v-text="i.title" class="title"></p>
        <div class="content" v-text="i.content"></div>
        <div class="imgbox">
            <img :src="img.url" alt="" v-for="(img,key) of i.picture" :key="key">
        </div>
      </article>
  </div>
  <el-dialog v-model="state.downloadflag" title="下载中请稍后">
    <div>
        <div v-if="state.ok" style="text-align: center; margin-bottom: 20px">
          <p>正在导出中...马上就好了,请再耐心等待</p>
        </div>
        <el-progress :percentage="state.percentage" :color="customColors" />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Packer } from 'docx'
import { reactive, onMounted, ref } from 'vue'
import { getDocx } from '../api'
import { outDocx } from '../tool/docx'
import { saveAs } from 'file-saver'


const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const state = reactive({
    word: <any>[],
    downloadflag: <boolean>false,
    percentage: <number>0,
    ok: <boolean>false
})

onMounted( async() => {
    console.log('start')
    const { data, status} = await getDocx()
    state.word = data
    console.log(data)

})

const exportWord = async () => {
  state.downloadflag = !state.downloadflag

  let num = 0
  for (let i = 0, len = state.word.length; i < len; i++) {
    console.log('开始了', i)
    state.percentage = ((100 / state.word.length ) * i)<<0
    let { picture } = state.word[i] || {}
    state.word[i].imgList = []
    if (picture.length) {
      for (let img of picture) {
        state.word[i].imgList.push(await urlToBase64(img.url))
      }
    }
  }
   
  console.log(state.word)
  //   let data:any = []

  const doc:any = await outDocx(state.word)
  console.warn('获取的', doc)
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, '图文文档.docx')
    console.log('开始保存')
    state.ok = true
  }).finally(() => {
    console.log('导出成功')
    state.downloadflag = !state.downloadflag
    state.percentage = 100
    state.ok = false
  })
  

}

const urlToBase64 = (url:string) => {
   return new Promise((resolve, reject) => {
       let image = new Image()
       image.setAttribute("crossOrigin",'Anonymous');
       image.onload = () => {
           let canvas = document.createElement('canvas')
           canvas.width = image.width
           canvas.height = image.height
           canvas.getContext('2d')?.drawImage(image, 0, 0)
           const result = canvas.toDataURL('image/png')
           resolve(result)
       }
       image.src = url
       image.onerror = () => {
          reject(new Error('图片流异常'))
       }
   })
}

</script>

<style lang="scss" scoped>
.btn {
    margin-left: 100px;
}
.main {
    width: 800px;
    min-height: 50vh;
    margin: 20px auto;
    padding-bottom: 80px;
    .item {
       margin-bottom: 20px;
       display: block;
       padding: 10px;
       border-radius: 8px;
    //    background-color: rgb(1, 15, 6);
       box-shadow: 0 2px 12px 0 rgba(18, 175, 243, 0.1);
       text-align: justify;
       font-size: 14px;
       .info {
           color: #999;
           span {
               padding-right: 20px;
           }
           padding-bottom: 5px;
        }
       .title {
          color: #333;
          line-height: 1.5;
          letter-spacing: 1px;
          padding-bottom: 5px;
       }
       .content {
           padding-bottom: 10px;
           color: #666;
           line-height: 1.5;
           letter-spacing: 1px;
       }
       .imgbox {
           display: flex;
           flex-wrap: wrap;
           img {
               display: block;
               width: 240px;
               height: 180px;
               object-fit: cover;
               margin: 0 10px 10px 0;
           }
       }

    }
}
</style>