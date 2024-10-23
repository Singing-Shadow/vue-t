<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebarSwitchStore';

const sidebarStore = useSidebarStore(); // 获取 Pinia Store 实例
const router = useRouter(); // 获取 Vue Router 实例
const placeholder = ref('搜索作品'); // 搜索框的初始 placeholder
const searchQuery = ref(``); // 搜索框输入的绑定值

// 处理搜索跳转
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        // 使用 router 进行路由跳转
        router.push({ path: '/search', query: { name: encodeURIComponent(searchQuery.value) } });
    }
};
// 处理聚焦事件
const handleFocus = () => {
    placeholder.value = '仅支持搜索作者';
};
// 处理失去焦点事件
const handleBlur = () => {
    placeholder.value = '搜索作品'; // 恢复为原来的 placeholder
};
</script>
<template>
    <el-header id="header">
        <!-- 侧边栏按钮 -->
        <button class="aside-button" type="button" title="菜单" @click="sidebarStore.switchSidebar"></button>
        <!-- Logo -->
        <div>
            <a href="/home" class="logo-icon" title="首页"></a>
        </div>
        <!-- 搜索栏 -->
        <div class="search-container">
            <div class="search-icon"></div>
            <input id="header-search" class="search-text" type="text" v-model="searchQuery"
                @keydown.enter="handleSearch" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur">
        </div>
        <!-- 其它 -->
        <div class="null">加入Pising高级会员</div>
        <div class="null">投稿作品↓</div>
        <div class="null">信息</div>
        <div class="null">通知</div>
        <!-- 用户图标 -->
        <div>
            <a href="/login" target="_blank" class="user-icon" title="用户页面"></a>
        </div>
    </el-header>
</template>

<style scoped>
/* 页眉 */
#header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: auto;
    padding: 0.5rem;
    background-color: #FF9999;
    z-index: 6;
    cursor: default;
}

#header * {
    height: 2rem;
    margin: 0 0.5rem;
}

/* 导航栏按钮 */
.aside-button {
    display: block;
    height: 2rem;
    aspect-ratio: 1 / 1;

    -webkit-mask: url('../../public/other/list.svg') no-repeat center / contain;
    mask: url('../../public/other/list.svg') no-repeat center / contain;
    background-color: #FFC7C7;
    cursor: pointer;
}

/* Logo */
.logo-icon {
    display: block;
    width: 2rem;
    height: 2rem;

    background-image: url("../../public/other/iKou.png");
    cursor: pointer;
}

.logo-icon:hover {
    border-radius: 1rem;
    background-color: #00000011;
}

/* 搜索栏 */
.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    border-radius: 3px;

    overflow: hidden;
    background-color: #FFC7C7;
    cursor: pointer;
}

#header .search-container>.search-icon {
    display: block;
    height: 1rem;
    aspect-ratio: 1 / 1;
    margin: 0.5rem;

    -webkit-mask: url('../../public/other/search.svg') no-repeat center / contain;
    mask: url('../../public/other/search.svg') no-repeat center / contain;
    background-color: #FF9999;
}

#header .search-container>.search-text {
    flex: 1;
    width: 20rem;
    margin: 0;
    text-align: left;
    font-size: 0.8rem;
    outline: none;
    background-color: #FFC7C7;
}

/* 随便搞的 */
#header .null {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0 1rem;
    border: 1px solid #00000011;
    border-radius: 3px;

    background-color: #FFC7C7;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

/* 用户栏按钮 */
.user-icon {
    display: block;
    aspect-ratio: 1 / 1;

    -webkit-mask: url('../../public/other/user.svg') no-repeat center / contain;
    mask: url('../../public/other/user.svg') no-repeat center / contain;
    background-color: #FFC7C7;
    cursor: pointer;
}

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    z-index: 9;
}

.overlay-open {
    display: block;
}

/* 导航栏 */
.aside-list {
    position: fixed;
    top: 0;
    left: -16rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-sizing: border-box;
    width: 16rem;
    height: 100vh;
    padding: 0.5rem 0;

    overflow-y: auto;
    transition: left 0.3s ease;
    background-color: #FF9999;
    z-index: 10;
}

.aside-list>* * {
    height: 2rem;
    margin: 0 0.5rem;
}

.aside-list-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.5rem;
}

.aside-list-item-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
}

*+.aside-list-item-container {
    margin: 10% 0;
}

.aside-list-item-container>* {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    padding: 0 1rem;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.aside-list-item-container>*:hover {
    color: #FFC7C7;
    background-color: #A63232;
}

.aside-open {
    left: 0;
}

body.no-scroll {
    overflow: hidden;
}

/* 针对竖屏设备 */
@media only screen and (orientation: portrait) {
    #header * {
        margin: 0 0.2rem;
    }

    #header .null {
        display: none;
    }

    .aside-list-title * {
        margin: 0 0.2rem;
    }
}
</style>