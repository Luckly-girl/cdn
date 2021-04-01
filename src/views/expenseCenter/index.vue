<template>
  <div>
    <div class="expense-center" v-if="$route.path == '/expenseCenter'">
      <div class="left">
        <div class="promotion">
          【通知】佰讯科技的优惠促销信息具有较强的时效性，请亲在购物时注意核实，具体以京东相应活动页/商品页的实际促销及价格为准。
        </div>
        <div class="balance mb20">
          <div class="balance-left">
            <div class="available-balance">
              <span>可用余额</span>
              <span>{{ expenseData.availableAmount }}</span
              >元
            </div>
            <ul>
              <li>
                <span>现金余额：</span>
                <span>{{ expenseData.cashAmount }}</span
                >元
              </li>
              <li>
                <span>赠送金余额：</span>
                <span>{{ expenseData.giftAmount }}</span
                >元
              </li>
              <li>
                <span>欠费金额：</span>
                <span>{{ expenseData.owedAmount }}</span
                >元
              </li>
              <li>
                <span>冻结余额：</span>
                <span>{{ expenseData.frozenAmount }}</span
                >元
              </li>
            </ul>
          </div>
          <div class="balance-right">
            <ul>
              <li @click="goTo('expenseCenter/recharge')">充值</li>
              <li @click="goTo('expenseCenter/withdrawCash')">提现</li>
              <li @click="goTo('expenseCenter/incomeAndExpenses')">扣费情况</li>
            </ul>
          </div>
        </div>
        <div class="cost mb20">
          <div class="warning-of-costs">
            <div class="police">
              <span>费用预警</span>
              <el-switch
                v-model="expenseData.alarmEnabled"
                active-color="#13ce66"
                inactive-color="#ccc"
                @change="warningChange"
              >
              </el-switch>
            </div>
            <div class="expense" v-if="expenseData.alarmEnabled === true">
              <span>预警金额：￥{{ expenseData.thresholdAmount }}</span>
              <span @click="policeAmend(expenseData.thresholdAmount)"
                >修改</span
              >
            </div>
          </div>
          <div class="due">
            <div class="due-text">
              <span>即将到期(</span>
              <span class="count">0</span>)
            </div>
            <div class="due-container">
              <div>暂无</div>
              <span>前往</span>
              <!-- <span class="pointer" @click="openPayManage">续费管理</span> -->
              <span>进行相关设置</span>
            </div>
          </div>
        </div>
        <div class="card-invoice-agreement mb20">
          <ul>
            <li class="card">
              <div class="_title">卡券</div>
              <div class="_container">
                <div>
                  <span>优惠券：</span>
                  <span class="count1">{{ expenseData.availableCoupon }}</span>
                  <span>张（</span>
                  <span class="count2">{{ expenseData.expiringCoupon }}</span>
                  <span>张即将过期）</span>
                </div>
                <div>
                  <span>代金券：</span>
                  <span class="count1">{{
                    expenseData.availableVouchers
                  }}</span>
                  <span>张（</span>
                  <span class="count2">{{ expenseData.expiringVouchers }}</span>
                  <span>张即将过期）</span>
                </div>
              </div>
              <div class="btn pointer">立即使用</div>
            </li>
            <li class="invoice">
              <div class="_title">发票</div>
              <div class="_container">
                <div>
                  可开票金额：
                  <span class="count1">{{ expenseData.canInvoiceAmount }}</span>
                  元
                </div>
              </div>
              <div class="btn pointer" @click="applyOpen">申请开票</div>
            </li>
            <li class="agreement">
              <div class="_title">有效合同</div>
              <div class="_container">
                <div class="_invoice">
                  <span class="count1">{{ expenseData.canApplyContract }}</span>
                  份
                </div>
              </div>
              <div class="btn pointer" @click="applyAgreement">申请合同</div>
            </li>
          </ul>
        </div>
        <div class="monthly-bills">
          <div class="title">
            <span>月度账单</span>
            <div class="pointer">
              <span class="more" @click="moreMonth">更多</span>
              <i class="iconfont iconxiala1"></i>
            </div>
          </div>
          <div class="table">
            <el-table
              :data="MonthAmount"
              style="width: 100%"
              :show-header="showHeader"
            >
              <el-table-column
                prop="month"
                label="时间"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="amountMoney"
                label="交易金额"
                width="180"
              ></el-table-column>
              <el-table-column prop="status" label="交易状态">
                交易成功
              </el-table-column>
              <el-table-column prop="operate" label="操作" width="94">
                <template slot-scope="scope">
                  <div
                    class="check pointer"
                    @click="handleEdit(scope.row.month, scope.row.timeType)"
                  >
                    查看
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="pending-orders mb20">
          <div class="title">
            <div>
              <span>待支付账单(</span>
              <span class="count">{{ total }}</span>
              <span>)</span>
            </div>
            <div class="pointer" @click="allOrderList">
              <span class="more">全部</span>
              <i class="iconfont iconxiala1"></i>
            </div>
          </div>
          <div class="pending-orders-container">
            <ul v-for="item in orderList" :key="item.id">
              <li>
                <div class="orders-sub-title">
                  <div>{{ item.orderCreationTime | dateFilter }}</div>
                  <div>
                    <span>订单号：</span>
                    <span class="orders-num">{{ item.orderNumber }}</span>
                  </div>
                </div>
                <div class="orders-title">{{ item.productName }}</div>
                <!-- <div class="orders-text">
                  20%性能基线，性价比之王！个人开发者建站必备
                  </div> -->
                <div class="orders-status">
                  {{ item.orderStatus | orderStatusFilter }}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <img src="@/assets/images/expense/advertising@2x.png" alt />
      </div>
      <el-dialog
        title="预警设置"
        :visible.sync="dialogVisible"
        width="500px"
        center
        custom-class="elDialog"
        v-if="expenseData.alarmEnabled === true"
      >
        <div class="dialog-input">
          <div class="input-wrap">
            <img src="@/assets/images/expense/ico_money@2x.png" alt />
            <input v-model="input" placeholder="请输入预警金额值" />
          </div>

          <div>（当账户余额低于预警设置值时，每日提醒一次）</div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancleChange">取 消</el-button>
          <el-button @click="changeAmount(input)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  queryMyAmount,
  queryMyMonthBillList,
  modifyAlertStatus,
  getOrderList,
} from "@/api/expense.js";
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      showHeader: false,
      dialogVisible: false,
      input: 0,
      tableData: [
        {
          time: "2020年06月",
          money: "-125.00",
          status: "交易成功",
        },
        {
          time: "2020年07月",
          money: "-125.00",
          status: "交易成功",
        },
        {
          time: "2020年08月",
          money: "-125.00",
          status: "交易成功",
        },
        {
          time: "2020年09月",
          money: "-125.00",
          status: "交易成功",
        },
      ],
      searchMap: {
        page: 1,
        limit: 5,
        orderStatus: 0,
      },
      orderList: [],
      total: 0,
      expenseData: {},
      MonthAmount: [],
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.queryMyAmount();
      this.queryMyMonthBillList();
      this.getOrderList();
    });
  },
  watch: {
    $route(to, form) {
      if (to.path == "/expenseCenter") {
        this.queryMyAmount();
        this.queryMyMonthBillList();
        this.getOrderList();
      }
    },
  },
  methods: {
    queryMyAmount() {
      queryMyAmount().then((res) => {
        if (res.code === 200) {
          this.expenseData = res.data;
          this.expenseData.alarmEnabled = res.data.alarmEnabled;
        }
      });
    },
    async queryMyMonthBillList() {
      const { data: resMon } = await queryMyMonthBillList();
      this.MonthAmount = resMon;
      // console.log(this.MonthAmount);
    },
    //获取待支付状态账单
    async getOrderList() {
      const { data: resOrder } = await getOrderList(
        this.searchMap.page,
        this.searchMap.limit,
        this.searchMap.orderStatus
      );
      this.orderList = resOrder.rows;
      this.total = resOrder.total;
    },
    //查看全部待支付账单
    allOrderList() {
      this.$router.push("/expenseCenter/orderOverview");
    },
    //点击续费管理
    // openPayManage() {
    //   this.$router.push("/expenseCenter/repayment");
    // },
    //修改提交
    async changeAmount(value) {
      const { data: resStatus } = await modifyAlertStatus(
        this.expenseData.alarmEnabled,
        value
      );
      this.dialogVisible = false;
      this.queryMyAmount();
    },
    //取消提交
    cancleChange() {
      this.dialogVisible = false;
    },
    //费用预警开启
    async warningChange(val) {
      const { data: resStatus } = await modifyAlertStatus(val);
      if (val === false) {
        this.expenseData.alarmEnabled = false;
        this.input = 0;
        this.dialogVisible = false;
      } else {
        this.expenseData.alarmEnabled = true;
        this.dialogVisible = true;
      }
      this.queryMyAmount();
    },
    //点击修改弹框
    policeAmend(val) {
      this.dialogVisible = true;
      this.input = val;
      // console.log(this.input);
    },
    //点击月度账单查看
    handleEdit(time, timeType) {
      this.$router.push({
        path: "/expenseCenter/expenseList",
        query: { month: time, type: timeType },
      });
      // console.log(time);
    },
    //点击更多
    moreMonth() {
      this.$router.push({
        path: "/expenseCenter/expenseList",
        query: { month: "", type: 2 },
      });
    },
    // dialogClose() {
    //   this.alarmEnabled = false;
    // },
    //申请开票
    applyOpen() {
      this.$router.push("/expenseCenter/invoice");
    },
    //申请合同
    applyAgreement() {
      this.$router.push("/expenseCenter/agreementApplication");
    },
    goTo(item) {
      this.$router.push(item);
    },
  },
};
</script>

<style lang="scss">
.expense-center {
  .el-table {
    border: none;
  }
  .elDialog {
    .el-dialog__header {
      height: 60px;
      line-height: 60px;
      background-color: #f9f9f9;
    }
    .el-dialog__title {
      padding-left: 30px;
    }
    .el-dialog__footer {
      padding-bottom: 50px;
    }
  }
}
</style>

<style lang="scss" scoped>
.expense-center {
  width: 100%;
  .left {
    width: 70%;
    display: inline-block;
    margin-right: 20px;
    vertical-align: top;
    .promotion {
      height: 43px;
      line-height: 43px;
      font-size: 12px;
      color: #666;
      padding: 0 20px;
      background-color: transparent;
    }
    .balance {
      display: flex;
      padding: 49px 62px;
      background-color: #fff;
      .balance-left {
        flex: 1;
        .available-balance {
          font-size: 20px;
          font-weight: 700;
          color: #020202;
        }
        ul {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-top: 25px;
          li {
            width: 48%;
            font-size: 14px;
            color: #666;
            line-height: 24px;
          }
        }
      }
      .balance-right {
        flex: 1;
        // border: 1px solid red;
        ul {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 20px;
          height: 100%;
          li {
            flex: 1;
            // border: 1px solid red;
            cursor: pointer;
            text-align: center;
            color: rgba(69, 161, 249, 1);
            line-height: 24px;
            font-size: 14px;
          }
        }
      }
    }
    .cost {
      display: flex;
      height: 173px;
      .warning-of-costs {
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        font-size: 16px;
        font-weight: 700;
        color: #020202;
        box-sizing: border-box;
        background-color: #fff;
        margin-right: 22px;
        .police {
          width: 100%;
          height: 40px;
          margin-left: 60%;
        }
        .expense {
          display: flex;
          width: 100%;
          padding-top: 10px;
          border-top: 2px solid #eeeeee;
          span:nth-child(1) {
            flex: 1;
            width: 100px;
            font-size: 12px;
            margin-left: 90px;
          }
          span:nth-child(2) {
            flex: 1;
            font-size: 12px;
            color: #00a896;
            cursor: pointer;
            margin-left: 50px;
          }
        }
        span {
          margin-right: 20px;
        }
      }
      .due {
        flex: 5;
        display: flex;
        align-items: center;
        background-color: #fff;
        .due-text {
          width: 33%;
          height: 145px;
          font-size: 16px;
          font-weight: 700;
          color: rgba(1, 1, 1, 1);
          text-align: center;
          line-height: 145px;
          border-right: 1px solid rgba(237, 237, 237, 1);
          .count {
            color: #fd774d;
          }
        }
        .due-container {
          width: 67%;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #666;
          line-height: 24px;
          > div {
            padding-bottom: 10px;
            font-size: 16px;
            font-weight: 700;
            color: #999;
          }
          .pointer {
            color: #45a1f9;
          }
        }
      }
    }
    .card-invoice-agreement {
      ul {
        display: flex;
        li {
          flex: 1;
          background-color: #fff;
          padding: 40px 40px 14px;
          ._title {
            font-size: 16px;
            font-weight: 700;
            color: #020202;
            margin-bottom: 30px;
          }
          ._container {
            position: relative;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 48px;
            ._invoice {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            }
            span {
              font-size: 14px;
              color: #666;
              line-height: 24px;
            }
            .count1 {
              color: #151515;
              font-weight: 700;
            }
            .count2 {
              color: #ff0000;
            }
          }
          .btn {
            width: 100%;
            height: 40px;
            font-size: 14px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background-color: rgba(0, 167, 149, 1);
            border-radius: 1px 2px 2px 1px;
            margin-top: 30px;
          }
        }
        li.invoice {
          margin: 0 20px;
        }
      }
    }
    .monthly-bills {
      background-color: #fff;
      .title {
        font-size: 16px;
        padding-right: 30px;
        display: flex;
        justify-content: space-between;
      }
      .table {
        padding: 10px 20px;
      }
      .check {
        color: #45a1f9;
      }
    }
  }

  .right {
    display: inline-block;
    width: 28%;
    vertical-align: top;

    .pending-orders {
      background-color: #fff;
      .title {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        border: none;
        .count {
          color: #ff0000;
        }
      }

      .pending-orders-container {
        ul {
          padding: 10px 15px;
          li {
            margin-top: 20px;
            border-bottom: 1px solid rgba(245, 245, 245, 1);
            &:first-child {
              margin-top: 5px;
            }
            &:last-child {
              border: none;
            }
            .orders-sub-title {
              display: flex;
              justify-content: space-between;
              height: 30px;
              padding: 0 12px;
              line-height: 30px;
              background-color: rgba(245, 245, 245, 1);
              font-size: 12px;
              color: rgba(177, 169, 169, 1);
              .orders-num {
                font-size: 12px;
                color: #272727;
              }
            }
            .orders-title {
              padding: 16px 10px 0;
              font-size: 14px;
              font-weight: 700;
              color: rgba(1, 1, 1, 1);
            }
            .orders-text {
              padding: 9px 10px 0;
              font-size: 12px;
              color: rgba(1, 1, 1, 1);
            }
            .orders-status {
              padding: 20px 10px 18px;
              font-size: 14px;
              color: rgba(255, 0, 0, 1);
            }
          }
        }
      }
    }

    img {
      width: 100%;
    }
  }

  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(1, 1, 1, 1);
    margin: 0px 30px;
    padding: 10px 0;
    height: 40px;
    line-height: 45px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  .text {
    font-size: 16px;
    color: rgba(1, 1, 1, 1);
  }
  .dialog-input {
    width: 100%;
    height: 120px;
    .input-wrap {
      position: relative;
      width: 220;
      input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        padding-left: 30px;
        outline: none;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(183, 209, 201, 1);
        margin: 54px auto 18px;
        font-size: 12px;
        color: rgba(102, 102, 102, 1);
      }
      img {
        position: absolute;
        top: 8px;
        left: 10px;
      }
    }

    div {
      width: 300px;
      font-size: 12px;
      color: rgba(126, 126, 126, 1);
      margin: 0 auto 50px;
    }
  }
}
.dialog-footer {
  .el-button {
    margin-right: 20px;
    width: 105px;
  }
  .el-button:nth-child(1) {
    background-color: #eeeeee;
  }
  .el-button:nth-child(2) {
    color: #ffffff;
    background-color: #00a896;
  }
}

.iconxiala1 {
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
}

.iconxiala1 {
  margin-left: 4px;
}

.icondaixufei,
.icondaizhifu,
.icongongdan1 {
  font-size: 30px;
  color: #45a2fa;
}

.icongongdan1 {
  font-size: 28px;
}

.iconremen,
.iconzuixin {
  font-size: 30px;
  color: #fcbc43;
  margin-right: 8px;
}

.more {
  font-size: 14px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
}
</style>
