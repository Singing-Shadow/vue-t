import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 处理下载图片
export const initiateDownload = (currentImageData) => {
  const correctPassword = '616'; // 设置下载密码
  const userPassword = prompt('请输入下载密码:'); // 提示用户输入密码
  if (userPassword === correctPassword) { // 检查密码是否正确
    downloadImage(currentImageData); // 根据图片链接数量决定下载方式
  } else {
    alert('密码错误，无法下载。'); // 密码错误提示
  }
};

// 下载图片
function downloadImage(image) {
  if (image.href.length === 1) {
    downloadSingleImage(image); // 下载单张图片
  } else {
    downloadPicturesAsZip(image); // 下载图片压缩包
  }
}

// 下载单张图片
function downloadSingleImage(image) {
  const anchor = document.createElement('a'); // 创建下载链接
  anchor.href = image.href[0]; // 设置链接地址
  anchor.download = image.name; // 设置下载文件名
  anchor.click(); // 触发下载
}

// 下载图片压缩包
async function downloadPicturesAsZip(picture) {
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
async function fetchImageToZip(url, pictureName, index, zip) {
  const response = await fetch(url); // 获取图片数据
  const blob = await response.blob(); // 转换为 Blob 对象
  const extension = url.split('.').pop().split('?')[0]; // 获取文件扩展名
  zip.file(`${pictureName}_${index + 1}.${extension}`, blob); // 添加文件到压缩包
}
