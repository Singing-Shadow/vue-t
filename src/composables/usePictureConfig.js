import { ref, reactive } from "vue";
// ------------constants------------

// 图片下载密码
const downloadPassword = "616";
// 服务器地址
const serverUrl = "http://localhost:3000";
// 侧边栏列表选项
const sidebarLinks = [
  [
    { href: "/home", text: "首页" },
    { href: "/gallery", text: "Pising" },
    { href: "/list", text: "插画列表" },
  ],
  [
    { href: "https://www.pixiv.net", text: "Pixiv" },
    { href: "https://arcwiki.mcd.blue", text: "Arcaea" },
  ],
  [
    { href: "https://dylanyu233.rbind.io", text: "友情链接1" },
    { href: "https://github.com/MrRightXingYue", text: "友情链接2" },
    { href: "/about", text: "我的" },
  ],
];
// ------------config------------

// JSON 文件配置
const pictureData = reactive({
  loading: false,
  // 存储读取到的图片数据
  list: [],
  // 图片数量
  total: 0,
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
  filteredCount: -1,
  // 加载状态
  loading: false,
});

// 搜索配置
const searchConfig = ref({
  // 搜索框输入值
  query: ``,
});
// ------------function------------

// API
const fetchPictures = async (apiUrl) => {
  try {
    // 设置加载状态
    loadConfig.loading = true;

    // 获取图片数据
    const res = await fetch(`${serverUrl}${apiUrl}`);

    // 检查 HTTP 响应状态
    if (!res.ok) {
      throw new Error(`HTTP 错误！状态码: ${res.status}`);
    }

    const data = await res.json();

    // 返回图片数据
    return {
      data: Array.isArray(data) ? data : [],
      total: data.length ? data.length : 0,
    };
  } catch (error) {
    console.error("获取图片数据失败:", error);
    pictureData.list = [];
    pictureData.total = 0;
  } finally {
    // 取消加载状态
    loadConfig.loading = false;
  }
};

// 导出给 Vue 组件使用的 `usePictureConfig` 组合式 API
export function usePictureConfig() {
  return {
    downloadPassword,
    sidebarLinks,
    pictureData,
    loadConfig,
    searchConfig,
    fetchPictures,
  };
}
