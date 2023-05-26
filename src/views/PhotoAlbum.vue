<template>
	<div class="main">
       <el-button type="primary" @click="router.back">返回</el-button>
	   <!-- 先请求数据 -->
	   <el-button type="success" @click="exportWrod">导出新版</el-button>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getNewData } from '../api';
import { outPhotoAlbum } from '../tool';

const router = useRouter()
const wordData = ref<any>({})

onMounted(async () => {
	const data = await getNewData()
	console.log(data)
	wordData.value = data
})


const exportWrod = () => {
	console.log('导出')
	outPhotoAlbum(wordData.value)
}

</script>

<style scoped lang="scss">
.main {
	width: 70%;
	margin: 40px auto;
	// background-color: #000;
}
</style>