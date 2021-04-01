<template>
  <div v-if="!buyShow" class="flowPack">
    <div class="flow-title">流量包管理</div>
    <div class="purchFlow">
      <el-button @click="clickFlow">购买流量包</el-button>
      <span>当前计费方式：按流量日结计算</span>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="packetType" label="类型"></el-table-column>
        <el-table-column label="领取/购买时间" width="300px">
          <template slot-scope="scope">
            已使用：{{ scope.row.useTraffic }} (共：{{ scope.row.total }})
          </template>
        </el-table-column>
        <el-table-column
          prop="insertTime"
          label="领取/购买时间"
        ></el-table-column>
        <el-table-column prop="expireTime" label="到期时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{
            scope.row.flowPacketState | flowPacketStateFilter
          }}</template></el-table-column
        >
        <el-table-column prop="source" label="来源"></el-table-column>
      </el-table>
    </div>
    <!-- 点击购买弹框 -->
    <el-dialog
      class="dialog-cost"
      title="购买国内流量包"
      :visible.sync="dialogVisibleDialog"
    >
      <div class="spec">
        <div class="compute" style="margin-bottom: 20px">规格</div>
        <ul>
          <li
            class="pointer"
            :class="{ active: index === calculator.mark }"
            @click="specClick(index, item.name)"
            v-for="(item, index) of dataPackage"
            :key="'btn_' + index"
          >
            {{ item.name }}
          </li>
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
      <div class="bg-img">
        <img src="@/assets/images/cdn1/bg_price.png" alt />
        <div>
          费用金额：
          <span>￥{{ allCount.toFixed(2) }}</span>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="flowPackageBuy">购买</el-button>
      </div>
    </el-dialog>
    <pagination ref="pagination" :total="total"></pagination>
  </div>
  <purch v-else :buyData="buyMessage"></purch>
</template>

<script>
import { getFlowPacketList } from "@/api/general.js";
import { calcFlowPackageOrBuy, showCdnFlowPackageBuyPrice } from "@/api/cdn";
import purch from "./purch/index";
export default {
  components: {
    purch,
  },
  data() {
    return {
      total: 0,
      tableData: [],
      //点击购买对话框
      dialogVisibleDialog: false,
      allCount: 0.0,
      buyShow: false,
      buyMessage: {},
      calculator: {
        mark: 0,
        val: 1,
        useVal: 1,
        specsName: "",
        peakFlow: 1, // 流量峰值
        count: 1, // 流量峰值
        useTime: 1, // 流量峰值
        useTime2: 1, // 流量峰值
        tabPosition3: 1,
        tabPosition4: 1,
        payType: "postPayment",
      },
      timeDate: {
        1: "一个月",
        2: "三个月",
        3: "半年",
        4: "一年",
      },
      units: ["KB", "MB", "GB", "TB", "PB"],
      dataPackage: [],
      throttleCalcPackageBuy: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
      this.homeFlowPacket();
      this.throttleCalcPackageBuy = this.throttle(this.calcPackageBuy, 500);
    });
  },
  methods: {
    async fetchData() {
      const { data: resFlow } = await getFlowPacketList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize
      );
      this.tableData = resFlow.rows;
      this.total = resFlow.total;
      //   console.log(resFlow.rows, 1111, resFlow.total);
    },
    //请求国内流量包规格
    async homeFlowPacket() {
      const { data: resFlow } = await showCdnFlowPackageBuyPrice();
      const { code: resCode } = await showCdnFlowPackageBuyPrice();
      if (resCode == 200) {
        this.dataPackage = resFlow.rows[0].ccsShowCosts.reduce((acc, cur) => {
          if (~cur.maxFlow) {
            acc.push({
              name: this.handleFlowScope(cur.maxFlow, cur.unitFlow),
              id: cur.ccsId,
              value: cur.maxFlow,
            });
          }
          return acc;
        }, []);
      }
      this.calcPackageBuy();
    },
    //流量包处理
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
    //购买金额
    calcPackageBuy() {
      calcFlowPackageOrBuy({
        ccsId: this.dataPackage[this.calculator.mark].id,
        num: !this.calculator.count ? 1 : this.calculator.count,
        calcTime: this.calculator.useTime2,
        maxFlow: this.dataPackage[this.calculator.mark].value,
        isBuy: 0,
      }).then((res) => {
        if (res.code == 200) {
          this.allCount = res.data.price;
        }
      });
    },
    //点击流量包购买
    flowPackageBuy() {
      calcFlowPackageOrBuy({
        ccsId: this.dataPackage[this.calculator.mark].id,
        num: !this.calculator.count ? 1 : this.calculator.count,
        calcTime: this.calculator.useTime2,
        maxFlow: this.dataPackage[this.calculator.mark].value,
        isBuy: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.dialogVisibleDialog = false;
          this.buyMessage["price"] = res.data.price;
          this.buyMessage["cdnOrderId"] = res.data.cdnOrderId;
          this.buyMessage["area"] =
            this.calculator.mark === 0 ? "100GB" : this.specsName;
          this.buyMessage["chargeMode"] = this.calculator.count;
          this.buyMessage["time"] = this.timeDate[this.calculator.useTime2];
          this.buyShow = true;
        }
      });
    },
    specClick(ind, val) {
      this.specsName = val;
      this.calculator.mark = ind;
    },
    restrict(val, value) {
      this.chargAmount = val;
      !val && (this.$data.calculator[value] = 1);
    },
    //点击流量包管理购买
    clickFlow() {
      this.dialogVisibleDialog = true;
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
.flowPack {
  .table {
    padding: 20px 0 30px;
    .el-table th > .cell,
    .el-table td > .cell {
      height: 35px;
      text-align: center;
      font-size: 12px;
      color: rgba(113, 113, 113, 1);
    }

    .el-table th > .cell {
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
    }
    .el-table--enable-row-transition .el-table__body td {
      height: 55px;
    }
  }
  .el-dialog {
    width: 500px;
    height: 600px;
  }
  .el-dialog__header {
    height: 55px;
    line-height: 60px;
    background-color: #f9f9f9;
  }
  .el-dialog__title {
    margin: 20px 0 0 30px;
  }
  .el-dialog__body {
    margin-left: 30px;
  }
}
</style>

<style lang="scss" scoped>
.flowPack {
  .flow-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .purchFlow {
    .el-button {
      background-color: #00a896;
      color: #fff;
    }
    span {
      margin-left: 30px;
    }
  }
  .dialog-cost {
    .compute {
      font-size: 14px;
      font-weight: 600;
      color: #020202;
    }
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
      width: 440px;
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
    .dialog-footer {
      margin-top: 20px;
      .el-button {
        width: 435px;
        margin-right: 30px;
        background-color: #00a795;
        color: #fff;
      }
    }
  }
}
</style>
