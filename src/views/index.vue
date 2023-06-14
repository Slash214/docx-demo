<template>
    <div class="index">
        <div class="top">
            <h4 class="title">{{ state.desc }}</h4>
        </div>
        <ul>
            <li v-for="item of state.list" @click="gotoLink(item)" :key="item.id">
                {{ item.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDocx } from '../api'
import { ElNotification } from 'element-plus'

const router = useRouter()
const state = reactive({
    word: <any>[],
    desc: <string>'',
    list: <any>[
        { id: 1, name: '图文文档案例', url: '/graphic' },
        { id: 2, name: '表格文档案例', url: '/table' },
        { id: 3, name: '不规则表格案例', url: '/irreg' },
        { id: 4, name: '图文案例', url: '/imagetext' },
        // { id: 5, name: '展示组件', url: '/comp' },
        { id: 6, name: '新版图文相册', url: '/photoalbum' },
        { id: 7, name: '实验室', url: '/laboratory' },
        { id: 8, name: '待开发中....', url: '/' },
        { id: 9, name: '待开发中....', url: '/' },
    ],
})

onMounted(() => {
    state.desc = `
  这是一个Word文档导出的效果展示，提供一个思路，使用的是docx去导出的。目前支持图文的，表格
  基本上可以满足大部分的word文档导出需求，嘿嘿嘿感觉还是不错的，喜欢的小伙伴们可以看看
  `
    getItem()
})

const gotoLink = (item: any) => {
    if (item.name === '待开发中....') {
        ElNotification({
            title: '帅气的提示！',
            message: '正在开发制作其他样式中...',
            type: 'warning',
        })
        return
    }
    router.push(item.url)
}

const getItem = async () => {
    let item = await getDocx()
    console.log('sda', item)
}
</script>

<style lang="scss" scoped>
.index {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    // background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
    background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    .top {
        width: 50%;
        margin: 40px auto 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
        line-height: 1.5;
        text-align: center;
        color: #fff;
        .title {
            font-size: 20px;
            font-weight: 700;
        }
    }

    li {
        list-style: none;
        text-align: center;
        border-radius: 5px;
        background: #fff;
        transition: all 0.3s ease-in-out;
        color: #888;
        cursor: pointer;
        display: block;
        height: 150px;
        line-height: 150px;
        &:hover {
            transform: translateY(-8px);
            background-color: #f3c04c;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            color: #fff;
        }
    }
    ul {
        padding: 0;
        display: block;
        margin: 100px auto;
        width: 50%;
        height: 80%;
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-template-rows: 30% 30% 30%;
        grid-gap: 5%;
    }
}
</style>
