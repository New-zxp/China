export function initializeColorbar(map, colorbarId, intervals, labels, unit, lon, lat, colorbarWidth, colorbarHeight) {
    const colorbar = document.getElementById(colorbarId);
    if (!colorbar) {
      console.error('Colorbar element not found.');
      return;
    }

    const center = map.project([lon, lat]);
    colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
    colorbar.style.top = `${center.y - colorbarHeight / 2}px`;
  
    map.on('move', () => {
      const center = map.project([lon, lat]);
      colorbar.style.left = `${center.x - colorbarWidth / 2}px`;
      colorbar.style.top = `${center.y - colorbarHeight / 2}px`;
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
  