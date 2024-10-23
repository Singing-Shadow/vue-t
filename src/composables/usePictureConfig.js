import { ref, reactive, onMounted } from 'vue';
import { getDownloadURL, listAll, ref as storageRef } from "firebase/storage";
import { getDocs, collection } from "firebase/firestore";
import { db, originalRef, thumbnailsRef } from '../Firebase'
// ------------constants------------

// 图片信息文件的相对路径
// const pictureFilePath = '/picture.json';

// 图片下载密码
const downloadPassword = '616';

// 侧边栏列表选项
const sidebarLinks = [
  [
    { href: '/home', text: '首页' },
    { href: '/gallery', text: 'Pising' },
    { href: '/list', text: '插画列表' },
    { href: '/MiyU', text: 'MiyU专栏' }
  ],
  [
    { href: 'https://www.pixiv.net', text: 'Pixiv' },
    { href: 'https://arcwiki.mcd.blue', text: 'Arcaea' }
  ],
  [
    { href: 'https://dylanyu233.rbind.io', text: '友情链接1' },
    { href: 'https://github.com/MrRightXingYue', text: '友情链接2' },
    { href: '/about', text: '我的' }
  ]
];
// ------------config------------

// JSON 文件配置
const pictureData = reactive({
  // 存储读取到的图片数据
  list: [],
  // 图片数量
  total: 60
});

// 内容加载配置
const loadConfig = reactive({
  // 每次需加载的内容数量
  perLoad: 8,
  // 当前加载到的内容索引
  currentIndex: 0,
  // 内容选择判断条件
  filterKeyword: `MiyU`,
  // 符合条件内容数目
  filteredCount: 0
});

// 搜索配置
const searchConfig = ref({
  // 搜索框输入值
  query: ``
});

// 加载状态
const isLoading = ref(false);
// ------------function------------
// 获取图片信息文件的异步函数
async function fetchPictures() {
  if (isLoading.value) {
    return; // 如果已经在加载中，则直接返回
  }
  isLoading.value = true; // 标记开始加载
  try {
    // 并行获取 Firestore 数据和所有图片引用
    const [querySnapshot, allImageRefs] = await Promise.all([
      getDocs(collection(db, 'pictureData')),
      listAll(originalRef)
    ]);
    // 正则表达式用于匹配 `${id}` 或 `${id}-${x}` 格式的文件名
    const idRegex = (id) => new RegExp(`^${id}(-\\d+)?\\.(jpg|png)$`, 'i');

    // 处理 Firestore 数据和 Storage 图片引用
    const images = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data(); // 获取文档数据
        const id = data.id; // 获取 id 属性

        // 过滤出匹配当前 id 的文件引用
        const filteredImageRefs = allImageRefs.items.filter(itemRef => idRegex(id).test(itemRef.name));
        // 异步获取原图和缩略图的下载链接
        const originalImageRefs = filteredImageRefs.map(itemRef => storageRef(originalRef, itemRef.name));
        const thumbnailImageRefs = filteredImageRefs.map(itemRef => storageRef(thumbnailsRef, itemRef.name));

        // 异步获取下载链接
        const [originalUrls, thumbnailUrls] = await Promise.all([
          Promise.all(originalImageRefs.map(getDownloadURL)),
          Promise.all(thumbnailImageRefs.map(getDownloadURL))
        ]);

        return {
          id: id,
          name: data.name,
          category: data.category,
          author: data.author,
          label: data.label,
          href: originalUrls, // 添加原图链接
          thumbnailsHref: thumbnailUrls  // 添加缩略图链接
        };
      })
    );

    // 将获取到的图片数据保存到 pictureData.list
    pictureData.list = images;
    console.log('Firebase Storage images loaded successfully');
  } catch (error) {
    console.error('Error fetching images from Firebase: ', error);
    pictureData.list = [];
  } finally {
    isLoading.value = false; // 重置 `isLoading`
  }
}

// 导出给 Vue 组件使用的 `usePictureConfig` 组合式 API
export function usePictureConfig() {
  // 在组件挂载时执行 JSON 加载操作
  // onMounted(() => {
  //     fetchPictures(); // 组件挂载时加载数据
  // });
  onMounted(async () => {
    await fetchPictures(); // 确保图片加载完成后再继续其他操作
  });

  return {
    downloadPassword,
    sidebarLinks,
    pictureData,
    loadConfig,
    searchConfig
  };
}
