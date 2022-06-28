<template>
  <div class="mainBox">
    <el-affix :offset="0">
      <div class="fix">
        <el-button @click="exportWord" type="primary">导出Word文档</el-button>
        <el-button @click="router.back" type="primary">返回</el-button>
      </div>
    </el-affix>
    <table class="block" v-for="v in state.tableData" :key="v.id">
        <tr>
            <td>班级</td>
            <td>{{v.classname}}</td>
        </tr>
        <tr>
            <td>姓名</td>
            <td>{{v.name}}</td>
        </tr>
        <tr>
            <td>时间</td>
            <td>{{v.time}}</td>
        </tr>
        <tr>
            <td>描述内容</td>
            <td>{{v.content}}</td>
        </tr>

        <div class="imgbox">
            <img :src="img.url" alt="图片" v-for="(img, key) of v.imgList" :key="key"  />
        </div>
    </table>
  </div>
  <Tips :show="state.show" :percentage="state.percentage" :ok="state.ok" />
</template>

<script lang="ts" setup>
import { Packer } from "docx"
import { onMounted, reactive } from "vue-demi"
import { getTable } from '../api'
// import { outTable } from '../tool/docx'  
import { outTable } from 'easy-word'
import { saveAs } from 'file-saver'
import { urlToBase64 } from '../tool/common'
import { useRouter } from "vue-router"

const router = useRouter()
const state = reactive({
  tableData: <any>[],
  show: false,
  percentage: 0,
  ok: <boolean>false
})


onMounted(async () => {
  const { data } = await getTable()
  state.tableData = data
})

const exportWord = async () => {
  console.log('导出')
  state.show = true
  // 图片转base 
  
  let word:any = []
  
  for (let i = 0, len = state.tableData.length; i < len; i++ ) {
    let { classname, time, content, name } = state.tableData[i] || {}
    let imgList: any = []
    state.percentage = ((100 / state.tableData.length ) * i)<<0
    if (state.tableData[i].imgList.length) {
      for (let img of state.tableData[i].imgList) {
        imgList.push(await urlToBase64(img.url))
      }
    }
    // state.tableData[i]['newImg'] = imgList
    word.push({
      0: classname,
      1: name,
      2: time,
      3: content,
      imgList
    })
  }
  state.ok = true
  console.log('封装成功', word)
  

  // return
  let caption:any = ['班级', '姓名', '时间', '描述内容']
  let wordName = '我是自定义的名称-Table文档'
  let doc:any = await outTable(caption, 5, word)
  
  Packer.toBlob(doc).then(blob => {
    console.log('blob', blob)
    saveAs(blob, `${wordName}.docx`)
    console.log('开始保存')
  }).finally(() => {
    console.log('导出成功')
    state.percentage = 100
    state.show = false
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
  .block {
    display: block;
    margin-bottom: 20px;
    width: 100%;
    tr {
        width: 100%;
        td {
          padding: 10px 20px;
          border: 1px solid #ddd;
          text-align: justify;
          letter-spacing: 1px;
          font-size: 14px;
          color: #666;  
          line-height: 1.5;
          &:first-child {
            color: #111;
            width: 25%;
          }
          &:last-child {
            flex: 1;
          }
        }
    }
    .imgbox {
        border: 1px solid #ddd;
        border-top: none;
        width: 100%;
        padding: 10px 20px;
        display: flex;
        flex-wrap: wrap;
        img {
            display: inline-block;
            object-fit: cover;
            width: 180x;
            height: 220px;
            margin:  0 10px 10px 0;
        }
    }
  }
}
</style>