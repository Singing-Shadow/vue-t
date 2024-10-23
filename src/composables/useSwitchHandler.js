function setupTouchHandlers(navigateToImage) {
  let startCoords = {}; // 用于存储触摸开始时的坐标和时间

  // 处理触摸开始事件，记录初始坐标和时间
  const onTouchStart = (evt) => {
    startCoords = getTouchStartCoords(evt); // 调用 getTouchStartCoords 函数，记录触摸开始的位置和时间
  };

  // 处理触摸移动事件，更新当前的触摸坐标
  const onTouchMove = (evt) => {
    const moveCoords = getTouchMoveCoords(evt); // 调用 getTouchMoveCoords 函数，获取触摸移动时的坐标
    startCoords.endX = moveCoords.endX; // 更新触摸结束的 X 坐标
    startCoords.endY = moveCoords.endY; // 更新触摸结束的 Y 坐标
  };

  // 处理触摸结束事件，计算滑动方向并切换图片
  const onTouchEnd = () => {
    processTouchEnd(startCoords, navigateToImage); // 调用 processTouchEnd 计算滑动方向，并触发图片切换
  };

  // 为触摸事件添加监听器，使用 { passive: true } 以提升性能
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
}

// 记录触摸开始的 X、Y 坐标及触摸开始的时间
function getTouchStartCoords(evt) {
  const firstTouch = evt.touches[0]; // 获取第一个触摸点的坐标
  return {
    startX: firstTouch.clientX, // 触摸开始时的 X 坐标
    startY: firstTouch.clientY, // 触摸开始时的 Y 坐标
    startTime: Date.now() // 触摸开始的时间，用于后续计算触摸持续时间
  };
}

// 记录触摸移动的 X、Y 坐标
function getTouchMoveCoords(evt) {
  const touch = evt.touches[0]; // 获取当前触摸点的坐标
  return {
    endX: touch.clientX, // 触摸移动时的 X 坐标
    endY: touch.clientY // 触摸移动时的 Y 坐标
  };
}

// 处理触摸结束事件，计算滑动方向，并根据滑动方向切换图片
function processTouchEnd(startCoords, navigateToImage) {
  const { endX, endY, startX, startY, startTime } = startCoords;
  if (!endX || !endY || !startX || !startY) {
    console.warn('Touch end position is missing'); // 如果缺少必要的触摸坐标数据，发出警告并中止操作
    return;
  }

  const elapsedTime = Date.now() - startTime; // 计算触摸持续时间
  if (elapsedTime <= 1000) { // 如果触摸持续时间在 1 秒以内
    const diffX = endX - startX; // 计算水平位移
    const diffY = endY - startY; // 计算垂直位移
    // 如果水平位移大于垂直位移的 1.5 倍，判定为左右滑动
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      navigateToImage(diffX > 0 ? -1 : 1); // 根据滑动方向（左或右）切换图片
    }
  }
}

// 处理键盘事件，支持使用左右箭头切换图片
function onKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    console.log('left'); // 当按下左箭头时，切换到上一张图片
    return -1;
  } else if (event.key === 'ArrowRight') {
    console.log('right'); // 当按下右箭头时，切换到下一张图片
    return 1;
  }
  else {
    return 0; // 对其他按键不做处理
  }
}

// 导出处理触摸和键盘事件的方法，以便在其他模块中使用
export { setupTouchHandlers, onKeyDown };
