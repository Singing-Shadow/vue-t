<script setup>
import { ref, onMounted } from 'vue';
import { useContentLoader } from '@/composables/useContentLoader.js';

const searchContest = ref(''); // 用于存储搜索框的值
const pictureList = ref([]); // 用于存储加载的图片信息
const { loadMoreStuff, addLazyLoadListener } = useContentLoader();

onMounted(() => {
    loadMoreStuff(pictureList, createPictureElement, searchContest, true);
    addLazyLoadListener(pictureList, createPictureElement, searchContest, true);
});

// 创建图片元素
function createPictureElement(picture) {
    return {
        id: picture.id,
        name: picture.name,
        author: picture.author,
        thumbnail_path: picture.images_path[0].thumbnail_path,
    };
}

// 切换喜欢按钮的状态
function toggleLove(event) {
    const loveButton = event.currentTarget;
    loveButton.classList.toggle('loved');
}

// 封装通用跳转方法
function openPage(baseUrl, paramValue) {
    const url = `${baseUrl}/${encodeURIComponent(paramValue)}`;
    window.open(url, '_blank');
}
</script>

<template>
    <el-main>
        <div id="gallery">
            <!-- 使用 Vue 动态渲染图片列表 -->
            <div v-for="picture in pictureList" :key="picture.id" class="imageInfo-container">
                <div class="image-container">
                    <img :src="picture.src" :alt="picture.name" title=""
                        @click="() => openPage('/picture', picture.id)" />
                    <div class="love-button-container" title="喜欢">
                        <div class="love-button" title="喜欢" @click="toggleLove"></div>
                    </div>
                </div>
                <p @click="() => openPage('/picture', picture.id)" style="font-weight: bold;">
                    {{ picture.name }}
                </p>
                <p @click="() => openPage('/search', picture.author)">
                    {{ picture.author }}
                </p>
            </div>
        </div>
    </el-main>
</template>

<style scoped>
/* 画廊 */
#gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

/* 图片信息容器 */
.imageInfo-container {
    width: 23%;
    margin: 0 1%;
}

/* 图片容器 */
#gallery .image-container {
    position: relative;
    border-radius: 4%;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    margin: 2% 0;

    overflow: hidden;
    cursor: help;
}

/* 图片 */
#gallery div>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 点赞按钮边框 */
.love-button-container {
    position: absolute;
    bottom: 3%;
    right: 3%;
    width: 12%;
    height: auto;

    -webkit-mask: url('../../public/other/love-red.svg') no-repeat center / contain;
    mask: url('../../public/other/love-red.svg') no-repeat center / contain;
    background-color: #ffffff;
    cursor: pointer;
    z-index: 5;
}

/* 点赞按钮 */
.love-button {
    width: 100%;
    aspect-ratio: 1 / 1;

    -webkit-mask: url('../../public/other/love.svg') no-repeat center / contain;
    mask: url('../../public/other/love.svg') no-repeat center / contain;
    background-color: #000000;
    cursor: pointer;
}

/* 点赞按钮切换 */
.loved {
    -webkit-mask: url('../../public/other/love-red.svg') no-repeat center / contain;
    mask: url('../../public/other/love-red.svg') no-repeat center / contain;
    background-color: red;
}

/* 图片信息 */
#gallery p {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0.95rem;
    text-align: left;
    /* 文本溢出省略为省略号 */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: help;
}

/* 针对竖屏设备 */
@media only screen and (orientation: portrait) {

    /* 图片信息容器 */
    .imageInfo-container {
        width: 48%;
        margin: 0 1%;
    }

    /* 图片信息 */
    #gallery p {
        font-size: 0.8rem;
    }
}
</style>
