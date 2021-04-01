<template>
  <div ref="countVosId" style="width: 100%; height: 300px"></div>
</template>

<script>
export default {
  name: "countVos",
  props: {
    countVosId: String,
    timeData: Array,
    domesticCountsList: Array,
    foreignCountryVosList: Array,
    foreignCountryList: Array,
  },
  data() {
    return {
      webFlowRequests: "",
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
      this.webFlowRequests = this.$echarts.init(this.$refs.countVosId);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["国内", "国外"],
          top: "5%",
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "15%",
          bottom: "6%",
          // containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.timeData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "国内",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              color: "#00A896",
            },
            data: this.domesticCountsList,
          },
          {
            name: "国外",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              color: "#409EFF",
            },
            data: this.foreignCountryList,
          },
        ],
      };
      this.webFlowRequests.setOption(option, true);
      this.webFlowRequests.on("click", (params) => {
        // console.log(this.foreignCountryVosList[params.dataIndex]);
        // console.log(params);
        if (params.seriesName === "国外") {
          this.showForeignDetail(
            option,
            this.foreignCountryVosList[params.dataIndex]
          );
        } else if (params.seriesName === "流量请求数") {
          this.returnMainChart();
        }
      });
    },
    showForeignDetail(option, arrData) {
      let xAxis = arrData.map((item) => item.name);
      let data = arrData.map((item) => item.count);
      option["xAxis"].data = xAxis;
      option["series"] = [
        {
          name: "流量请求数",
          type: "bar",
          barWidth: 15,
          itemStyle: {
            color: "#409EFF",
          },
          data,
        },
      ];
      this.webFlowRequests.setOption(option, true);
    },
    returnMainChart() {
      this.webFlowRequests.off("click");
      this.drawLine();
    },
  },
  //数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
  watch: {
    //观察option的变化
    timeData: {
      handler(newVal, oldVal) {
        this.drawLine();
      },
      deep: true, //对象内部属性的监听，关键。
    },
  },
};
</script>
