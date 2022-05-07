<template>
  <div class="main">
    <div class="card" @click="gotoLink" v-for="i in state.list" :key="i.id">
      <p>{{i.name}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDocx } from '../api'

const router = useRouter()
const state = reactive({
  word: <any>[],
  list: <any>[
    {id: 1, name: '图文Demo'},
    {id: 2, name: '表格Demo'},
  ]
})

onMounted(() => {
  console.log('start')
  getItem()
})

const gotoLink = () => {
  router.push('/graphic')
}

const getItem = async () => {
  console.log(111111)
  let item = await getDocx()
  console.log('sda', item)
}


</script>

<style lang="scss" scoped>
.main {
  width: 1400px;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  .card {
    width: 300px;
    height: 300px;
    padding: 10px;
    margin: 0 20px 20px 0;
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    p {
      text-align: center;
      line-height: 300px;
      font-size: 40px;
    }
  }
}
</style>