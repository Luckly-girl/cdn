<template>
  <div  class="basic-facts">
    <div>
      <div class="left">
        <ul class="btn">
          <li
            class="pointer"
            :class="{ active: index === mark }"
            @click="btnClick(index)"
            v-for="(item, index) in btnList"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div class="echarts-wrap">
          <ul>
            <li>
              <div class="name">
                <div>请求总数</div>
                Total Request
              </div>
              <div class="echarts">
                <total-Req
                  :domesticTotalRequestList="domesticTotalRequestList"
                  :foreignTotalRequestList="foreignTotalRequestList"
                  :timeList="timeList"
                ></total-Req>
              </div>
            </li>
            <li>
              <div class="name">
                <div>独立访客</div>
                UV
              </div>
              <div class="echarts">
                <uni-Que
                  :domesticUniqueVisitorCountList="
                    domesticUniqueVisitorCountList
                  "
                  :foreignUniqueVisitorCountList="foreignUniqueVisitorCountList"
                  :timeList="timeList"
                ></uni-Que>
              </div>
            </li>
            <li>
              <div class="name">
                <div>带宽峰值</div>
                Peak Bandwidth
              </div>
              <div class="echarts">
                <peak-Band
                  :domesticPeakBandwidthList="domesticPeakBandwidthList"
                  :foreignPeakBandwidthList="foreignPeakBandwidthList"
                  :timeList="timeList"
                ></peak-Band>
              </div>
            </li>
            <li>
              <div class="name">
                <div>已提供数据量（B)</div>
                Total Data Served
              </div>
              <div class="echarts">
                <flow-Val
                  :domesticFlowValueList="domesticFlowValueList"
                  :foreignFlowValueList="foreignFlowValueList"
                  :timeList="timeList"
                ></flow-Val>
              </div>
            </li>
            <li>
              <div class="name">
                <div>已阻止的攻击数</div>
                Attack Blocked
              </div>
              <div class="echarts">
                <inter-Cept
                  :domesticInterceptTotalList="domesticInterceptTotalList"
                  :foreignInterceptTotalList="foreignInterceptTotalList"
                  :timeList="timeList"
                ></inter-Cept>
              </div>
            </li>
          </ul>
          <div
            class="reload-more pointer"
            @click="$router.push('/cdn/dataCenter')"
          >
            加载更多
            <i class="iconfont icongengduo"></i>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">通知</div>
            <div class="title-right pointer">
              <span class="more">更多</span>
              <i class="iconfont icongengduo"></i>
            </div>
          </div>
          <div class="notice-container">
            <ul>
              <li>6.18年中大促，低至0,.001</li>
              <li>海外节点新上线，免费体验</li>
              <li>【运营商通知】北京机房将于6月19日凌晨进行割接</li>
              <li>
                【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会
              </li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">安全</div>
          </div>
          <div class="notice-container">
            <ul>
              <li>6.18年中大促，低至0,.001</li>
              <li>海外节点新上线，免费体验</li>
              <li>【运营商通知】北京机房将于6月19日凌晨进行割接</li>
              <li>
                【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会
              </li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">性能</div>
          </div>
          <div class="notice-container performance">
            <ul>
              <li>提高网站使用性能提高网站使用性能</li>
              <li>进入缓存设置</li>
              <li>优化流量策略</li>
              <li>进入流量策略设置</li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">模式</div>
          </div>
          <div class="notice-container mode">
            <ul>
              <li>
                <div>攻击防御模式</div>
                <el-switch
                  v-model="value"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  @change="attackDefenseModeChange(value)"
                ></el-switch>
              </li>
              <li>
                <div>开发模式</div>
                <el-switch
                  v-model="value2"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                ></el-switch>
              </li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">
              资源包管理
            </div>
          </div>
          <div class="notice-container src">
            请点击“查看”，到费用中心的资源包概览页面，选择“CDN/
            全站加速资源包”查询详细信息。
            <div class="btn pointer" @click="$router.push('/cdn/flowPacket')">
              前往购买
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="_dia">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="500px"
        center
        @close="dialogClose"
      >
        <div class="notice">
          <div class="text">
            <div class="notice-title">禁用攻击防御模式</div>
            <div class="notice-text">
              为您的网站选择新的安全级别，以禁用该模式
            </div>
          </div>
          <div class="text">
            <div class="notice-title">安全级别</div>
            <div class="notice-text">
              调整您网站的安全级别，确定哪些访问者将接受管控。
            </div>
            <el-select v-model="safeValue" placeholder="请选择">
              <el-option
                v-for="item in safeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="help-wrap">
            <ul>
              <li>API</li>
              <li @click="helpShow = !helpShow">帮助</li>
            </ul>
          </div>
        </div>
        <div class="help-text" v-show="helpShow">
          <div>我应该选择哪个安全级别？</div>
          <div>
            您选择的安全级别将决定向哪些访问者显示质询页面。我们建议从“中”安全级别开始。
          </div>
          <div>本质上为关：仅管控最严重的违法者</div>
          <div>低：仅管控威胁最大的访问者</div>
          <div>中：管控威胁程度中等的访问者和威胁最大的访问者</div>
          <div>高：控制过去 14 天内表现出威胁行为的所有访问者</div>
          <div>攻击防御模式： 仅应在您的网站受到 DDoS攻击时使用</div>
          <div>
            当我们分析访问者的流量和行为以确保他们是尝试访问您网站的合法人类
          </div>
          <div>访问者时，访问者将收到一个插页式页面</div>
          <div class="mark">
            注意：本模式可能会影响您的域上的某些操作。例如，可能会阻止访问您的
            API。您可以使用页面规则为域的任意部分设置自定义安全级别。
          </div>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getOverView } from "@/api/general.js";
import { calcFlowPackageOrBuy, showCdnFlowPackageBuyPrice } from "@/api/cdn";
import totalReq from "./components/total-request";
import uniQue from "./components/uv";
import peakBand from "./components/peak-bandwidth";
import flowVal from "./components//total-data-served";
import interCept from "./components/attack-blocked";
export default {
  components: {
    totalReq,
    uniQue,
    peakBand,
    flowVal,
    interCept
  },
  data() {
    return {
      btnList: ["24小时", "近7天", "近30天"],
      chargBtnList: ["变更计费方式", "价格明细"],
      mark: 0,
      mark1: 0,
      value: true,
      value2: true,
      dialogVisible: false,
      groupId: "",
      realmNames: "",
      type: "",
      safeValue: "本质上为关",
      safeOptions: [
        {
          label: "本质上为关",
          value: "本质上为关",
        },
        {
          label: "低",
          value: "低",
        },
        {
          label: "中",
          value: "中",
        },
        {
          label: "高",
          value: "高",
        },
      ],
      helpShow: false,
      // totalRequestVos: [], //请求总数
      domesticTotalRequestList: [],
      foreignTotalRequestList: [],
      timeList: [],
      //  uniqueVisitorTotalVos: [], //独立访客
      domesticUniqueVisitorCountList: [],
      foreignUniqueVisitorCountList: [],
      // peakBandwidthVos:[]  //宽带峰值
      domesticPeakBandwidthList: [],
      foreignPeakBandwidthList: [],
      // flowValueVos:[],   //已提供数据量
      domesticFlowValueList: [],
      foreignFlowValueList: [],
      // interceptTotalVos:[], //已阻止攻击数
      domesticInterceptTotalList: [],
      foreignInterceptTotalList: [],
    };
  },
  created() {
    this.$nextTick(() => {
      this.getOverView();
    });
  },
  mounted() {},
  methods: {
    getOverView() {
      getOverView(this.mark, this.groupId, this.realmNames, this.type).then(
        (res) => {
          (this.domesticTotalRequestList = res.data.totalRequestVos.map(
            (obj) => {
              return obj.domesticTotalRequest;
            }
          )),
            (this.foreignTotalRequestList = res.data.totalRequestVos.map(
              (obj) => {
                return obj.foreignTotalRequest;
              }
            )),
            (this.timeList = res.data.totalRequestVos.map((obj) => {
              return obj.time;
            })),
            (this.domesticUniqueVisitorCountList = res.data.uniqueVisitorTotalVos.map(
              (obj) => {
                return obj.domesticUniqueVisitorCount;
              }
            )),
            (this.foreignUniqueVisitorCountList = res.data.uniqueVisitorTotalVos.map(
              (obj) => {
                return obj.foreignUniqueVisitorCount;
              }
            )),
            (this.timeList = res.data.uniqueVisitorTotalVos.map((obj) => {
              return obj.time;
            })),
            (this.domesticPeakBandwidthList = res.data.peakBandwidthVos.map(
              (obj) => {
                return obj.domesticPeakBandwidth;
              }
            )),
            (this.foreignPeakBandwidthList = res.data.peakBandwidthVos.map(
              (obj) => {
                return obj.foreignPeakBandwidth;
              }
            )),
            (this.timeList = res.data.peakBandwidthVos.map((obj) => {
              return obj.time;
            })),
            (this.domesticFlowValueList = res.data.flowValueVos.map((obj) => {
              return obj.domesticFlowValue;
            })),
            (this.foreignFlowValueList = res.data.flowValueVos.map((obj) => {
              return obj.foreignFlowValue;
            })),
            (this.timeList = res.data.flowValueVos.map((obj) => {
              return obj.time;
            })),
            (this.domesticInterceptTotalList = res.data.interceptTotalVos.map(
              (obj) => {
                return obj.domesticInterceptTotal;
              }
            )),
            (this.foreignInterceptTotalList = res.data.interceptTotalVos.map(
              (obj) => {
                return obj.foreignInterceptTotal;
              }
            )),
            (this.timeList = res.data.interceptTotalVos.map((obj) => {
              return obj.time;
            }));
          // console.log(this.timeList,2222)
        }
      );
    },
    specClick(ind, val) {
      this.calculator.mark = ind;
    },
    btnClick(ind) {
      // console.log(ind);
      this.mark = ind;
      this.getOverView();
      // console.log(this.mark);
    },
    chargBtnClick(ind) {
      // console.log(ind);
      this.mark1 = ind;
    },
    attackDefenseModeChange(val) {
      this.dialogVisible = !val;
    },
    dialogClose() {
      this.helpShow = false;
    },
    //节流
    throttle(fn, timeout) {
      let flag = false,
        timer = null;

      return () => {
        if (!flag) {
          fn.apply(this, [...arguments]);
          flag = true;
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn.apply(this, [...arguments]);
          }, timeout);
        }
      };
    },
  },
  watch: {
    calculator: {
      handler() {
        this.throttleCalcPackageBuy();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.basic-facts {
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
  ._dia {
    .el-dialog__wrapper {
      bottom: auto;
    }
  }
  .el-dialog {
    height: auto;
  }
  .el-dialog__title {
    margin-left: 30px;
  }
  .el-dialog__body {
    margin-left: 30px;
  }
}
</style>

<style lang="scss" scoped>
@import "index.scss";
</style>
