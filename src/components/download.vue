<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CryptoJS from 'crypto-js';
import { usePictureConfig } from '@/composables/usePictureConfig';

const correctPassword = CryptoJS.MD5(usePictureConfig().downloadPassword).toString(); // 加密后密码的 MD5 值
const userPassword = ref('');
const props = defineProps({
  currentImageData: {}, // 接收图片数据
});

// 处理下载图片
const initiateDownload = (currentImageData) => {
  userPassword.value = CryptoJS.MD5(prompt('请输入下载密码:')).toString(); // 提示用户输入密码
  if (userPassword.value === correctPassword) { // 检查密码是否正确
    downloadImage(currentImageData); // 根据图片链接数量决定下载方式
  } else {
    alert('密码错误，无法下载。'); // 密码错误提示
  }
};

// 下载图片
const downloadImage = (image) => {
  if (image.href.length === 1) {
    downloadSingleImage(image); // 下载单张图片
  } else {
    downloadPicturesAsZip(image); // 下载图片压缩包
  }
}

// 下载单张图片
const downloadSingleImage = (image) => {
  const anchor = document.createElement('a'); // 创建下载链接
  anchor.href = image.href[0]; // 设置链接地址
  anchor.download = image.name; // 设置下载文件名
  anchor.click(); // 触发下载
}

// 下载图片压缩包
const downloadPicturesAsZip = async (picture) => {
  const zip = new JSZip(); // 创建一个新的 JSZip 实例
  try {
    await Promise.all(picture.href.map((url, i) => fetchImageToZip(url, picture.name, i, zip))); // 异步获取所有图片
    const zipContent = await zip.generateAsync({ type: 'blob' }); // 生成压缩文件
    saveAs(zipContent, `${picture.name}.zip`); // 下载压缩文件
  } catch (error) {
    console.error('压缩文件创建失败：', error); // 错误处理
  }
}

// 获取图片并添加到压缩包
const fetchImageToZip = async (url, pictureName, index, zip) => {
  const response = await fetch(url); // 获取图片数据
  const blob = await response.blob(); // 转换为 Blob 对象
  const extension = url.split('.').pop().split('?')[0]; // 获取文件扩展名
  zip.file(`${pictureName}_${index + 1}.${extension}`, blob); // 添加文件到压缩包
}
</script>

<template>
  <!-- 下载按钮 -->
  <div id="download" title="下载" @click="initiateDownload(currentImageData)"></div>
</template>

<style scoped>
/* 下载按钮 */
#download {
  /* 为了兼容 */
  -webkit-mask: url('/public/other/download.svg') no-repeat center / contain;
  /* 图片蒙版 */
  mask: url('/public/other/download.svg') no-repeat center / contain;
  background-color: #000000;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* 鼠标悬停时的效果 */
#download:hover {
  background-color: #A63232;
  transform: scale(1.1);
  /* 放大一点以示点击区域 */
}
</style>