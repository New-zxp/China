import * as echarts from 'echarts';

export function createChart(containerId, provinceName, timeSeriesData, fittedData, slope) {
  const chartContainer = document.getElementById(containerId);

  if (!chartContainer) {
    console.error('未找到容器元素。');
    return;
  }

  const chart = echarts.init(chartContainer);

  const time = timeSeriesData.map(entry => entry.time);
  const values = timeSeriesData.map(entry => entry.value);

  // 构造拟合直线数据
  const fittedTime = fittedData.map(entry => entry.time);
  const fittedValues = fittedData.map(entry => entry.value);

  const minValue = Math.floor(Math.min(...values));
  const maxValue = Math.ceil(Math.max(...values));

  const min = minValue - (minValue % 5) - 5;
  const max = maxValue - (maxValue % 5) + 5;

  const option = {
    title: {
      text: `${provinceName}`,
      left: 'center',
      top: '10px',
    },
    xAxis: {
      type: 'value',
      min: 2000,
      max: 2025,
      axisLabel: {
        formatter: function (value, index) {
          return value;
        },
        fontSize: 15,
        color: '#333',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      }
    },
    yAxis: {
      type: 'value',
      name: '陆地水储量(cm/yr)',
      nameLocation: "middle",
      nameTextStyle: {
        fontFamily: 'Microsoft YaHei',
        fontSize: 15,
        fontWeight: 'bold',
      },
      nameGap: 35,
      min: min,
      max: max,
      axisLabel: {
        fontSize: 15,
        color: '#333'
      },
      interval: (max - min) / 5,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      }
    },
    series: [
      {
        data: values.map((value, index) => [time[index], value]),
        type: "scatter",
        color: 'blue',
        symbolSize: 6, // 设置点的大小
      },
      {
        data: fittedValues.map((value, index) => [fittedTime[index], value]),
        type: "line",
        lineStyle: {
          color: 'rgba(255, 0, 0, 0.8)',
          width: 2,
        },
        showSymbol: false,
        animation: false,
        endLabel: {
          show: true,
          formatter: '陆地水储量变化速度：' + slope.toFixed(2) + ' cm/yr',
          color: 'black',
          fontSize: 13,
          fontWeight: 'bold'
        },
        labelLayout(params) {
          const rect = params.rect;
          return {
            x: rect.x + rect.width / 2, // 将标签水平居中放置在直线上方
            y: rect.y - 40, // 将标签垂直位置上移一定距离
            verticalAlign: 'bottom', // 垂直对齐方式为底部
            align: 'center' // 水平对齐方式为居中
          }
        },
      }
    ],
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  };

  chart.setOption(option);

  // 添加事件监听器和动态样式绑定
  chartContainer.addEventListener('mousedown', startDrag);

  function startDrag(e) {
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialLeft = chartContainer.offsetLeft; // 获取初始左偏移
    const initialTop = chartContainer.offsetTop; // 获取初始顶部偏移

    function handleMove(e) {
      const offsetX = e.clientX - initialX;
      const offsetY = e.clientY - initialY;

      chartContainer.style.left = initialLeft + offsetX + 'px'; // 设置左偏移
      chartContainer.style.top = initialTop + offsetY + 'px'; // 设置顶部偏移
    }

    function handleUp() {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  return chart;
}
