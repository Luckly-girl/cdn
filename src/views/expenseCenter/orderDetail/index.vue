<template>
  <div class="order-detail">
    <div>
      <div class="order-title">
        <span @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        订单详情
      </div>
      <div class="table">
        <el-table
          :data="orderDetailData.userOrderDetails"
          :border="true"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="productName"
            label="产品"
            width="320"
          ></el-table-column>
          <el-table-column
            prop="orderQuantity"
            label="数量"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="orderDetails"
            label="具体详情"
            width="220"
          ></el-table-column>
          <el-table-column label="购买方式">
            <template slot-scope="scope">{{
              scope.row.purchaseMethod | purchaseMethodFilter
            }}</template>
          </el-table-column>
          <el-table-column label="起止时间" width="320">
            <template slot-scope="scope"
              >{{ scope.row.startTime }} - {{ scope.row.endTime }}</template
            >
          </el-table-column>
          <el-table-column prop="orderAmount" label="金额"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="codeInfo">
      <div class="order-title-two">相关信息</div>
      <div class="detail">
        <ul>
          <li>
            订单编号：
            <span>{{ orderDetailData.orderNumber }}</span>
          </li>
          <li>
            订单类型：
            <span>{{ orderDetailData.orderType | orderTypeFilter }}</span>
          </li>
          <li>
            创建时间：
            <span>{{ orderDetailData.orderCreationTime }}</span>
          </li>
        </ul>
        <ul>
          <li>
            支付时间：
            <span>{{ orderDetailData.paymentTime }}</span>
          </li>
          <li>
            订单来源：
            <span>{{ orderDetailData.orderSource }}</span>
          </li>
          <li>
            支付状态：
            <span
              >{{ orderDetailData.orderStatus | orderStatusFilter }} ￥{{
                orderDetailData.originalAmount
              }}</span
            >
            <span
              @click="payOpenClick"
              class="paying"
              v-if="orderDetailData.orderStatus == 0"
              >立即支付</span
            >
          </li>
        </ul>
        <ul>
          <li>
            原价：
            <span>{{ orderDetailData.originalAmount }}</span>
          </li>
          <li>
            代金券：
            <span>{{ orderDetailData.voucherAmount }}</span>
          </li>
          <li>
            应付：
            <span>{{ orderDetailData.originalAmount }}</span>
          </li>
        </ul>
        <el-dialog
          title="订单支付"
          :modal-append-to-body="true"
          :visible.sync="dialogVisible"
          width="450px"
        >
          <div class="payMoney">￥{{ orderDetailData.originalAmount }}</div>
          <div class="reweima" @click="clickCode">
            <img :src="this.orderCodeData" />
          </div>
          <!-- <p class="finishPay">(用支付宝扫一扫完成支付)</p> -->
          <div class="messageCode">
            <span></span>
            提示:如果交易卖家不匹配，请点击二维码刷新
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetails, getQrCode } from "@/api/order.js";
export default {
  data() {
    return {
      orderNumber: "",
      value1: "",
      dialogVisible: false,
      searchForm: {
        value1: "",
        orderNum: "",
      },
      orderDetailData: {},
      orderCodeData: {},
    };
  },
  created() {
    // console.log(this.$route.query.orderNumber);
    this.orderNumber = this.$route.query.orderNumber;
    this.getOrderDetails();
  },
  methods: {
    getOrderDetails() {
      getOrderDetails(this.orderNumber).then((res) => {
        this.orderDetailData = res.data;
      });
    },
    getQrCode() {
      getQrCode(this.orderNumber).then((res) => {
        this.orderCodeData = "data:image/png;base64," + res.data;
      });
    },
    filterType(value, row) {
      return row.type === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(id) {
      // console.log(id);
    },
    // 二维码弹出框
    payOpenClick() {
      this.dialogVisible = true;
      this.getQrCode();
    },
    // 点击二维码立即刷新
    clickCode() {
      this.getQrCode();
    },
  },
};
</script>

<style lang="scss">
.order-detail {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }

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
  .el-dialog{
    height: 350px;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
  }
  .el-dialog__title {
    padding-left: 30px;
  }
  .el-dialog__body {
    height: 245px;
  }
}
</style>

<style lang="scss" scoped>
.order-detail {
  background-color: #fff;
  padding-bottom: 90px;
  .order-title {
    position: relative;
    text-align: center;
    padding-top: 20px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
    span {
      position: absolute;
      left: 15px;
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
  .order-title-two {
    padding: 15px 30px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .table {
    padding: 30px;
    span {
      color: #45a2fa;
    }
  }
  .codeInfo {
    height: 180px;
    margin: 0 30px;
    background-color: #f7f7f7;
  }
  .detail {
    display: flex;
    height: 150px;
    padding: 0 30px;
    ul:nth-child(1) {
      flex: 1;
      width: 120px;
      height: 80px;
    }
    ul:nth-child(2) {
      flex: 1;
      width: 120px;
      height: 80px;
      padding-left: 230px;
      .paying {
        margin-left: 10px;
        display: flex;
        width: 72px;
        height: 24px;
        align-items: center;
        justify-content: center;
        color: #00a896;
        border: 1px solid #00a896;
        border-radius: 10px;
      }
    }
    ul:nth-child(3) {
      flex: 1;
      width: 120px;
      height: 80px;
      padding-left: 300px;
    }
    li {
      display: flex;
      align-items: center;
      width: 245px;
      font-size: 12px;
      font-weight: bold;
      color: rgba(56, 56, 56, 1);
      line-height: 36px;
      &:nth-child(even) {
        margin-right: 0px;
      }
      span {
        color: #717171;
      }
    }
    .payMoney {
      width: 88px;
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
    // .finishPay {
    //   width: 170px;
    //   margin: 0 auto;
    // }
    .messageCode {
      width: 315px;
      height: 30px;
      line-height: 30px;
      padding-top: 15px;
      margin: auto;
      color: #ff6a00;
    }
    .messageCode span {
      display: inline-block;
      width: 18px;
      height: 13px;
      padding-right: 5px;
      background: url("../../../assets/images/alert.png") no-repeat;
    }
  }
}
.el-form {
  display: flex;
  margin-right: auto;
  .el-form-item {
    margin-right: 20px;
  }
}
</style>
