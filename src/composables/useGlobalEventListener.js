export default function addGlobalListeners() {
  // 禁止拖动
  const handleDragStart = (event) => {
    event.preventDefault();
  };

  // 禁止右键菜单
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  // 禁止选中文字
  // const handleSelectStart = (event) => {
  //     event.preventDefault();
  // };

  window.addEventListener('dragstart', handleDragStart);
  window.addEventListener('contextmenu', handleContextMenu);
  // window.addEventListener('selectstart', handleSelectStart);

  // 返回移除事件的函数
  return () => {
    window.removeEventListener('dragstart', handleDragStart);
    window.removeEventListener('contextmenu', handleContextMenu);
    // window.removeEventListener('selectstart', handleSelectStart);
  };
}
