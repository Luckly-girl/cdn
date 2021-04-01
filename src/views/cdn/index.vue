<template>
  <div v-if="!buyShow" class="cdn">
    <bg-banner></bg-banner>

    <el-dialog class="dialog-notice" title="CDN服务协议" :visible.sync="protocolVisible" width="700px" center>
     <protocol></protocol>
    </el-dialog>

    <div class="layout">
      <el-radio-group v-model="tabPosition" style="margin: 20px 0;">
        <el-radio-button :label="1">中国境内</el-radio-button>
        <el-radio-button :label="2">海外</el-radio-button>
      </el-radio-group>

      <div>
        <div class="compute">计算方式</div>
        <el-radio-group v-model="tabPosition2" style="margin: 20px 0;">
          <el-radio-button :label="1">按使用流量计费</el-radio-button>
          <el-radio-button :label="2">按带宽峰值计费</el-radio-button>
        </el-radio-group>
      </div>

      <div>
        <div class="compute">计算标准</div>
        <div class="table">
          <!-- 国内 使用流量计费 -->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            v-show="tabPosition === 1 && tabPosition2 === 1"
          >
            <el-table-column prop="productName" label="流量定价体系" min-width="110"></el-table-column>
            <el-table-column
              v-for="(head, index) of tableHead"
              :label="head.name"
              :key="`head_${index}`"
              :prop="`cost_${index}`"
            ></el-table-column>
          </el-table>

          <!-- 国内 宽带峰值计费 -->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            v-show="tabPosition === 1 && tabPosition2 === 2"
          >
            <el-table-column prop="productName" label="带宽定价体系" min-width="100"></el-table-column>
            <el-table-column
              min-width="140"
              v-for="(head, index) of tableHead"
              :label="head.name"
              :key="`head2_${index}`"
              :prop="`cost_${index}`"
            ></el-table-column>
          </el-table>
          <!-- 海外 使用流量计费 -->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            v-show="tabPosition === 2 && tabPosition2 === 1"
          >
            <el-table-column prop="productName" label="流量定价体系" min-width="100"></el-table-column>
            <el-table-column prop="NA" label="北美"></el-table-column>
            <el-table-column prop="EU" label="欧洲"></el-table-column>
            <el-table-column prop="AP1" label="亚太1"></el-table-column>
            <el-table-column prop="AP2" label="亚太2"></el-table-column>
            <el-table-column prop="ME" label="中东"></el-table-column>
            <el-table-column prop="AF" label="非洲"></el-table-column>
            <el-table-column prop="SA" label="南美"></el-table-column>
          </el-table>
          <!-- 海外 宽带峰值计费 -->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            v-show="tabPosition === 2 && tabPosition2 === 2"
          >
            <el-table-column prop="productName" label="带宽定价体系" min-width="100"></el-table-column>
            <el-table-column prop="NA" label="北美"></el-table-column>
            <el-table-column prop="EU" label="欧洲"></el-table-column>
            <el-table-column prop="AP1" label="亚太1"></el-table-column>
            <el-table-column prop="AP2" label="亚太2"></el-table-column>
            <el-table-column prop="ME" label="中东"></el-table-column>
            <el-table-column prop="AF" label="非洲"></el-table-column>
            <el-table-column prop="SA" label="南美"></el-table-column>
          </el-table>
        </div>
        <div class="notice pointer" @click="selectClick">
          <div class="table-circle tal" :class="{ 'table-active': isSelected }">
            <div class="outer">
              <div class="inner"></div>
            </div>
          </div>我已阅读并同意相关服务条款
          <span @click.stop="showProtocol">《佰讯云CDN产品服务保障协议》</span>
        </div>
      </div>

      <div class="btn">
        <div @click="useClick">立即使用</div>
        <!-- <el-button type="info" disabled>立即使用</el-button> -->
        <div @click="costCalculatorClick">费用计算器</div>
      </div>
    </div>
    <!-- 购买 -->
    <!-- <div v-else class="purchase">
      <section class="pur_top">
        <h3>购买</h3>
        <div class="pur_top_con">
          <div class="display">
            <p>
              <i>后付费</i>
            </p>
            <p>
              <i>使用地域：</i> 中国境内
            </p>
          </div>
          <div class="display">
            <p>
              <i>计费方式：</i>按宽带峰值计费
            </p>
            <p>
              <i>使用时间：</i> 3个月
            </p>
            <p>
              <i>费用：</i>
              <span class="money">￥2000</span>
            </p>
          </div>
        </div>
      </section>

      <section class="pur_bottom">
        <div class="pur_bot_con">
          <h3>选择支付方式</h3>
          <ul>
            <li></li>
          </ul>
        </div>
      </section>
    </div>-->

    <el-dialog class="dialog-notice" title="提示" :visible.sync="dialogVisible" width="500px" center>
      <div class="notice">
        <div>您已开通CDN！</div>
        <div>现在您可以通过域名管理接入域名，享受畅快加速服务！</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$router.push('/cdn/domain')">域名管理</el-button>
      </span>
    </el-dialog>

    <!-- 费用计算器 -->
    <el-dialog
      class="dialog-cost"
      title="费用计算器"
      :visible.sync="dialogVisible2"
      width="500px"
      center
    >
      <div class="cost">
        <div class="pay-type">
          <el-radio-group
            v-model="calculator.payType"
            @change="resetCalculator"
            style="margin: 20px 0; border: 1px solid #DCDFE6; border-radius: 20px"
          >
            <el-radio-button label="postPayment">后付费</el-radio-button>
            <el-radio-button label="flowPackage">国内流量包</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="calculator.payType === 'postPayment'">
          <div class="com">
            <div class="compute">计费方式</div>
            <el-radio-group v-model="calculator.tabPosition3" style="margin: 20px 0;">
              <el-radio-button :label="1">按使用流量计费</el-radio-button>
              <el-radio-button :label="2">按带宽峰值计费</el-radio-button>
            </el-radio-group>
          </div>

          <div class="com">
            <div class="compute">使用地域</div>
            <el-radio-group v-model="calculator.tabPosition4" style="margin: 20px 0;">
              <el-radio-button :label="1">中国境内</el-radio-button>
              <el-radio-button :label="2">海外</el-radio-button>
            </el-radio-group>
            <el-row>
              <el-col :span="8">
                <el-input
                  @change="restrict($event, 'peakFlow')"
                  v-model.number="calculator.peakFlow"
                  placeholder
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="calculator.val" placeholder style="margin-left: 16px">
                  <el-option :label="'MBps'" :value="1"></el-option>
                  <el-option :label="'GBps'" :value="2"></el-option>
                  <el-option :label="'TBps'" :value="3"></el-option>
                  <el-option :label="'PBps'" :value="4"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <div class="flow-tail">预估每日峰值流量</div>
              </el-col>
            </el-row>
          </div>

          <div>
            <div class="compute" style="margin: 20px 0">使用时间</div>
            <el-row>
              <el-col :span="8">
                <el-input
                  @change="restrict($event, 'useTime')"
                  v-model.number="calculator.useTime"
                  placeholder
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="calculator.useVal" placeholder style="margin: 0 16px">
                  <el-option label="天" :value="1"></el-option>
                  <el-option label="月" :value="2"></el-option>
                  <el-option label="年" :value="3"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-show="calculator.payType === 'flowPackage'">
          <div class="spec">
            <div class="compute" style="margin-bottom: 20px">规格</div>
            <ul>
              <li
                class="pointer"
                :class="{ active: index === calculator.mark }"
                @click="specClick(index)"
                v-for="(item, index) of dataPackage"
                :key="'btn_' + index"
              >{{ item.name }}</li>
            </ul>
          </div>
          <div>
            <div class="compute" style="margin: 20px 0">使用时间</div>
            <el-select v-model="calculator.useTime2" placeholder>
              <el-option label="一个月" :value="1"></el-option>
              <el-option label="三个月" :value="2"></el-option>
              <el-option label="半年" :value="3"></el-option>
              <el-option label="一年" :value="4"></el-option>
            </el-select>
          </div>
          <div>
            <div class="compute" style="margin: 20px 0">数量</div>
            <el-row>
              <el-col :span="12">
                <el-input
                  @change="restrict($event, 'count')"
                  v-model.number="calculator.count"
                  maxlength="2"
                ></el-input>
                <span class="_tip">提示：最多99个</span>
              </el-col>
              <el-col :span="8">
                <div class="flow-tail">个</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="bg-img">
          <img src="@/assets/images/cdn1/bg_price.png" alt>
          <div>
            费用金额：
            <span>￥{{ allCount.toFixed(2) }}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="calculator.payType === 'postPayment'" @click="immediateUse">立即使用</el-button>
          <el-button v-else @click="flowPackageBuy">购买</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
  <buy @paymentSuccess="buyShow = false" :buyData="buyMessage" v-else></buy>
</template>

<script>
import {
  showCdnBuyPrice,
  calcAfterFeeOrBuy,
  calcFlowPackageOrBuy,
  showCdnFlowPackageBuyPrice,
  addOpenCdn
} from "@/api/cdn";
import { mapState } from "vuex";
export default {
  components: {
    bgBanner: () => import("./_components/bgBanner"),
    buy: () => import("./buy"),
    protocol:()=>import('./protocol')
  },
  data() {
    return {
      protocolVisible:false,
      buyShow: false,
      allCount: 0.0,
      tableHead: [],
      buyMessage: {},
      units: ["KB", "MB", "GB", "TB", "PB"],
      calculator: {
        mark: 0,
        val: 1,
        useVal: 1,
        peakFlow: 1, // 流量峰值
        count: 1, // 流量峰值
        useTime: 1, // 流量峰值
        useTime2: 1, // 流量峰值
        tabPosition3: 1,
        tabPosition4: 1,
        payType: "postPayment"
      },
      timeDate: {
        1: "一个月",
        2: "三个月",
        3: "半年",
        4: "一年"
      },

      tabPosition: 1,
      tabPosition2: 1,

      isSelected: false,
      dialogVisible: false,
      dialogVisible2: false,
      tableData: [],
      areas: ["", "CN", "NA", "EU", "AP1", "AP2", "ME", "AF", "SA"],
      dataPackage: [],
      throttleCalcBuy: null,
      throttleCalcPackageBuy: null
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    this.initData();
    this.initFlowPackage();
    this.throttleCalcBuy = this.throttle(this.calcBuy, 500);
    this.throttleCalcPackageBuy = this.throttle(this.calcPackageBuy, 500);
  },
  methods: {
    initData() {
      showCdnBuyPrice(this.tabPosition, this.tabPosition2).then(res => {
        if (res.code == 200) {
          if (this.tabPosition == 1) {
            this.tableData = res.data.rows[0].ccsShowCosts.reduce(
              (acc, cur) => {
                acc[0][`cost_${res.data.rows[0].ccsShowCosts.indexOf(cur)}`] =
                  cur.cost;

                return acc;
              },
              [{ productName: "单价（元/GB）" }]
            );
            this.tableHead = res.data.rows[0].ccsShowCosts.reduce(
              (acc, cur) => {
                let unit;
                unit = {
                  name: this.handleFlowScope(
                    cur.minFlow,
                    cur.maxFlow,
                    cur.unitFlow
                  )
                };
                acc.push(unit);
                return acc;
              },
              []
            );
          } else {
            let num = -1;
            this.tableData = res.data.rows[0].ccsShowCosts.reduce(
              (acc, cur) => {
                let obj = {};
                num++;
                obj.productName = this.handleFlowScope(
                  cur.minFlow,
                  cur.maxFlow,
                  cur.unitFlow
                );
                for (let item of res.data.rows) {
                  obj[this.areas[item.cdnCalcCost.area]] =
                    item.ccsShowCosts[num].cost;
                }
                acc.push(obj);
                return acc;
              },
              []
            );
          }
        }
      });
    },
    initFlowPackage() {
      showCdnFlowPackageBuyPrice().then(res => {
        if (res.code == 200) {
          this.dataPackage = res.data.rows[0].ccsShowCosts.reduce(
            (acc, cur) => {
              if (~cur.maxFlow) {
                acc.push({
                  name: this.handleFlowScope(cur.maxFlow, cur.unitFlow),
                  id: cur.ccsId,
                  value: cur.maxFlow
                });
              }
              return acc;
              // console.log(acc,999999)
            },
            []
          );
        }
      });
    },
    //处理流量范围
    handleFlowScope(min, max, unitFlow) {
      function lg(val) {
        return Math.trunc(Math.log10(val) / 3);
      }

      let name = `${
        min > 1000 ? Math.floor(min / Math.pow(1024, lg(min))) : min
      }${(min ? min : "") &&
        (min > 1000
          ? this.units[
              this.units.indexOf(unitFlow) + Math.trunc(Math.log10(min) / 3)
            ]
          : unitFlow + (this.tabPosition2 == 2 ? "ps" : ""))}-${
        max > 1000 ? Math.floor(max / Math.pow(1024, lg(max))) : max
      }${max &&
        (max > 1000
          ? this.units[
              this.units.indexOf(unitFlow) + Math.trunc(Math.log10(max) / 3)
            ]
          : unitFlow)}${this.tabPosition2 == 2 ? "ps" : ""}(不含)`;

      if (!~max) {
        name = `${
          min > 1000 ? Math.floor(min / Math.pow(1024, lg(min))) : min
        }${min &&
          (min > 1000
            ? this.units[
                this.units.indexOf(unitFlow) + Math.trunc(Math.log10(min) / 3)
              ]
            : unitFlow)}${this.tabPosition2 == 2 ? "ps" : ""}及以上`;
      }

      if (arguments.length == 2) {
        let val = arguments[0];
        let unitFlow = arguments[1];
        name = `${
          val > 1000 ? Math.floor(val / Math.pow(1024, lg(val))) : val
        }${(val ? val : "") &&
          (val > 1000
            ? this.units[
                this.units.indexOf(unitFlow) + Math.trunc(Math.log10(val) / 3)
              ]
            : unitFlow)}`;
      }
      return name;
    },
    //计算器
    calcBuy() {
      calcAfterFeeOrBuy({
        place: this.calculator.tabPosition4,
        billingMethod: this.calculator.tabPosition3,
        flow: !this.calculator.peakFlow ? 1 : this.calculator.peakFlow,
        flowUnit: this.calculator.val,
        dateNum: !this.calculator.useTime ? 1 : this.calculator.useTime,
        dateUnit: this.calculator.useVal
      }).then(res => {
        if (res.code == 200) {
          this.allCount = res.data.price;
        }
      });
    },
    calcPackageBuy() {
      calcFlowPackageOrBuy({
        ccsId: this.dataPackage[this.calculator.mark].id,
        num: !this.calculator.count ? 1 : this.calculator.count,
        calcTime: this.calculator.useTime2,
        maxFlow: this.dataPackage[this.calculator.mark].value,
        isBuy: 0
      }).then(res => {
        if (res.code == 200) {
          this.allCount = res.data.price;
        }
      });
    },
    resetCalculator(val) {
      this.calculator = {
        val: 1,
        useVal: 1,
        peakFlow: 1, // 流量峰值
        count: 1, // 流量峰值
        useTime: 1, // 流量峰值
        useTime2: 1, // 流量峰值
        tabPosition3: 1,
        tabPosition4: 1,
        payType: val,
        mark: 0
      };
      this.allCount = 0.0;
    },
    restrict(val, value) {
      !val && (this.$data.calculator[value] = 1);
    },
    fetchData() {
    },
    selectClick() {
      this.isSelected = !this.isSelected;
    },
    useClick() {
      if (!this.isSelected) {
        return void this.$message.error("请在同意服务条款后操作");
      }
      addOpenCdn().then(res => {
        if (res.code == 200) {
          this.dialogVisible = true;
        }
      });
    },
    //后付费  立即使用
    immediateUse() {
      this.useClick();
    },
    //国内流量包购买
    flowPackageBuy() {
      calcFlowPackageOrBuy({
        ccsId: this.dataPackage[this.calculator.mark].id,
        num: !this.calculator.count ? 1 : this.calculator.count,
        calcTime: this.calculator.useTime2,
        maxFlow: this.dataPackage[this.calculator.mark].value,
        isBuy: 1
      }).then(res => {
        if (res.code == 200) {
          this.dialogVisible2 = false;
          this.buyMessage["price"] = res.data.price;
          this.buyMessage["payType"] =
            this.calculator.payType === "postPayment" ? "后付费" : "国内流量包";
          this.buyMessage["area"] =
            this.calculator.tabPosition4 === 1 ? "中国境内" : "海外";
          this.buyMessage["chargeMode"] =
            this.calculator.tabPosition3 === 1
              ? "使用流量计费"
              : "按宽带峰值计费";
          this.buyMessage["time"] = this.timeDate[this.calculator.useTime2];
          this.buyMessage["cdnOrderId"] = res.data.cdnOrderId;
          this.buyShow = true;
        }
      });
    },
    costCalculatorClick() {
      this.dialogVisible2 = true;
    },
    specClick(ind) {
      this.calculator.mark = ind;
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
    showProtocol() {
      this.protocolVisible=true
    }
  },
  watch: {
    tabPosition() {
      this.initData();
    },
    tabPosition2() {
      this.initData();
    },
    calculator: {
      handler() {
        if (this.calculator.payType === "postPayment") {
          this.throttleCalcBuy();
        } else {
          this.throttleCalcPackageBuy();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.cdn {
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #00a896;
  }
  .dialog-cost {
    .el-radio-button__inner {
      width: 140px;
    }
    .pay-type {
      .el-radio-button__inner {
        width: 160px;
        border: none;
        border-radius: 20px;
      }
    }
  }
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
}
</style>

<style lang="scss" scoped>
.cdn {
  background-color: #fff;
  ._tip {
    color: red;
    font-size: 12px;
  }
  .compute {
    font-size: 14px;
    font-weight: 600;
    color: #020202;
  }
  .layout {
    width: 70%;
    margin: 20px auto;

    .table {
      padding: 20px 0;
      span {
        font-size: 12px;
        color: #00a896;
        padding: 0 10px;
        cursor: pointer;
      }
    }
    .notice {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #717171;
      span {
        color: #00a896;
      }
      .table-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        .outer {
          width: 15px;
          height: 15px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(229, 229, 229, 1);
          border-radius: 50%;
        }
      }
      .table-active {
        .outer {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #00a896;
          .inner {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #00a896;
          }
        }
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      width: 600px;
      margin: 0 auto;
      padding: 30px 0;
      div {
        width: 240px;
        height: 40px;
        color: #00a896;
        text-align: center;
        line-height: 40px;
        border: 1px solid #00a896;
        border-radius: 2px;
        cursor: pointer;
        &:first-child {
          font-size: 14px;
          color: #fff;
          background-color: #00a896;
        }
      }
    }
  }
  .purchase {
    width: 70%;
    margin: 21px auto;
    min-width: 900px;
    background: #f7f7f7;
    .pur_top {
      background: #fff;
      h3 {
        font-size: 16px;
        line-height: 31px;
        text-align: center;
        color: #fff;
        background: {
          color: #00a896;
        }
      }
      .pur_top_con {
        padding: 24px 46px;
        .display {
          display: flex;

          p {
            flex-basis: 30%;
            font-size: 14px;
            i {
              font-weight: bold;
              font-style: normal;
              color: #383838;
            }
            .money {
              color: #00a896;
              font-size: 16px;
              font-weight: bold;
            }
          }
          &:nth-child(1) {
            margin-bottom: 20px;
          }
        }
      }
    }
    .pur_bottom {
      background: #fff;
      margin-top: 12px;
      .pur_bot_con {
        padding: 29px 48px;
        h3 {
          font-size: 16px;
          font-weight: bold;
          color: #020202;
        }
      }
    }
  }
}
.dialog-notice {
  padding-bottom: 30px;
  .notice {
    margin: 30px 0;
    text-align: center;
    > div {
      font-size: 14px;
      font-weight: 700;
      color: #020202;
      &:last-child {
        font-size: 12px;
        font-weight: 400;
        margin-top: 20px;
        color: #666;
      }
    }
  }
}
.dialog-cost {
  .cost {
    padding: 10px 40px;
    .flow-tail {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #656565;
      margin-left: 16px;
    }
    .bg-img {
      position: relative;
      margin-top: 20px;
      img {
        width: 100%;
      }
      div {
        position: absolute;
        top: 38px;
        left: 180px;
        font-size: 12px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #00a795;
        line-height: 32px;
        span {
          font-size: 20px;
        }
      }
    }
    .pay-type {
      text-align: center;
    }
    .spec {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 65px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          font-size: 12px;
          color: #656565;
          border: 1px solid rgba(234, 234, 234, 1);
          box-shadow: 0px 5px 6px 0px rgba(3, 0, 0, 0.16);
          margin-right: 10px;
          margin-bottom: 10px;
        }
        .active {
          background-color: rgba(237, 237, 237, 1);
          color: #010101;
        }
      }
    }
  }
  .el-button {
    width: 100%;
    margin: 30px 0;
  }
}
.el-button {
  color: #fff;
  width: 120px;
  height: 39px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
}

</style>
