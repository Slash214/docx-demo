<template>
  <div class="mainBox">
      <el-affix :offset="0">
        <div class="fix">
          <el-button @click="exportWord" type="primary">导出Word文档</el-button>
          <el-button @click="router.back" type="primary">返回</el-button>
        </div>
      </el-affix>

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
  <Tips :percentage="state.percentage" :show="state.downloadflag" :ok="state.ok" />
</template>

<script lang="ts" setup>
import { Packer } from 'docx'
import { reactive, onMounted } from 'vue'
import { getDocx } from '../api'
// import { outGraphic } from '../tool/docx'
import { outGraphic } from 'easy-word'
import { saveAs } from 'file-saver'
import { urlToBase64 } from '../tool/common'
import { useRouter } from 'vue-router'

const state = reactive({
    word: <any>[],
    downloadflag: <boolean>false,
    percentage: <number>0,
    ok: <boolean>false
})

const router = useRouter()
onMounted( async() => {
    console.log('start')
    const { data, status} = await getDocx()
    state.word = data
    console.log(data)
})


const exportWord = async () => {
  state.downloadflag = !state.downloadflag

  let num = 0, word: any[] = []
  for (let i = 0, len = state.word.length; i < len; i++) {
    console.log('开始了图片循环', i)
    state.percentage = ((100 / state.word.length ) * i)<<0
    let { picture, content, name, time, title } = state.word[i] || {}
    let imgList:any = []
    if (picture.length) {
      for (let img of picture) {
        imgList.push(await urlToBase64(img.url))
      }
    }

    word.push({
      0: title,
      1: `${time}  ${name}`,
      2: content,
      imgList
    })

  }
  state.ok = true
  console.log(word)
  //   let data:any = []

  const doc:any = await outGraphic(3, word)
  console.warn('获取的', doc)
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, '图文文档.docx')
    console.log('开始保存')
  }).finally(() => {
    console.log('导出成功')
    state.downloadflag = !state.downloadflag
    state.percentage = 100
    state.ok = false
  })
  

}


</script>

<style lang="scss" scoped>
.mainBox {
    .fix {
      width: 100%;
      transition: all .3s ease-in-out;
      background: #fff;
      height: 60px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      .el-button {
        margin-right: 20px;
      }
    }
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