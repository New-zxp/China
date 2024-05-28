import * as echarts from 'echarts';

export function createChart(containerId, provinceName, timeSeriesData,fittedData,slope) {
  const chartContainer = document.getElementById(containerId);

  if (!chartContainer) {
    console.error('Container element not found.');
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

  const min = minValue - minValue % 5 - 5;
  const max = maxValue - maxValue % 5 + 5;

  const option = {
    title: {
      text: `${provinceName} - 陆地水变化时间序列`,
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
    series: [{
      data: values.map((value, index) => [time[index], value]),
      type: "scatter",
      color: 'red',
    },
    {
      data: fittedValues.map((value, index) => [fittedTime[index], value]), // 拟合数据
      type: "line",
      lineStyle: {
        color: 'rgba(255, 0, 0, 0.8)',
        width: 5,
      },
      showSymbol: false,
      animation: false,
      endLabel: {
        show: true,
        formatter: '陆地水变化趋势速度：' + slope.toFixed(2) + '(cm/yr)',
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

  return chart;
}
