<script setup>
import { ref, onMounted } from 'vue';
import { useContentLoader } from '@/composables/useContentLoader.js';

// 搜索框输入值
const searchContest = ref(``);
const pictureList = ref([]); // 用于存储加载的图片列表
const { loadMoreStuff, setPerLoadNum, setCurrentIndex, addLazyLoadListener } = useContentLoader();

// 搜索按钮点击事件
const onSearchSubmit = () => {
    setCurrentIndex(0);
    pictureList.value = []; // 清空之前的结果
    loadMoreStuff(pictureList, createPictureElement, shouldLoadItem);
};

// 页面加载时
onMounted(() => {
    setPerLoadNum(30); // 设置初始加载 30 条数据
    loadMoreStuff(pictureList, createPictureElement, shouldLoadItem);
    addLazyLoadListener(pictureList, createPictureElement, shouldLoadItem);
});

// 创建条目元素
function createPictureElement(Item) {
    return {
        id: Item.id,
        name: Item.name,
        author: Item.author,
        category: Item.category,
        label: Item.label.slice(0, 3) // 只取前三个标签
    };
}

// 判断条目是否符合条件
function shouldLoadItem(picture) {
    if (!searchContest.value) return true;
    return ['name', 'category', 'author', 'label'].some(key => {
        const value = picture[key];
        if (Array.isArray(value)) {
            return value.some(subValue => subValue.toLowerCase().includes(searchContest.value.toLowerCase()));
        }
        return value.toLowerCase().includes(searchContest.value.toLowerCase());
    });
}
</script>

<template>
    <el-main id="List">
        <div id="imageList-container">
            <div id="setting">
                <form id="search" @submit.prevent="onSearchSubmit">
                    <input v-model="searchContest" id="text" type="text" placeholder="MiyU" />
                    <input type="button" id="button" @click="onSearchSubmit" title="搜索" />
                </form>
            </div>
            <div id="imageList">
                <div id="item">
                    <div class="name">插画名</div>
                    <div class="author">插画作者</div>
                    <div class="category">插画分类</div>
                    <div class="label">标签 1</div>
                    <div class="label">标签 2</div>
                    <div class="label">标签 3</div>
                </div>
                <!-- 使用 Vue 动态渲染图片列表 -->
                <div v-for="picture in pictureList" :key="picture.id" class="item">
                    <a class="name" :href="`/picture/${picture.id}`" target="_blank" style="font-weight: bold;">{{
                        picture.name }}</a>
                    <a class="author" :href="`/search/author=${picture.author}`">{{ picture.author }}</a>
                    <a class="category" href="#">{{ picture.category }}</a>
                    <a v-for="(label, index) in picture.label" :key="index" class="label" href="#">{{ label }}</a>
                </div>
            </div>
        </div>
    </el-main>
</template>

<style scoped>
/* 画廊 */
#imageList-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#setting {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 1% 0;
    padding: 0.5rem 0;
}

#search {
    display: flex;
    align-items: center;
    margin: 0 1%;
}

#text {
    flex: 1;
    padding: 0.5rem;
    margin-right: 0.5rem;
    border: 1px solid #000000;
    border-radius: 10px;
}

#setting #button {
    display: block;
    height: 1rem;
    width: 1rem;
    aspect-ratio: 1 / 1;
    -webkit-mask: url('../../public/other/search.svg') no-repeat center / contain;
    mask: url('../../public/other/search.svg') no-repeat center / contain;
    background-color: #000000;
}

.item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    opacity: 0.7;
}

#imageList-container>* {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background-color: #FF9999;
}

#setting * {
    background-color: #00000000;
}

#search>* {
    box-sizing: border-box;
    padding: 1%;
    margin: 0 0.5rem;
    opacity: 0.4;
    font-size: 0.8rem;
}

#setting>*>*:hover {
    opacity: 0.9;
}

#imageList * {
    font-size: 0.9rem;
}

#item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

#item>* {
    display: inline-block;
    flex: 1;
    box-sizing: border-box;
    padding: 0.2% 1%;
    font-size: 1rem;
    font-weight: bold;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.item:hover {
    opacity: 1.0;
}

.item>* {
    display: inline-block;
    flex: 1;
    box-sizing: border-box;
    padding: 0.2% 1%;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

@media only screen and (orientation: portrait) {
    #setting {
        justify-content: flex-start;
    }

    #setting>* {
        margin: 0 3%;
    }

    .label,
    #item>.label {
        flex: 0;
        padding: 0%;
    }
}
</style>
