<template>
    <div class="avatar" :style="avatarStyle">
        <div class="avatar-text">{{ avatarText }}</div>
        <img v-if="src" :src="src" alt="avatar" class="avatar-img" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'Avatar',
    props: {
        name: {
            type: String,
            required: false,
            default: '',
        },
        src: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        avatarStyle() {
            return {
                background: this.randomGradient,
            }
        },
        avatarText() {
            return this.name ? this.name[0] : ''
        },
        randomGradient() {
            const hue = Math.floor(Math.random() * 360)
            const saturation = 70
            const lightness = 60
            return `linear-gradient(hue ${hue}deg, hsl(${hue}, ${saturation}%, ${lightness}%) 0%, hsl(${hue}, ${
                saturation - 10
            }%, ${lightness + 10}%) 100%)`
        },
    },
})
</script>

<style scoped>
.avatar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
}

.avatar-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-text {
    position: relative;
    z-index: 1;
}
</style>
