// 初始化地图切换按钮
export function initializeButton(map, buttonId, layerId, colorbarId) {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.error('button element not found.');
    return;
  }

  button.addEventListener('click', function() {
    const colorbar = document.getElementById(colorbarId);
    const layer = map.getLayer(layerId);
    if (layer) {
      if (layer.getLayoutProperty('visibility') === 'visible') {
        map.setLayoutProperty(layerId, 'visibility', 'none');
        if (colorbar) {
          colorbar.style.display = 'none';
        }
      } else {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        if (colorbar) {
          colorbar.style.display = 'block';
        }
      }
    }
    const chartContainer = document.getElementById('chart-container');
    if(chartContainer.style.display === 'block'){
      colorbar.style.display = 'none';
    }
  });
}

// 初始化关闭按钮
export function initializeCloseButton(map,chart,layerId) {
  const chartContainer = document.getElementById('chart-container');

  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.id = 'close-button';
  chartContainer.appendChild(closeButton);

  const layer = map.getLayer(layerId);

  // 添加点击事件监听器
  closeButton.addEventListener('click', function() {
    chartContainer.style.display = 'none';
    chart.dispose();
    if(layer){
      if (layer.getLayoutProperty('visibility') === 'visible') {
        const colorbar = document.getElementById('colorbar');
        colorbar.style.display = 'block';
      } 
    }
  });
}

// 创建按钮
export function createButton(map,buttonId,buttonName,right) {
  // 创建按钮元素
  const button = document.createElement("button");
  button.id = buttonId;
  button.textContent = buttonName;
  button.classList.add("menu-button");
  button.style.right = right + 'px';
  map.getContainer().appendChild(button);
}

