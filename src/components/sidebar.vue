<script setup>
// 侧边栏列表选项
import { ref } from 'vue';
import { useSidebarStore } from '@/stores/sidebarSwitchStore';
import { usePictureConfig } from '@/composables/usePictureConfig';

const sidebarStore = useSidebarStore();
const { sidebarLinks } = usePictureConfig();
const asideRef = ref(null);
const buttonRef = ref(null);

</script>

<template>
    <!-- 遮罩层 -->
    <section :class="{ 'overlay': true, 'overlay-open': sidebarStore.overlayOpen }" @click="sidebarStore.switchSidebar">
    </section>
    <!-- 侧边栏 -->
    <el-aside :class="{ 'aside-open': sidebarStore.asideOpen }" ref="asideRef">
        <div class="aside-title">
            <el-button class="aside-button" ref="buttonRef" title="菜单" @click="sidebarStore.switchSidebar"></el-button>
            <div>
                <a href="/home" class="logo-icon" title="首页"></a>
            </div>
        </div>
        <!-- 侧边栏选项 -->
        <div v-for="(group, index) in sidebarLinks" :key="index" class="aside-list-container">
            <a v-for="(item, itemIndex) in group" :key="itemIndex" :href="item.href" class="aside-item">
                {{ item.text }}
            </a>
        </div>
    </el-aside>
</template>

<style scoped>
/* 导航栏按钮 */
.el-aside .aside-button {
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

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease;
    background-color: #00000080;
    z-index: 9;
}

.overlay-open {
    display: block;
}

/* 导航栏 */
.el-aside {
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
    transition: left 0.5s ease;
    background-color: #FF9999;
    z-index: 10;
}

.el-aside>* * {
    height: 2rem;
    margin: 0 0.5rem;
}

.aside-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.5rem;
}

.aside-list-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    margin: 10% 0;
}

.aside-list-container>* {
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

.aside-list-container>*:hover {
    color: #FFC7C7;
    background-color: #A63232;
}

.aside-open {
    left: 0;
}

body.no-scroll {
    overflow: hidden;
}
</style>