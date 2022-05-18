<template>
    <div style="width: 800px; margin: 0 auto;">
        <el-affix :offset="0">
        <div class="fix">
          <el-button @click="exportWord" type="primary">导出Word文档</el-button>
          <el-button @click="router.back" type="primary">返回</el-button>
        </div>
    </el-affix>
    <div class="table">
    <table class="block">
        <tr>
            <th>领域</th>
            <th>指标</th>
            <th>数量</th>
        </tr>
        <tr class="tb2" v-for="item in state.list" :key="item.id">
           <div>
               <span>{{item.field}}</span>
           </div>
           <div class="second">
               <p v-for="(i, key) in item.arr" :key="key">{{i.title}}</p>
           </div>
           <div class="second">
               <p v-for="(i, key) in item.arr" :key="key">{{i.count}}</p>
           </div>
        </tr>
    </table>
  </div>
    </div>
  
</template>

<script setup lang="ts">
import { Packer } from "docx";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { getIrrge } from '../api'
import { outIrrge } from '../tool/docx'
import { gen } from '../tool/tsd'
import { saveAs } from 'file-saver'

const router = useRouter()
const state = reactive({
    list: <any>[]
})

onMounted(async () => {
  const { data } = await getIrrge()
  state.list = data
  console.log(data)
})

const exportWord = async () => {
    console.log(1)

    let doc: any = await gen(state.list)
    Packer.toBlob(doc).then(blob => {
    saveAs(blob, '图文文档.docx')
    console.log('开始保存')
    }).finally(() => {
        console.log('导出成功')
    })

}

</script>

<style lang="scss" scoped>
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
.table {
    width: 600px;
    margin: 40px auto;
    padding-bottom: 80px;
    .block {
        box-sizing: border-box;
        display: block;
        width: 100%;
        border-radius: 12px;
        tr {
            width: 100%;
            display: inline-block;
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            &:last-child {
            border-bottom: 1px solid #ccc;
            border-radius: 0 0 6px 6px;
            }
            &:first-child {
            border-radius: 6px 6px 0 0;
            }
            th {
            color: #414141;
            width: 33.3%;
            font-weight: 500;
            display: inline-block;
            text-align: center;
            padding: 20px;
            border-right: 1px solid #ccc;
            &:last-child {
                border-right: none;
      }
            }
        }
        .tb2 {
    display: flex;
    justify-content: space-between;
    div {
      width: 33.3%;
      text-align: center;
      color: #777;
      border-right: 1px solid #ccc;      
      position: relative;
      &:last-child {
        border-right: none;
      }
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
       
      }
    }
    .second {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      p {
        border-bottom: 1px solid #ccc;
        margin: 0;
        width: 100%;
        padding: 10px 0;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
    }
}
</style>