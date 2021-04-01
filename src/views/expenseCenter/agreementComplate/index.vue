<template>
  <div class="agreement">
    <div class="order-title">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      申请合同
    </div>
    <div>已选择以下共{{ applicationList.count }}个订单/账单</div>
    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="orderNumber" label="订单号"></el-table-column>
        <el-table-column prop="productName" label="产品"></el-table-column>
        <el-table-column prop="orderQuantity" label="数量"></el-table-column>
        <el-table-column
          prop="orderDetails"
          label="具体详情"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="购买方式"
          :filters="purchList"
          column-key="type"
          :filter-multiple="false"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            {{ scope.row.type | purchListFilter }}
          </template></el-table-column
        >
        <el-table-column prop="orderAmount" label="价格"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.insertTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="支付/开通时间">
          <template slot-scope="scope">
            {{ scope.row.paymentTime | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
      <div class="totalMoney">
        合同总金额: <span>￥{{ applicationList.amount.toFixed(2)}}</span>
      </div>
    </div>
    <el-button class="footer" @click="dataSetClick">确认申请</el-button>

    <!-- 确认申请弹框 -->
    <el-dialog
      title="确认信息"
      :visible.sync="dialogVisible"
      width="526px"
      center
      class="contract-dialog"
    >
      <div class="dialog-select">
        <div class="input-wrap">
          <div class="mark">
            提示：
            <br />如需变更合同甲方主体，请通过变更账号实名认证方式完成，变更后原有合同甲方主体会被账号实名认证主体覆盖。
          </div>
        </div>
        <el-form
          :model="contractInfo"
          :rules="rules"
          ref="contractInfo"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="合同主体名称：" prop="contactsSubjectName">
            <el-input
              v-model="contractInfo.contactsSubjectName"
              placeholder="请填写合同主体名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contacts">
            <el-input
              v-model="contractInfo.contacts"
              placeholder="请填写联系人"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactNumber">
            <el-input
              v-model="contractInfo.contactNumber"
              placeholder="请填写联系电话"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="contactsAddress">
            <el-input
              v-model="contractInfo.contactsAddress"
              placeholder="请填写地址"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="applyContract('contractInfo')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTobeContractList, applyContract } from "@/api/contract.js";
export default {
  data() {
    let mobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (value.length < 11) {
          callback(new Error("请输入正确格式的手机号"));
        } else {
          const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正确格式的手机号"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      list: [],
      applicationList: {},
      dialogVisible: false,
      contractInfo: {
        contactNumber: "",
        contacts: "",
        contactsAddress: "",
        contactsSubjectName: "",
      },
      rules: {
        contactsSubjectName: [
          { required: true, message: "请填写合同主体名称", trigger: "blur" },
        ],
        contacts: [
          { required: true, message: "请填写联系人", trigger: "blur" },
        ],
        contactNumber: [
          {
            required: true,
            validator: mobile,
            trigger: "blur",
          },
        ],
        contactsAddress: [
          { required: true, message: "请填写地址", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    managements() {
      return this.list.map((item) => item.id);
    },
    // purchText() {
    //   if (this.list.type === "") {
    //     return "购买方式";
    //   } else {
    //     return this.$store.state.purchList[this.list.type];
    //   }
    // },
    purchList() {
      return this.$store.state.purchList;
    },
  },
  created() {
    this.applicationList = this.$route.query.data;
    this.list = this.applicationList.tobeContractManagements;
  },
  mounted() {},
  methods: {
    applyContract(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.managements !== "") {
            let _params = {
              managements: this.managements,
              contactNumber: this.contractInfo.contactNumber,
              contacts: this.contractInfo.contacts,
              contactsAddress: this.contractInfo.contactsAddress,
              contactsSubjectName: this.contractInfo.contactsSubjectName,
            };
            applyContract(_params).then((res) => {
              this.dialogVisible = false;
              this.$router.push("/expenseCenter/agreementApplication");
            });
          }
        } else {
          return;
        }
      });
    },
    dataSetClick() {
      this.dialogVisible = true;
    },
    filterTag(value, row) {
      return true;
    },
  },
};
</script>

<style lang="scss">
.contract-dialog {
  .el-form {
    flex-direction: column;
    .el-form-item {
      margin-top: 20px;
    }
  }
}
.agreement {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
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
  .el-dialog__footer {
    padding-bottom: 50px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }

  .el-dialog .el-textarea__inner {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.agreement {
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
  .table {
    padding: 20px 0 30px;
    .table-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: bottom;
      cursor: pointer;
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
    .totalMoney {
      margin-top: 20px;
      span {
        color: #00a896;
      }
    }
  }
  .footer {
    width: 120px;
    margin-left: 45%;
    border-radius: 0;
    background-color: #00a795;
    color: #fff;
  }
  .dialog-select {
    padding: 0px 40px 20px;
    .input-wrap {
      margin-bottom: 0;
      padding: 30px 0px 0;
      .mark {
        text-align: left;
        padding: 13px 16px;
        background-color: #e5f6f4;
      }
      ul {
        text-align: left;
        li {
          display: flex;
          font-size: 14px;
          font-weight: 700;
          color: rgba(39, 39, 39, 1);
          line-height: 36px;
          .addr {
            padding: 10px 10px 0 0;
          }
          .linkage-wraper {
            width: 80%;
            .linkage {
              display: flex;
              justify-content: space-between;
              width: 100%;
              padding: 10px 0 16px;
              .el-select {
                width: 104px;
              }
            }
          }
          span {
            font-size: 12px;
            font-weight: 400;
            margin-left: 16px;
          }
        }
      }
    }
  }
  .dialog-footer {
    .el-button {
      color: #fff;
      width: 174px;
      height: 39px;
      background: #00a795;
      border-radius: 3px;
    }
  }
}
.el-form {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .el-form-item {
    margin-bottom: 0;
    .el-select {
      width: 120px;
    }
  }
}
</style>
