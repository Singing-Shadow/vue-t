<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const opacity = ref(0.5);
const isButtonDisabled = ref(true);

// 平滑滚动到顶部
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// 控制置顶按钮的启用/禁用状态
const handleScroll = () => {
    if (window.scrollY > 300) {
        opacity.value = 1;
        isButtonDisabled.value = false;
    } else {
        opacity.value = 0.5;
        isButtonDisabled.value = true;
    }
};

onMounted(() => {
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    // 移除滚动事件监听器
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div id='up-to-top' :style='{ opacity: opacity }'>
        <button id='up-to-top-button' :disabled=isButtonDisabled @click='scrollToTop'>
            <!-- 按钮内容为空格，可以根据需求添加图标或文字 -->
        </button>
    </div>
</template>

<style scoped>
/* 返回顶部按钮 */
#up-to-top {
    position: fixed;
    right: 1%;
    bottom: 5%;
    box-sizing: border-box;
    width: 3rem;
    padding: 0.3rem;
    border-radius: 2rem;

    z-index: 8;
    background-color: #00000060;
    opacity: 0.5;
    transition: opacity 0.3s;
}

#up-to-top-button {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 为了兼容 */
    -webkit-mask: url('/public/other/up-to-top.svg') no-repeat center / contain;
    /* 图片蒙版 */
    mask: url('/public/other/up-to-top.svg') no-repeat center / contain;
    background-color: #FFC7C7;
    cursor: pointer;
}

#up-to-top-button:disabled {
    cursor: default;
}
</style>