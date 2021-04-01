<template>
  <div class="withdrawCash">
    <div class="order-title">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      提现
    </div>

    <div class="daoqi">
      <div class="allMoney">
        当前可提现总额：
        <i class="iconfont iconqian"></i>
        <span class="money">{{ drawalAmount }}</span>
        <el-tooltip placement="top" popper-class="tooltip" effect="light">
          <div slot="content">
            可提现金额￥{{ drawalAmount }}=现金余额￥{{ availableAmount }} -
            转账金额￥{{ transferAmount }} - 预留金额值￥{{ reservedAmount }}
          </div>
          <img src="../../../assets/images/expense/wenhao@2x.png" />
        </el-tooltip>
      </div>
      <div class="advanceBtn">
        <el-button @click="advanceClick">提现</el-button>
      </div>
    </div>

    <!-- 提现对话框 -->
    <el-dialog
      title="提现"
      :visible.sync="dialogAddVisible"
      :ref="addSiteForm"
      @closed="resetForm('addSiteForm')"
      custom-class="elDialog"
    >
      <div class="demain-input">
        <el-form ref="addSiteForm" :rules="addRules" :model="addSiteForm">
          <el-form-item label="可提现金额:" class="thisAdvance"
            ><span>￥{{ drawalAmount }}</span></el-form-item
          >
          <el-form-item label="提现金额:" prop="withdrawal" class="advancs">
            <el-input
              min="10"
              v-model="addSiteForm.withdrawal"
              @blur.prevent="chargeAmount(addSiteForm.withdrawal)"
            ></el-input>
            <p>最小金额为10元，必须为整数</p>
          </el-form-item>
          <el-form-item label="收款账户:" prop="receivingBank" class="bank">
            <el-select
              v-model="addSiteForm.receivingBank"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in bankList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="银行卡号:"
            prop="withdrawalAccountNumber"
            class="bankCard"
          >
            <el-input v-model="addSiteForm.withdrawalAccountNumber"></el-input>
          </el-form-item>
          <el-form-item
            label="银行开户预留手机号:"
            prop="withdrawalPhone"
            class="bankPhone"
          >
            <el-input v-model="addSiteForm.withdrawalPhone"></el-input>
          </el-form-item>
          <el-form-item label="手续费:" class="brokerage"
            ><span>￥{{ this.addSiteForm.chargeAmount }}</span>
            <span>(提现金额的3%，最低为1元)</span>
          </el-form-item>
          <el-form-item
            label="预计到账日期:"
            prop="delayDate"
            class="expectDate"
          >
            <span>(1-3个工作日到账，双休日和法定节假日顺延)</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addSiteForm')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addSiteForm')"
          >申请提现</el-button
        >
      </div>
    </el-dialog>

    <div class="payType mark">
      <div class="title">温馨提示</div>
      <div class="mark-content">
        <ul>
          <li>
            1.可提现金额=现金余额 - 转账金额
            ，如果您有开通按量计费产品，可提现金额需要在扣除按量计费预留的金额值。
          </li>
          <li>
            2.选择您原来充值的订单发起提现，提现资金将原路返回原充值时付款的账号。
          </li>
          <li>
            3.非自己充值，比如订单退款产生的资金，您可以提交工单申请线下提现；
          </li>
        </ul>
      </div>
    </div>

    <div>
      <div class="order-title tal">提现记录</div>
      <div class="daoqi2">
        <el-form ref="form" label-width="110px">
          <el-form-item label="申请提现时间">
            <el-date-picker
              v-model="timetotime"
              type="datetimerange"
              range-separator="-"
              :default-time="['12:00:00']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div class="search">
          <i class="el-icon-search pointer" @click="searchData"></i>
          <el-input
            v-model="searchMap.withdrawalNumber"
            placeholder="请输入单号"
            icon="el-icon-search"
          ></el-input>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column
            prop="withdrawalNumber"
            label="提现单号"
          ></el-table-column>
          <el-table-column
            prop="applicationTime"
            label="申请提现时间"
            width="180"
          ></el-table-column>
          <el-table-column prop="withdrawal" label="提现金额"></el-table-column>
          <el-table-column
            prop="completionTime"
            label="操作完成时间"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="withdrawalAccountNumber"
            label="提现到帐帐号"
          ></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{
              scope.row.withdrawalState | withdrawalStateFilter
            }}</template>
          </el-table-column>
        </el-table>
        <pagination ref="pagination" :total="total"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getWithdrawalAmount,
  getWithdrawalRecordList,
  saveWithdrawalRecord,
} from "@/api/expense.js";
import md5 from "js-md5";
import { mapState } from "vuex";
import { dateFilter } from "@/filters";
export default {
  data() {
    //校验提现金额为正整数
    const withdrawalRule = (rule, value, callback) => {
      const reg = /^[1-9]{1}[0-9]*$/;
      if (!reg.test(value) || value < 10) {
        callback(new Error("请输入不小于10的整数"));
      } else {
        callback();
      }
    };

    //手机号验证
    const withdrawalPhoneRule = (rule, value, callback) => {
      const reg = /^[1][3-9][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };

    //银行账号验证
    const withdrawalAccountNumberRule = (rule, value, callback) => {
      const reg = /^([1-9]{1})(\d{14}|\d{18})$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的银行账号"));
      } else {
        callback();
      }
    };

    return {
      zhifubao: false,
      wangyin: false,
      huikuan: false,
      checked: false,
      timetotime: [],
      drawalAmount: 0,
      availableAmount: 0,
      transferAmount: 0,
      reservedAmount: 0,
      dialogAddVisible: false,
      tableData: [],
      total: 0,
      searchMap: {
        startTime: "",
        endTime: "",
        withdrawalNumber: "",
      },
      //收款银行
      bankList: [
        {
          text: "中国工商银行",
          value: 0,
        },
        {
          text: "中国建设银行",
          value: 1,
        },
        {
          text: "中国农业银行",
          value: 2,
        },
        {
          text: "中国银行",
          value: 3,
        },
        {
          text: "交通银行",
          value: 4,
        },
        {
          text: "广大银行",
          value: 5,
        },
        {
          text: "民生银行",
          value: 6,
        },
        {
          text: "广发银行",
          value: 7,
        },
        {
          text: "平安银行",
          value: 8,
        },
        {
          text: "招商银行",
          value: 9,
        },
        {
          text: "中国邮政储蓄银行",
          value: 10,
        },
      ],
      val: 0.03,
      addSiteForm: {
        withdrawal: "", //提现金额
        receivingBank: "", //收款银行
        withdrawalAccountNumber: "", //收款账号
        withdrawalPhone: "", //预留手机号
        chargeAmount: "", //手续费
        id: "",
        md5Code: "",
        inp: "16395594800890714744133132966721531000",
        delayDate: "", //到账日期
      },
      //提现表单验证
      addRules: {
        withdrawalAccountNumber: [
          {
            required: true,
            validator: withdrawalAccountNumberRule,
            trigger: "blur",
          },
        ],
        withdrawalPhone: [
          { required: true, validator: withdrawalPhoneRule, trigger: "blur" },
        ],
        withdrawal: [
          { required: true, validator: withdrawalRule, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.getWithdrawalAmount();
      this.fetchData();
    });
    this.addSiteForm.id = this.userInfo.id;
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    //提现余额
    async getWithdrawalAmount() {
      const { data: resAdvance } = await getWithdrawalAmount();
      this.drawalAmount = resAdvance.drawalAmount;
      this.availableAmount = resAdvance.availableAmount;
      this.transferAmount = resAdvance.transferAmount;
      this.reservedAmount = resAdvance.reservedAmount;
    },
    //提现记录
    async fetchData() {
      const { data: resList } = await getWithdrawalRecordList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.searchMap.withdrawalNumber
      );
      this.tableData = resList.rows;
      this.total = resList.total;
    },
    //点击提现
    advanceClick() {
      this.dialogAddVisible = true;
    },
    chargeAmount(value) {
      let numberReg = /^\d+$|^\d+[.]?\d+$/;
      let reg = /^[1-9]{1}[0-9]*$/;
      if (
        !numberReg.test(value) ||
        !reg.test(value) ||
        value === "" ||
        value < 10
      ) {
        return (this.addSiteForm.chargeAmount = "");
      } else if (value > 33) {
        return (this.addSiteForm.chargeAmount = (
          parseInt(value) * this.val
        ).toFixed(2));
      } else if (10 <= value < 33 || value !== "") {
        return (this.addSiteForm.chargeAmount = 1);
      } else {
        return false;
      }
    },
    //取消
    resetForm(formName) {
      // 移除表单校验
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.addSiteForm.chargeAmount = "";
      this.dialogAddVisible = false;
    },
    //申请提现
    submitAdd(formName) {
      let _this = this;
      // console.log(formName);
      this.addSiteForm.md5Code = this.$md5(
        `${this.addSiteForm.id}${this.addSiteForm.withdrawalAccountNumber}${this.addSiteForm.receivingBank}${this.addSiteForm.withdrawalPhone}${this.addSiteForm.withdrawal}`
      );
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveWithdrawalRecord(
            this.addSiteForm.withdrawal,
            this.addSiteForm.receivingBank,
            this.addSiteForm.withdrawalAccountNumber,
            this.addSiteForm.withdrawalPhone,
            this.addSiteForm.chargeAmount,
            this.addSiteForm.id,
            this.addSiteForm.md5Code
          ).then((res) => {
            this.fetchData();
            this.getWithdrawalAmount();
            this.dialogAddVisible = false;
          });
        } else {
          return false;
        }
      });
      this.addSiteForm.chargeAmount = "";
    },
    selectedzhiClick() {
      this.zhifubao = true;
      this.wangyin = false;
      this.huikuan = false;
    },
    selectedyinClick() {
      this.zhifubao = false;
      this.wangyin = true;
      this.huikuan = false;
    },
    selectedhuiClick() {
      this.zhifubao = false;
      this.wangyin = false;
      this.huikuan = true;
    },
  },
  watch: {
    timetotime: function(newV) {
      //把接收到的时间信息一分为二的给startTime和endTime
      if (newV) {
        this.searchMap.startTime = dateFilter(newV[0].getTime());
        this.searchMap.endTime = dateFilter(newV[1].getTime());
      } else {
        //清空时间
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
      this.fetchData();
    },
  },
};
</script>

<style lang="scss">
.table {
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
}
.elDialog {
  width: 530px;
  .el-form-item__label {
    font-size: 14px;
    margin-left: 10px;
    color: rgba(39, 39, 39, 1);
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
  }
  .el-dialog__title {
    padding-left: 30px;
  }
  .el-select {
    width: 230px;
    margin-left: 15px;
  }
  .advancs {
    .el-form-item__error {
      position: absolute;
      top: 40px;
      left: 85px;
    }
  }
  .bankCard {
    .el-form-item__error {
      position: absolute;
      top: 60;
      left: 85px;
    }
  }
  .bankPhone {
    .el-form-item__error {
      position: absolute;
      top: 60;
      left: 155px;
    }
  }
}
.daoqi2 {
  .el-form-item__label {
    padding-right: 0;
  }
  .el-range-editor.el-input__inner {
    margin-left: 20px;
  }
}
</style>

<style lang="scss" scoped>
.withdrawCash {
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
    padding: 0 20px 20px;
    font-size: 14px;
    color: #272727;
    .allMoney {
      .iconqian {
        color: #00a896;
        font-size: 18px;
        font-weight: 400;
      }
      .money {
        margin: 0 50px 0 4px;
        color: #00a896;
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    color: #020202;
  }

  .daoqi2 {
    display: flex;
    padding: 0 0px 20px;
    .search {
      position: relative;
      i {
        position: absolute;
        right: 14px;
        top: 8px;
        z-index: 99;
        font-size: 24px;
        color: rgba(0, 168, 150, 1);
      }
      .el-input {
        width: 220px;
        margin-left: 20px;
      }
    }
  }
  .mark {
    padding: 29px 48px;
    border-radius: 4px;
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
  .thisAdvance {
    width: 300px;
    margin: 20px 0 0 60px;
    span {
      color: #00a896;
      font-size: 16px;
      font-weight: 700;
      margin-left: 15px;
    }
  }
  .advancs {
    margin: 20px 0 0 80px;
    .el-input {
      width: 300px;
      margin-left: 15px;
    }
    p {
      margin: 15px 0 0 85px;
    }
  }
  .bank {
    margin: 15px 0 0 80px;
  }
  .bankCard {
    margin: 20px 0 0 80px;
    .el-input {
      width: 300px;
      margin-left: 15px;
    }
  }
  .bankPhone {
    margin: 20px 0 0 10px;
    .el-input {
      width: 300px;
      margin-left: 15px;
    }
  }
  .brokerage {
    margin: 20px 0 0 90px;
    span:nth-child(1) {
      color: #00a896;
      font-weight: 700;
      font-size: 14px;
      margin: 0 15px;
    }
  }
  .expectDate {
    margin: 20px 0 0 50px;
    span {
      margin-left: 15px;
    }
  }
  .dialog-footer {
    height: 40px;
    margin-top: 20px;
    .el-button:nth-child(1) {
      width: 100px;
      margin-right: 30px;
    }
    .el-button:nth-child(2) {
      width: 100px;
      background-color: #00a896;
    }
  }
}
.advanceBtn {
  .el-button {
    color: #fff;
    width: 90px;
    background: rgba(0, 174, 120, 1);
    border-radius: 3px;
    margin-top: 20px;
  }
}
.tal {
  text-align: left !important;
  padding-bottom: 30px !important;
}
</style>
