<template>
  <div class="index">
    <div class="top">
     <h4>{{state.desc}}</h4>
    </div>
    <ul>
      <li v-for="item of state.list" @click="gotoLink(item)" :key="item.id">{{item.name}}</li>
    </ul>

  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDocx } from '../api'

const router = useRouter()
const state = reactive({
  word: <any>[],
  desc: <string>'',
  list: <any>[
    {id: 1, name: '图文Word案例', url: '/graphic'},
    {id: 2, name: '表格Word案例', url: '/table' },
    {id: 3, name: '待开发中....', url: '/' },
    {id: 4, name: '待开发中....', url: '/' },
    {id: 5, name: '待开发中....', url: '/' },
    {id: 6, name: '待开发中....', url: '/' },
    {id: 7, name: '待开发中....', url: '/' },
    {id: 8, name: '待开发中....', url: '/' },
    {id: 9, name: '待开发中....', url: '/' },
  ]
})

onMounted(() => {
  state.desc = `
  这是一个Word文档导出的效果展示，提供一个思路，使用的是docx去导出的。目前支持图文的，表格
  基本上可以满足大部分的word文档导出需求，嘿嘿嘿感觉还是不错的，喜欢的小伙伴们可以看看
  `
  getItem()
})

const gotoLink = (item: any) => {
  
  if (item.name === '待开发中....') return
  
  router.push(item.url)
}

const getItem = async () => {
  console.log(111111)
  let item = await getDocx()
  console.log('sda', item)
}


</script>

<style lang="scss" scoped>
.index {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
  .top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  line-height: 1.5;
  }

  li { 
    list-style: none;
    text-align: center;
    border-radius: 5px;
    background: rgb(33, 243, 201);
    transition: box-shadow .4s ease-in-out;
    color: #222;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: translateY(2);
      box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
    }
  }
  ul {
    padding: 0;
    display: block;
    margin: 100px auto;
    width: 50%;
    height: 50%;
    display: grid;
    grid-template-columns: 30% 30% 30%; 
    grid-template-rows: 30% 30% 30%; 
    grid-gap: 5%; 
  }
}

</style>