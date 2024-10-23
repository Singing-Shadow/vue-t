<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    imageSrc: String, // 接收图片地址的 prop
});

// 模拟禁用全局监听器和函数的占位符
const disableGlobalEvents = () => {
    // 这里禁用全局监听器的代码
};

const enableGlobalEvents = () => {
    // 这里重新启用全局监听器的代码
};

onMounted(() => {
    // 禁用全局监听器或函数
    disableGlobalEvents();
});

onBeforeUnmount(() => {
    // 组件销毁时重新启用全局监听器或函数
    enableGlobalEvents();
});
</script>

<template>
    <div class="fullscreen-wrapper">
        <img :src="props.imageSrc" alt="fullscreen image" class="fullscreen-image" />
    </div>
</template>

<style scoped>
.fullscreen-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000cc;
    /* 背景色 */
    overflow: auto;
    /* 启用滚动条 */
    /* Firefox */
    scrollbar-width: thin;
    /* IE and Edge */
    -ms-overflow-style: auto;
    z-index: 9999;
    cursor: zoom-out;
}

.fullscreen-image {
    width: 90%;
}

/* 针对非PC设备 */
@media (max-width: 768px) {
    .fullscreen-wrapper {
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fullscreen-image {
        width: 100%;
    }
}
</style>