<script setup>
import { onBeforeUnmount } from 'vue';
import Sidebar from '@/components/sidebar.vue';
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import upToTopButton from '@/components/upToTopButton.vue';
import addGlobalListeners from '@/composables/useGlobalEventListener';
const removeGlobalListeners = addGlobalListeners();
// 在组件销毁时移除全局监听器
onBeforeUnmount(() => {
  removeGlobalListeners();
});
</script>

<template>
  <el-container>
    <Sidebar></Sidebar>
    <el-container direction="vertical">
      <Header></Header>
      <router-view id="main"></router-view>
      <Footer></Footer>
    </el-container>
  </el-container>
  <upToTopButton></upToTopButton>
</template>

<style scoped>
/* 主体 */
#main {
  padding: 1% 5vw;
  min-height: 90vh;
}
</style>