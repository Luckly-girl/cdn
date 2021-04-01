<template>
  <div id="expense-list" style="width: 770px; height: 275px; margin: 0 auto;"></div>
</template>

<script>
export default {
  props: {
    // chartId: {
    //   type: String,
    //   required: true
    // }
    // dataX: {
    //   type: Array,
    //   required: true
    // },
    // dataY: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    return {
      expense: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine(dataX, dataY) {
      if (!this.expense) {
        this.expense = this.$echarts.init(document.getElementById('expense-list'));
      }

      let option = {
        color: ['#3AA1FF'],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "4%",
          containLabel: true
        },
        xAxis: 
        {
          type: "category",
          data: dataX,
          axisTick: {
              alignWithLabel: true
          },
          axisLabel: {
            showMaxLabel: true,
            color: "#BFBFBF",
            interval: 0,  
            rotate: 40 
          },
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          },
          axisLine: {       //y轴
            show: false
          },
          axisTick:{       //y轴刻度线
            "show": false
          }
        },
        series: [
          {
            barWidth: '40%',
            name: "cdn",
            type: "bar",
            stack: "广告",
            data: dataY
          },
        ]
      };

      this.expense.setOption(option);
    }
  },
//   watch: {
//     dataX(newVal) {
//       this.drawLine();
//     }
//   }
};
</script>