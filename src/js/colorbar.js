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
  const titlePosition = map.project([lon - 30, lat + 15]);
  titleElement.style.position = 'absolute';
  titleElement.style.left = `${titlePosition.x}px`;
  titleElement.style.top = `${titlePosition.y - 30}px`;

  const center = map.project([lon, lat]);
  colorbar.style.position = 'absolute';
  colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
  colorbar.style.top = `${center.y - colorbarHeight / 2}px`;

  map.on('move', () => {
    const center = map.project([lon, lat]);
    colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
    colorbar.style.top = `${center.y - colorbarHeight / 2}px`;
    const titlePosition = map.project([lon - 30, lat + 15]);
    titleElement.style.left = `${titlePosition.x}px`;
    titleElement.style.top = `${titlePosition.y - 30}px`; // 调整标题位置，使其位于指定坐标上方
  });

  labels.forEach((label, index) => {
    const item = document.createElement('div');
    item.innerText = label;
    item.classList.add('colorbar-label');
    item.classList.add(label === intervals[0].toString() ? 'colorbar-label-low' : 'colorbar-label-high');
    colorbar.appendChild(item);
  });

  const unitElement = document.createElement('div');
  unitElement.innerText = unit;
  unitElement.classList.add('unit');
  colorbar.appendChild(unitElement);
}
