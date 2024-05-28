// 初始化地图切换按钮
export function initializeButton(map, buttonId, layerId, colorbarId) {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.error('button element not found.');
    return;
  }

  let isColorbarVisible = true;

  button.addEventListener('click', function() {
    const colorbar = document.getElementById(colorbarId);
    const title = document.getElementById('title');
    if(isColorbarVisible){
      map.setLayoutProperty(layerId, 'visibility', 'none');
      colorbar.style.display = 'none';
      title.style.display = 'none';
      isColorbarVisible = false;
    }else if(!isColorbarVisible){
      map.setLayoutProperty(layerId, 'visibility', 'visible');
      colorbar.style.display = 'block';
      title.style.display = 'block';
      isColorbarVisible = true;
    }
  });
}


// 初始化关闭按钮
export function initializeCloseButton(map,chart,layerId) {
  const chartContainer = document.getElementById('chart-container');

  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.id = 'close-button';
  closeButton.classList.add("chart-button");
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
export function createButton(map,buttonId,buttonName,left) {
  // 创建按钮元素
  const button = document.createElement("button");
  button.id = buttonId;
  button.textContent = buttonName;
  button.classList.add("menu-button");
  button.style.left = left + 'px';
  map.getContainer().appendChild(button);
}

// 创建下载按钮
export function downloadButton(buttonId, buttonName, timeSeriesData, provinceName) {
  // 创建按钮元素
  const downloadButton = document.createElement("button");
  downloadButton.id = buttonId;
  downloadButton.textContent = buttonName;
  downloadButton.classList.add("chart-button");

  // 获取容器元素并添加按钮
  const chartContainer = document.getElementById('chart-container');
  chartContainer.appendChild(downloadButton);

  // 添加点击事件监听器
  downloadButton.addEventListener('click', function() {
    // 将数据转换为 CSV 格式
    const csvContent = timeSeriesData.map(entry => {
      const time = parseFloat(entry.time.toFixed(6)); // 保留六位小数
      const value = parseFloat(entry.value.toFixed(5)); // 保留五位小数
      return `${time},${value}`;
    }).join('\n');

    // 在 CSV 内容的第一行添加省份名称
    const csvHeader = `${provinceName}\n`;
    const finalCsvContent = csvHeader + csvContent;

    // 创建一个 Blob 对象
    const blob = new Blob([finalCsvContent], { type: 'text/csv;charset=utf-8;' });

    // 创建下载链接
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${provinceName}_land_water.csv`); // 修改文件名
    link.style.visibility = 'hidden';

    // 添加链接到页面并触发点击事件
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  });
}
