<template>
  <div ref="interceptTotalVosId" style="width: 100%; height: 200px"></div>
</template>

<script>
export default {
  name: "interCept",
  props: {
    interceptTotalVosId: String,
    domesticInterceptTotalList: Array,
    foreignInterceptTotalList: Array,
    timeList: Array,
  },
  data() {
    return {
      interceptTotalVos: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.interceptTotalVos = this.$echarts.init(
        this.$refs.interceptTotalVosId
      );

      let option = {
        title: {
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#666",
            fontSize: 14,
            bottom: 20,
          },
        },
        legend: {
          data: ["国内", "国外"],
        },
        grid: {
          left: "10%",
          right: "6%",
          top: "18%",
          bottom: "24%",
        },
        backgroundColor: "#fff", // 背景颜色
        // legend: {
        //   data: [{ name: "cpu_total", icon: "circle" }],
        //   bottom: "3%"
        // },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          position: "bottom",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
          },
          data: this.timeList,
          // data: this.dataX
        },
        yAxis: {
          splitNumber: 5,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#666",
              opacity: 0.2,
            },
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
            // formatter: "{value}%"
          },
        },
        series: [
          {
            name: "国内",
            type: "line",
            data: this.domesticInterceptTotalList,
            // data: this.dataYCPU,
            // smooth: true,
            symbol: "circle",
            itemStyle: {
              color: "#409EFF",
            },
          },
          {
            name: "国外",
            type: "line",
            data: this.foreignInterceptTotalList,
            // data: this.dataYCPU,
            // smooth: true,
            symbol: "circle",
            itemStyle: {
              color: "#00A896",
            },
          },
        ],
      };
      this.interceptTotalVos.setOption(option, true);
    },
  },
  //数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
  watch: {
    //观察option的变化
    timeList: {
      handler(newVal, oldVal) {
        this.drawLine();
      },
      deep: true, //对象内部属性的监听，关键。
    },
    domesticInterceptTotalList: {
      handler(newVal, oldVal) {
        this.drawLine();
      },
      deep: true, //对象内部属性的监听，关键。
    },
    foreignInterceptTotalList: {
      handler(newVal, oldVal) {
        this.drawLine();
      },
      deep: true, //对象内部属性的监听，关键。
    },
  },
};
</script>
