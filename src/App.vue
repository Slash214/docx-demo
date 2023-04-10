<script setup lang="ts">
import JSConfetti from 'js-confetti'


const confetti = new JSConfetti()

function showConfetti() {
  confetti.addConfetti()
}

showConfetti()

</script>

<template>
  <router-view></router-view>
   <el-backtop :right="100" :bottom="100" />
</template>

<style>
</style>
