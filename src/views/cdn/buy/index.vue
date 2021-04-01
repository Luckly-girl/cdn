<template>
  <div class="buy">
    <bg-banner></bg-banner>
    <div class="buy-container">
      <div class="pay">
        <div class="pay-title">购买</div>
        <ul>
          <li>
            <span>{{ buyData.payType }}</span>
            <span></span>
          </li>
          <li>
            <span>使用地域：</span>
            <span>{{ buyData.area }}</span>
          </li>
          <li>
            <span>计费方式：</span>
            <span>{{ buyData.chargeMode }}</span>
          </li>
          <li>
            <span>使用时间：</span>
            <span>{{ buyData.time }}</span>
          </li>
          <li>
            <span>费用：</span>
            <span class="money">￥{{ buyData.price.toFixed(2) }}</span>
          </li>
        </ul>
      </div>
      <div class="pay-type">
        <div class="pay-title1">
          选择支付方式 <span>余额：{{ balance }}</span>
        </div>
        <ul>
          <li
            v-for="item of types"
            :key="item.id"
            @click="selectClick(item.id)"
          >
            <div
              class="table-circle"
              :class="{ 'table-active': id == item.id }"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
            </div>
            <div>
              <i :class="`iconfont ${item.icon}`"></i>
              <span class="type">{{ item.type }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="btn">
        <div v-if="!loading" class="pointer" @click="payClick">立即支付</div>
        <div v-else style="opacity:.8" class="pointer">支付中...</div>
      </div>
    </div>
    <div class="dialogBuy">
      <el-dialog
        title="订单支付"
        @close="getTip"
        :modal-append-to-body="true"
        :visible.sync="dialogVisible"
        width="600px"
        center
      >
        <div class="notice">
          <div>
            <i class="iconfont iconqian"></i>
            <span class="money">{{ buyData.price.toFixed(2) }}</span>
          </div>
          <div class="reweima">
            <img :src="url" alt />
          </div>
          <div class="saoyisao">（用{{ payType[id] }}扫一扫完成支付）</div>
          <el-dialog
            title="订单支付"
            @close="toSuccess"
            :modal-append-to-body="true"
            :visible.sync="dialogVisible2"
            width="40%"
            center
          >
            <div class="notice">
              <div class="pay-success">
                <span>{{ tip }}</span>
              </div>
              <div class="icon">
                <i class="iconfont iconchenggong"></i>
              </div>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { recharge, getOrderStateByOrderNumber, queryAmount } from "@/api/cdn";
export default {
  props: ["buyData"],
  components: {
    bgBanner: () => import("../_components/bgBanner"),
  },
  data() {
    return {
      loading: false,
      types: [
        {
          type: "余额",
          id: 0,
          icon: "icon-yue",
        },
        {
          type: "微信",
          id: 3,
          icon: "iconweixin",
        },
        {
          type: "支付宝",
          id: 2,
          icon: "iconzhifubao",
        },
        // {
        //   type: "网银",
        //   id: 1,
        //   icon: "iconyinhangka"
        // }
      ],
      payType: {
        1: "网银",
        2: "支付宝",
        3: "微信",
      },
      dialogVisible: false,
      dialogVisible2: false,
      id: 0,
      url: "",
      tip: "支付成功",
      payStatus: {
        0: "待支付",
        1: "支付成功",
        2: "支付失败",
      },
      balance: 0,
    };
  },
  created() {
    this.getMoney();
  },
  methods: {
    getMoney() {
      queryAmount().then((res) => {
        if (res.code == 200) {
          this.balance = res.data;
        }
      });
    },
    payClick() {
      // this.dialogVisible = true;
      this.loading = true;
      recharge({
        amount: this.buyData.price,
        type: this.id,
        orderNumber: this.buyData.cdnOrderId,
        productName: "CDN",
      })
        .then((res) => {
          if (res.code == 200) {
            this.url = `data:image/png;base64,${res.data}`;
            if (!this.id) {
              this.$message.success("余额支付成功！");
              this.getMoney();
              this.$emit("paymentSuccess");
              this.loading = false;
            } else {
              this.dialogVisible = true;
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selectClick(id) {
      // console.log(id);
      this.id = id;
    },
    getTip() {
      this.$confirm("支付是否成功？", "支付提示", {
        confirmButtonText: "支付成功",
        cancelButtonText: "支付失败",
        type: "warning",
        showClose: false,
        closeOnClickModal: false,
        closeOnHashChange: false,
        beforeClose: (action, instance, done) => {
          getOrderStateByOrderNumber({
            orderNumber: this.buyData.cdnOrderId,
          }).then((res) => {
            if (res.data === 1) {
              this.tip = this.payStatus[res.data];
              this.dialogVisible2 = true;
            } else {
              this.$message.error("支付失败，请稍后再试");
            }
            done();
          });
        },
      });
    },
    toSuccess() {
      this.$emit("paymentSuccess");
    },
  },
};
</script>

<style lang="scss">
.dialogBuy {
  .el-dialog {
    height: 320px;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: #f9f9f9;
  }
  .el-dialog__body {
    margin-left: 0;
  }
  .el-dialog__title {
    padding-left: 30px;
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
.buy {
  .buy-container {
    width: 920px;
    margin: 20px auto 0;
    .pay {
      margin-bottom: 12px;
      background-color: #fff;
      .pay-title {
        height: 40px;
        line-height: 40px;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
        background-color: #00a896;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        margin: 24px 46px 0;
        padding-bottom: 24px;
        li {
          width: 28%;
          margin-right: 30px;
          span {
            font-size: 14px;
            line-height: 36px;
            &:first-child {
              color: #383838;
              font-weight: 700;
            }
            &:last-child {
              color: #666666;
            }
          }
          .money {
            color: #00a896 !important;
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
    }
    .pay-type {
      box-sizing: border-box;
      margin-bottom: 22px;
      padding: 29px 48px 70px;
      background-color: #fff;
      .pay-title1 {
        font-size: 16px;
        font-weight: 700;
        color: #020202;
        line-height: 35px;
        display: flex;
        justify-content: space-between;
      }
      ul {
        display: flex;
        margin-top: 30px;
        li {
          // border: 1px solid red;
          display: flex;
          cursor: pointer;
          padding: 0 10px;
          margin-right: 80px;

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
    .btn {
      overflow: hidden;
      div {
        float: right;
        width: 255px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        background-color: #00a896;
        border-radius: 2px;
      }
    }
  }
  .notice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    .pay-success {
      font-size: 20px;
      font-weight: 700;
      color: #020202;
      margin-top: 10px;
      margin-bottom: 24px;
    }
    .icon {
      margin-bottom: 70px;
    }
    .money {
      font-size: 20px;
      font-weight: 700;
      color: #717171;
    }
    .iconerweima,
    .iconchenggong {
      font-size: 100px;
      color: #00a896;
    }
    .reweima {
      display: flex;
      width: 150px;
      height: 130px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .saoyisao {
      font-size: 12px;
      color: #6e6e6e;
      margin-top: 10px;
      margin-bottom: 50px;
    }
  }
}
</style>
