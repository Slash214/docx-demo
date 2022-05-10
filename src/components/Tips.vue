<template>
  <el-dialog :close-on-click-modal="false" v-model="props.show" title="下载中请稍后" >
    <div>
        <div v-if="props.ok" style="text-align: center; margin-bottom: 20px">
          <p>正在导出中...马上就好了,请再耐心等待</p>
        </div>
        <el-progress :percentage="props.percentage" :color="customColors" />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
    percentage: {
      type:  Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    ok: {
      type: Boolean,
      default: false
    }
})

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

</script>
