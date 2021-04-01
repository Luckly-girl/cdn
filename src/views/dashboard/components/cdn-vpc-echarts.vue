<template>
  <div ref="echartId" style="width: 100%; height:304px"></div>
</template>

<script>
export default {
  name: "cdnSvn",
  data() {
    return {
      echartsData: "",
    };
  },
  props: {
    echartId: String,
    dayData: Array,
    numData: Array,
  },
  created() {
    // this.drawLine()
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
    // this.drawLine()
  },
  methods: {
    drawLine() {
      this.echartsData = this.$echarts.init(this.$refs.echartId);
      // console.log(this.echartsData);
      let option={
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["cdn"],
          bottom: "5%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.dayData,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "cdn",
            type: "bar",
            stack: "广告",
            data: this.numData,
          }
        ],
      };
      this.echartsData.setOption(option, true);   
    },
  },
  //数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
  watch: {
    //观察option的变化
    dayData: {
      handler(newVal, oldVal) {
        this.drawLine()
      },
      deep: true, //对象内部属性的监听，关键。
    },
    numData: {
      handler(newVal, oldVal) {
        this.drawLine()
      },
      deep: true, //对象内部属性的监听，关键。
    },
  },
};
</script>
