import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
    const asideOpen = ref(false);
    const overlayOpen = ref(false);

    // 切换侧边栏
    const switchSidebar = () => {
        asideOpen.value = !asideOpen.value;
        overlayOpen.value = !overlayOpen.value;
        document.body.classList.toggle('no-scroll');
    };

    return { asideOpen, overlayOpen, switchSidebar };
});