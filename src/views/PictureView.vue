<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePictureConfig } from '@/composables/usePictureConfig';
// import { initiateDownload } from '@/composables/useDownload';
import { setupTouchHandlers, onKeyDown } from '@/composables/useSwitchHandler';
import FullPicture from '@/components/fullScreenPicture.vue';
import Download from '@/components/download.vue';

const route = useRoute(); // 获取当前路由信息
const router = useRouter(); // 获取路由和路由器实例
const currentIndex = ref(0); // 当前图片索引
const currentPictureData = ref({}); // 当前图片数据
const isLove = ref(false); // 控制点赞状态
const { pictureData } = usePictureConfig(); // 获取图片配置数据
const imageUrl = ref(''); // 图片 URL
const isShow = ref(false); // 控制图片显示状态

// 当组件挂载时加载图片配置
onMounted(() => {
    // 初始化配置
    setTimeout(() => {
        initializeConfig()
        window.addEventListener('keydown', handleKeydownEvent); // 监听键盘事件
        setupTouchHandlers(navigateToImage); // 绑定触摸事件
    }, 200);
});

// 初始化配置
function initializeConfig() {
    if (!pictureData.list || pictureData.list.length === 0) {
        console.warn('图片数据未加载完成');
        return;
    }
    const id = route.params.id; // 获取路由参数中的 ID
    currentIndex.value = id ? parseInt(id, 10) - 1 : 0; // 根据 ID 设置当前图片索引
    refreshCurrentImage(); // 刷新当前图片
}

// 更新当前图片信息
function refreshCurrentImage() {
    if (pictureData.list && pictureData.list.length > 0) {
        currentPictureData.value = pictureData.list[currentIndex.value]; // 根据当前索引更新图片数据
        imageUrl.value = currentPictureData.value.href[0]; // 更新图片 URL
    } else {
        console.warn('图片数据未加载，无法刷新图片');
    }
}

// 切换到新一张图片并更新路由
function navigateToImage(delta) {
    if (!pictureData.list || pictureData.list.length === 0) {
        console.warn('图片数据未加载，无法切换图片');
        return;
    }
    currentIndex.value = (currentIndex.value + delta + pictureData.list.length) % pictureData.list.length; // 更新索引
    refreshCurrentImage(); // 刷新当前图片
    router.push({ name: 'picture-view', params: { id: currentIndex.value + 1 } }).catch(err => {
        console.error('Routing error:', err);
    }); // 更新路由
}

// 处理键盘事件的逻辑
function handleKeydownEvent(event) {
    navigateToImage(onKeyDown(event)); // 使用 onKeyDown 处理键盘事件，并传递给 navigateToImage 函数
}

// 切换点赞状态
function toggleLove() {
    isLove.value = !isLove.value; // 切换点赞状态
}

// 点击图片开大图
function showFullPicture(url) {
    isShow.value = !isShow.value;
    imageUrl.value = url;
}

// 清理事件监听器
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydownEvent); // 移除键盘事件监听
});
</script>

<template>
    <el-main>
        <div id="imageInfo">
            <div>
                <!-- 图片展示 -->
                <div id="image" v-if="currentPictureData && currentPictureData.href
                    && currentPictureData.href.length > 0">
                    <!-- 循环展示每一张图片 -->
                    <img v-for="(imgSrc, index) in currentPictureData.href" :key="index" :src="imgSrc"
                        :alt="currentPictureData.name" @click="showFullPicture(imgSrc)" />
                </div>
                <div v-else>
                    <!-- 如果没有图片，展示占位符 -->
                    <p>No images available</p>
                </div>

                <!-- 信息展示 -->
                <div id="info">
                    <!-- 设置按钮 -->
                    <div id="setting">
                        <div :class="['love', { loved: isLove }]" title="喜欢" @click="toggleLove"></div>
                        <!-- <div id="download" title="下载" @click="initiateDownload(currentPictureData)"></div> -->
                        <Download :currentImageData="currentPictureData"></Download>
                    </div>

                    <!-- 名称、作者、标签 -->
                    <div id="name" style="font-size: 1.2rem; font-weight: bold;">{{ currentPictureData.name }}</div>
                    <div id="author" style="font-weight: bold;">{{ currentPictureData.author }}</div>
                    <div id="label" style="font-size: 0.9rem;">
                        <span v-for="label in currentPictureData.label" :key="label">#{{ label }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="other"></div>
        <FullPicture :imageSrc="imageUrl" v-show="isShow" @click="showFullPicture('')"></FullPicture>
    </el-main>
</template>


<style scoped>
/* 图片信息 */
#imageInfo {
    border-radius: 1%;
    overflow: hidden;
    background-color: #ffffff;
}

/* 图片 */
#image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 0 10%;
    background-color: #fafafa;
}

/* 图片 */
#image>img {
    display: block;
    width: 100%;
    cursor: zoom-in;
}

/* 信息 */
#info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: 2% 10%;
    background-color: #FF9999;
}

/* 信息内容容器 */
#info>* {
    padding: 1% 0;
}

/* 设置栏 */
#setting {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    width: 100%;

}

/* 设置栏选项 */
#setting * {
    height: 1.5rem;
    /* 限定容器宽高比为 1 / 1 */
    aspect-ratio: 1 / 1;
    margin: 0 1%;
}

/* 点赞按钮 */
.love {
    /* 为了兼容 */
    -webkit-mask: url('/public/other/love.svg') no-repeat center / contain;
    /* 图片蒙版 */
    mask: url('/public/other/love.svg') no-repeat center / contain;
    background-color: #000000;
}

/* 点赞按钮切换 */
.loved {
    /* 为了兼容 */
    -webkit-mask: url('/public/other/love-red.svg') no-repeat center / contain;
    /* 图片蒙版 */
    mask: url('/public/other/love-red.svg') no-repeat center / contain;
    background-color: #ff0000;
}

/* 下载按钮 */
#download {
    /* 为了兼容 */
    -webkit-mask: url('/public/other/download.svg') no-repeat center / contain;
    /* 图片蒙版 */
    mask: url('/public/other/download.svg') no-repeat center / contain;
    background-color: #000000;
}

/* 标签组 */
#label {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    width: 100%;
}

/* 标签 */
#label>span {
    margin-right: 2%;
}
</style>