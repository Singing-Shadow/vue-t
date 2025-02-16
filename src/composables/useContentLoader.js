import { onUnmounted, ref } from "vue";
import { usePictureConfig } from "./usePictureConfig.js";

const { fetchPictures, loadConfig } = usePictureConfig();

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
  const loadMoreStuff = async (
    container,
    createPathElement,
    searchContest,
    addimgElement = false
  ) => {
    if (searchContest.value != loadConfig.filterKeyword) {
      loadConfig.filteredCount = -1;
      loadConfig.filterKeyword = searchContest.value;
    }
    if (loadConfig.loading || loadConfig.filteredCount === 0) {
      return;
    }
    const pictureData = await fetchPictures(
      `/api/search?q=${searchContest.value}&start=${currentIndex.value}&size=${perLoadNum.value}`
    );
    loadConfig.filteredCount = pictureData.total;
    if (pictureData.total === 0) {
      console.warn("dataList is empty or null");
      return;
    }
    currentIndex.value += perLoadNum.value;

    // 加载接下来的 perLoadNum 项内容
    for (const path of pictureData.data) {
      console.log("loading..");
      const imgElement = createPathElement(path);

      // 如果需要添加图片资源，则加载图片资源
      if (addimgElement) {
        const ElementData = await fetchPictures(
          `/api/images/${path.id}?type=thumbnail`
        );
        let pictureElement = "";
        if (ElementData.total > 0) {
          const img = ElementData.data[0];
          pictureElement = `data:${img.mimeType};base64,${img.data}`;
        }
        imgElement.src = pictureElement;
      }
      container.value.push(imgElement);
    }
  };

  // 添加懒加载监听器
  const addLazyLoadListener = (
    container,
    createPathElement,
    searchContest,
    addimgElement = false
  ) => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const rect = footer.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

      // 如果页脚可见，则加载更多内容
      if (isVisible) {
        loadMoreStuff(
          container,
          createPathElement,
          searchContest,
          addimgElement
        );
      }
    };

    // 当页面滚动时尝试加载更多内容
    window.addEventListener("scroll", handleScroll);

    // 在组件卸载时，移除滚动监听器
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
  };

  return {
    setCurrentIndex,
    setPerLoadNum,
    loadMoreStuff,
    addLazyLoadListener,
  };
}
