import { onUnmounted, ref } from 'vue';
import { usePictureConfig } from './usePictureConfig.js';

const { fetchPictures, pictureData, loadConfig } = usePictureConfig();
await fetchPictures();

export function useContentLoader() {
  // 响应式的当前索引和每次加载的数量
  const currentIndex = ref(0);
  const perLoadNum = ref(loadConfig.perLoad);

  // 修改当前索引
  const setCurrentIndex = (index) => {
    currentIndex.value = index;
  };

  // 修改每次加载的内容数量
  const setPerLoadNum = (n) => {
    perLoadNum.value = n;
  };

  // 加载更多内容
  const loadMoreStuff = (container, createPathElement, shouldLoadItem) => {
    const dataList = pictureData.list;

    if (!dataList || dataList.length === 0) {
      console.warn('dataList is empty or null');
      return;
    }
    // 加载接下来的 perLoadNum 项内容
    for (let i = 0; i < perLoadNum.value && currentIndex.value < dataList.length; currentIndex.value++) {
      const path = dataList[currentIndex.value];
      // 跳过 dataList 数组中不合条件的元素
      if (!shouldLoadItem(path)) {
        continue;
      }
      console.log('loading');
      // 创建新内容元素并添加到指定容器中
      const imgElement = createPathElement(path);
      container.value.push(imgElement);
      // 更新当前索引
      i++;
    }
  };

  // 添加懒加载监听器
  const addLazyLoadListener = (container, createPathElement, shouldLoadItem) => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      const rect = footer.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

      // 如果页脚可见，则加载更多内容
      if (isVisible) {
        loadMoreStuff(container, createPathElement, shouldLoadItem);
      }
    };

    // 当页面滚动时尝试加载更多内容
    window.addEventListener('scroll', handleScroll);

    // 在组件卸载时，移除滚动监听器
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  };

  return {
    setCurrentIndex,
    setPerLoadNum,
    loadMoreStuff,
    addLazyLoadListener
  };
}
