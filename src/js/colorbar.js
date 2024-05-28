export function initializeColorbar(map, colorbarId, colors, intervals, labels, unit, lon, lat, colorbarWidth, colorbarHeight, title) {
  const colorbar = document.getElementById(colorbarId);
  if (!colorbar) {
    console.error('Colorbar element not found.');
    return;
  }

  // 使用传入的三种颜色设置渐变
  colorbar.style.background = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]}, ${colors[2]})`;

  // 添加标题元素
  const titleElement = document.createElement('div');
  titleElement.id = "title"; // 设置id属性
  titleElement.innerText = title;
  // 将标题元素添加到文档中
  document.body.appendChild(titleElement);
  const titlePosition = map.project([lon - 28, lat + 14]);
  titleElement.style.position = 'absolute';
  titleElement.style.left = `${titlePosition.x - 30}px`;
  titleElement.style.top = `${titlePosition.y - 80}px`;

  const center = map.project([lon, lat]);
  colorbar.style.position = 'absolute';
  colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
  colorbar.style.top = `${center.y - colorbarHeight / 2}px`;

  map.on('move', () => {
    const center = map.project([lon, lat]);
    colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
    colorbar.style.top = `${center.y - colorbarHeight / 2}px`;
    const titlePosition = map.project([lon - 28, lat + 14]);
    titleElement.style.left = `${titlePosition.x - 30}px`;
    titleElement.style.top = `${titlePosition.y - 80}px`; // 调整标题位置，使其位于指定坐标上方
  });

// 添加 colorbar 标签
labels.forEach((label, index) => {
  const item = document.createElement('div');
  item.innerText = label;
  item.classList.add('colorbar-label');
  item.style.position = 'absolute';
  item.style.left = '-55%';
  item.style.transform = 'translateX(-50%)';
  item.style.bottom = `${(index / (labels.length - 1)) * 183}px`; // 动态设置标签位置，确保不超出高度
  item.style.fontWeight = 'bold';
  colorbar.appendChild(item);
});

  const unitElement = document.createElement('div');
  unitElement.innerText = unit;
  unitElement.classList.add('unit');
  colorbar.appendChild(unitElement);
  
    // 禁止colorbar大小随地图缩放而改变
    map.on('zoom', () => {
      const zoomLevel = map.getZoom();
      // 更新colorbar的大小，但不改变其位置
      const colorbar = document.getElementById(colorbarId);
      colorbar.style.width = `${colorbarWidth * (zoomLevel / 3.5)}px`;
      colorbar.style.height = `${colorbarHeight * (zoomLevel / 3.5)}px`;

      const labels = document.querySelectorAll('.colorbar-label');
      labels.forEach((label, index) => {
        label.style.bottom = `${(index / (labels.length - 1)) * 183 * (zoomLevel / 3.5)}px`;
      });
      const title = document.getElementById('title');
      title.style.backgroundColor = 'rgba(222, 222, 222, 0)';
    });
}
