import { ref, reactive } from "vue";
// ------------constants------------

// 图片下载密码
const downloadPassword = "616";
// 服务器地址
const serverUrl = ["https://frp-act.com:59183", "http://localhost:3000"];
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
    loadConfig.loading = true; // 启用加载状态

    let data = [];
    let success = false;

    // 依次尝试不同的服务器地址
    for (const url of serverUrl) {
      try {
        const res = await fetch(`${url}${apiUrl}`);
        if (res.ok) {
          console.log(`从服务器 ${url} 获取数据成功`);
          data = await res.json();
          success = true;
          break; // 请求成功，跳出循环
        } else {
          console.warn(`服务器 ${url} 返回错误状态: ${res.status}`);
        }
      } catch (error) {
        console.warn(`无法从服务器 ${url} 获取数据:`, error.message);
      }
    }

    if (!success) {
      throw new Error("所有服务器均无法获取数据");
    }

    return {
      data: Array.isArray(data) ? data : [],
      total: Array.isArray(data) ? data.length : 0,
    };
  } catch (error) {
    console.error("获取图片数据失败:", error);
    return { data: [], total: 0 };
  } finally {
    loadConfig.loading = false; // 关闭加载状态
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
