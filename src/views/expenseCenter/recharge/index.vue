<template>
  <div class="recharge">
    <div class="order-title">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      充值
    </div>

    <div class="daoqi">
      <div>
        当前余额：
        <span class="money">{{ currentSum }}</span
        >元
      </div>
      <div>
        充值金额：
        <i class="iconfont iconqian"></i>
        <input type="text" v-model="input" />
      </div>
      <div>
        可前往收支明细页面查看
        <span class="recharge-record pointer" @click="investMoney"
          >充值记录</span
        >
      </div>
    </div>

    <div class="payType">
      <div class="title">选择支付方式</div>
      <ul>
        <li>
          <div
            class="table-circle"
            :class="{ 'table-active': weixin }"
            @click="selectedhuiClick(3)"
          >
            <div class="outer">
              <div class="inner"></div>
            </div>
          </div>
          <div>
            <i class="iconfont iconweixin"></i>
            <span class="type">微信支付</span>
          </div>
        </li>
        <li>
          <div
            class="table-circle"
            :class="{ 'table-active': zhifubao }"
            @click="selectedzhiClick(2)"
          >
            <div class="outer">
              <div class="inner"></div>
            </div>
          </div>
          <div>
            <i class="iconfont iconzhifubao"></i>
            <span class="type">支付宝</span>
          </div>
        </li>
        <li>
          <div
            class="table-circle"
            :class="{ 'table-active': wangyin }"
            @click="selectedyinClick(1)"
          >
            <div class="outer">
              <div class="inner"></div>
            </div>
          </div>
          <div>
            <i class="iconfont iconyinhangka"></i>
            <span class="type">企业网银</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="payType mark">
      <div class="title">温馨提示</div>
      <div class="mark-content">
        <div>不支持信用卡方式充值。</div>
        <span>如您有未结清账单，充值后优先抵扣未结清账单。</span>
        <div>充值后请及时对支付订单进行结算，以免影响正常服务。</div>
      </div>
    </div>

    <el-checkbox v-model="checked" @click="checkedStatus"
      >我已了解：充值的款项只可用于佰讯云消费，如需提现，佰讯云只支持原路退回至付款账号。</el-checkbox
    >

    <div class="deposit">
      <el-tooltip
        class="item"
        effect="light"
        content="请勾选我已了解"
        placement="right"
        :disabled="checked === false ? flag : !flag"
      >
        <span>
          <el-button
            :disabled="checked === false ? disabled : isDisabled"
            @click="deposit(input, type)"
            >充值</el-button
          >
        </span>
      </el-tooltip>
    </div>

    <el-dialog
      title="充值支付"
      :modal-append-to-body="true"
      :visible.sync="dialogVisible"
      width="450px"
    >
      <div class="payMoney">￥{{ input }}</div>
      <div class="reweima">
        <img :src="this.expenseCodeData" />
      </div>
      <div class="messageCode">
        <span></span>
        提示：如遇二维码失效，请重新操作
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recharge, queryAmount } from "@/api/expense.js";
export default {
  data() {
    return {
      flag: false,
      zhifubao: false,
      wangyin: false,
      weixin: false,
      checked: false,
      disabled: true,
      isDisabled: false,
      input: "",
      expenseCodeData: {},
      dialogVisible: false,
      currentSum: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    async fetchData() {
      const { data: resSum } = await queryAmount();
      this.currentSum = resSum;
    },
    //点击充值
    async deposit(val, type) {
      const { data: resDep, code } = await recharge(val, type);
      if (code === 200) {
        this.expenseCodeData = "data:image/png;base64," + resDep;
        this.dialogVisible = true;
      } else {
        return false;
      }
    },
    //点击充值记录
    investMoney() {
      this.$router.push("/expenseCenter/incomeAndExpenses");
    },
    //勾选我已阅读
    checkedStatus(val) {
      this.checked = true;
    },
    selectedzhiClick(val) {
      this.type = val;
      this.zhifubao = true;
      this.wangyin = false;
      this.weixin = false;
    },
    selectedyinClick(val) {
      this.type = val;
      this.zhifubao = false;
      this.wangyin = true;
      this.weixin = false;
    },
    selectedhuiClick(val) {
      this.type = val;
      this.zhifubao = false;
      this.wangyin = false;
      this.weixin = true;
    },
  },
};
</script>

<style lang="scss">
.recharge {
  .el-dialog {
    height: 320px;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
  }
  .el-dialog__title {
    padding-left: 30px;
  }
}
</style>

<style lang="scss" scoped>
.recharge {
  padding: 0 30px 30px;
  background-color: #fff;
  .order-title {
    position: relative;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
    span {
      position: absolute;
      left: -15px;
      display: inline-block;
      width: 40px;
      height: 20px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 168, 150, 1);
      cursor: pointer;
    }
  }
  .daoqi {
    display: flex;
    align-items: center;
    padding: 0 20px 20px;
    font-size: 14px;
    color: #272727;
    > div {
      margin-right: 36px;
      &:nth-child(2) {
        position: relative;
      }
      .iconqian {
        position: absolute;
        left: 81px;
        top: 9px;
        font-size: 12px;
      }
      .money {
        color: #00a896;
        font-size: 20px;
        font-weight: 700;
      }
      input {
        box-sizing: border-box;
        width: 158px;
        height: 30px;
        padding: 0 16px 0 24px;
        border: 1px solid #b7d1c9;
        border-radius: 3px;
        outline: none;
      }
      .recharge-record {
        color: #4fa3ee;
      }
    }
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    color: #020202;
  }

  .payType {
    width: 80%;
    height: 200px;
    padding: 29px 48px;
    box-sizing: border-box;
    border: 1px solid #eee;
    border-radius: 4px;
    ul {
      display: flex;
      margin-top: 30px;
      li {
        display: flex;
        cursor: pointer;
        padding: 0 10px;
        margin-right: 50px;

        > div:last-child {
          display: flex;
          flex-direction: column;
          align-items: center;

          i {
            font-size: 36px;
            color: #1296db;
          }
          .type {
            font-size: 12px;
            font-weight: 400;
            color: #666;
            margin-top: 2px;
          }
        }
        .table-circle {
          display: flex;
          justify-content: center;
          align-items: center;
          vertical-align: bottom;
          // border: 1px solid red;
          margin-right: 20px;
          .outer {
            width: 22px;
            height: 22px;
            margin: 0 auto;
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
            border: 1px solid rgba(0, 168, 150, 1);
            .inner {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: rgba(0, 168, 150, 1);
            }
          }
        }
      }
    }
  }
  .mark {
    box-sizing: border-box;
    height: 160px;
    margin-top: 15px;
    border: none;
    background-color: #f9f9f9;
    margin-bottom: 20px;
    .mark-content {
      margin-top: 16px;
      font-size: 12px;
      color: #666;
      line-height: 22px;
      span {
        color: #00a896;
        margin: 20px 0;
      }
    }
  }
}
.el-button {
  color: #fff;
  width: 90px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
  margin-top: 20px;
}
.payMoney {
  width: 70px;
  height: 30px;
  color: #020202;
  font-size: 18px;
  margin: auto;
  margin-top: 30px;
}
.reweima {
  display: flex;
  width: 150px;
  height: 130px;
  margin: 0 auto;
}
.reweima img {
  width: 100%;
  height: 100%;
}
.messageCode {
  width: 315px;
  height: 40px;
  line-height: 30px;
  padding-top: 15px;
  margin: auto;
  color: #ff6a00;
  span {
    display: inline-block;
    width: 18px;
    height: 13px;
    padding-right: 5px;
    margin-left: 20px;
    background: url("../../../assets/images/alert.png") no-repeat;
  }
}
</style>
