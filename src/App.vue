<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import { createChart } from './js/chartCreator.js';
import { initializeButton, initializeCloseButton,createButton} from './js/button.js';
import { initializeColorbar } from './js/colorbar.js';

export default {
  name: 'App',
  mounted() {
    // Mapbox的识别码
    mapboxgl.accessToken = 'pk.eyJ1IjoienhwMDYxMSIsImEiOiJjbGI2bzJ0b3kwMnh5M3FvZHppcjBnb3FoIn0.-bw5-bWnBcVLIg-wbB7oQA';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-v9', // Mapbox 样式 URL
      center: [104, 35], // 中心坐标
      zoom: 3.1, // 初始缩放级别
      minZoom: 2.8,
      maxZoom: 4.8,
      doubleClickZoom: false,
      dragRotate: false, // 禁止地图旋转
    });

    map.on('load', function () {
      // 加载中国边界数据
      fetch('./src/data/China.json')
        .then(response => response.json())
        .then(data => {
          data.features.forEach((feature) => {
            const provinceName = feature.properties.name;
            const layerId = `province-${feature.properties.adcode}`;

            // 添加GeoJSON数据源
            map.addSource(layerId, {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [feature]
              }
            });

            // 添加填充图层
            map.addLayer({
              id: layerId,
              type: 'fill',
              source: layerId,
              layout: {},
              paint: {
                'fill-color': '#088', // 填充颜色
                'fill-opacity': 0 // 填充透明度
              }
            });

            // 添加边界图层
            map.addLayer({
              id: `${layerId}-outline`,
              type: 'line',
              source: layerId,
              layout: {},
              paint: {
                'line-color': '#000', // 边界颜色
                'line-width': 2 // 边界宽度
              }
            });

            //点击省份时，出现对应图表
            map.on('click', layerId, (e) => {
              const provinceName = e.features[0].properties.name;

              const colorbar = document.getElementById('colorbar');
              colorbar.style.display = 'none';

              Promise.all([
                fetch('./src/data/land_water.json').then(response => response.json()),
                fetch('./src/data/fitted_land_water.json').then(response => response.json())
              ]).then(([originalData, finalData]) => {
                  const provinceData1 = originalData.features.find(feature => feature.properties.name === provinceName);
                  const provinceData2 = finalData.features.find(feature => feature.properties.name === provinceName);

                  const timeSeriesData = provinceData1.properties.time_series;
                  const fittedData = provinceData2.properties.time_series;
                  const slope = provinceData2.properties.slope;

                  //创建表格
                  const containerId = 'chart-container';
                  const chartContainer = document.getElementById(containerId);
                  chartContainer.style.display = 'block';
                  const chart = createChart(containerId,provinceName, timeSeriesData,fittedData,slope);

                  //添加关闭按钮
                  initializeCloseButton(map,chart,'rate');
                })
                .catch(error => console.error('Error loading the time series data:', error));
            });

            // 当鼠标悬停在省份上时，改变鼠标指针样式
            map.on('mouseenter', layerId, () => {
              map.getCanvas().style.cursor = 'pointer';
            });

            // 当鼠标离开省份时，恢复鼠标指针样式
            map.on('mouseleave', layerId, () => {
              map.getCanvas().style.cursor = '';
            });
          });
        })
        .catch(error => console.error('Error loading the GeoJSON data:', error));

      // 添加格网点经度纬度速度数据
      map.addSource('rate', {
        type: 'geojson',
        data: './src/data/rate.json'
      });

      //添加colorbar
      const colors = ['#FF01FF', '#01FFFF'];
      const intervals = [-5, 3];
      const labels = ['-5', '3']; 
      const unit = 'cm/yr'; 
      const lon = 68;
      const lat = 38;
      const colorbarWidth = 25;
      const colorbarHeight = 400;
      const colorbarId = 'colorbar';

      initializeColorbar(map, colorbarId,intervals, labels, unit, lon, lat, colorbarWidth, colorbarHeight);

      // 添加速度图层
      map.addLayer({
        id: 'rate',
        type: 'circle',
        source: 'rate',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', '速度'],
            intervals[0], colors[0],
            intervals[1], colors[1],
          ]
        },
        layout: {
          visibility: 'none' // 不可见
        }
      });
      
      createButton(map, "land-water", "陆地水储量",400);
      createButton(map, "soil-moisture", "土壤湿度",300);
      createButton(map, "groundwater", "地下水",200);
      createButton(map, "surface-water", "地表水",100);
      createButton(map, "ice-snow", "冰雪储量",0);

      initializeButton(map, "land-water", 'rate', 'colorbar');

      // 禁止colorbar大小随地图缩放而改变
      map.on('zoom', () => {
        const zoomLevel = map.getZoom();
        // 更新colorbar的大小，但不改变其位置
        const colorbar = document.getElementById(colorbarId);
        colorbar.style.width = `${colorbarWidth * (zoomLevel / 3.3)}px`;
        colorbar.style.height = `${colorbarHeight * (zoomLevel / 3.3)}px`;
      });
    });
  }
}
</script>