<template>
<el-affix :offset="120">
    <div class="btn">
      <el-button @click="exportWord" type="primary">导出Word文档</el-button>
      <el-button @click="router.back" type="primary">返回</el-button>
    </div>
  </el-affix>
  <div class="mainBox">
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
  <Tips :show="state.show" :percentage="state.percentage" />
</template>

<script lang="ts" setup>
import { Packer } from "docx"
import { onMounted, reactive } from "vue-demi"
import { getTable } from '../api'
import { outTable } from '../tool/docx'
import { saveAs } from 'file-saver'
import { urlToBase64 } from '../tool/common'
import { useRouter } from "vue-router"

const router = useRouter()
const state = reactive({
  tableData: <any>[],
  show: false,
  percentage: 0
})


onMounted(async () => {
  const { data } = await getTable()
  console.log(data)
  state.tableData = data
})

const exportWord = async () => {
  console.log('导出')
  state.show = true
  // 图片转base 
  for (let i = 0, len = state.tableData.length; i < len; i++ ) {
    let { imgList } = state.tableData[i] || {}
    let newImg = []
    state.percentage = ((100 / state.tableData.length ) * i)<<0
    if (imgList.length) {
      for (let img of imgList) {
        newImg.push(await urlToBase64(img.url))
      }
    }
    state.tableData[i]['newImg'] = newImg
  }

  console.log('封装成功', state.tableData)

  Packer.toBlob(await outTable(state.tableData)).then(blob => {
    saveAs(blob, '图文文档.docx')
    console.log('开始保存')
  }).finally(() => {
    console.log('导出成功')
    state.percentage = 100
    state.show = false
  })
}
</script>

<style lang="scss" scoped>
.btn {
    margin-left: 100px;
}
.mainBox {
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