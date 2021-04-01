<template>
  <div class="invoice">
    <div class="apply">
      <div class="apply-count">
        可申请开发票金额：
        <span>{{ invoiceAmountAvailable }}</span
        >元
      </div>
      <el-tooltip
        class="item"
        effect="light"
        content="请先完善发票信息和寄送信息"
        placement="top-start"
        :disabled="!flag"
      >
        <span class="btnApply">
          <el-button
            class="apply-btn"
            @click="goTo('/expenseCenter/invoiceApplication')"
            :disabled="flag"
          >
            申请开票
          </el-button>
        </span>
      </el-tooltip>
    </div>

    <div class="invoice-info-wraper">
      <div class="invoice-info">
        <div class="invoice-info-title">发票信息</div>
        <div class="invoice-info-detail">
          <ul v-if="flagBill === true">
            <li>默认抬头：{{ this.billType === 1 ? officTitle : myTitle }}</li>
            <li></li>
            <li>
              开具类型：{{
                this.billType === 1
                  ? officTitle + "增值税普通发票"
                  : myTitle + " 增值税普通发票"
              }}
            </li>
          </ul>
          <div v-else-if="flagBill === false">暂无信息</div>
          <div class="change-invoice">
            <span
              class="pointer"
              @click="dialogVisibleFlag = true"
              v-if="flagBill === true"
              >修改开票信息</span
            >
            <span
              class="pointer"
              @click="dialogVisibleFlag = true"
              v-else-if="flagBill === false"
              >新增开票信息</span
            >
          </div>
        </div>
      </div>
      <div class="invoice-info">
        <div class="invoice-info-title">寄送信息</div>
        <div class="invoice-info-detail">
          <ul v-if="flagAddress === true">
            <li>寄送地址：{{ addressInfo.mailingAddress }}</li>
            <li>联系人：{{ addressInfo.contacts }}</li>
            <li>联系电话：{{ addressInfo.contactNumber }}</li>
          </ul>
          <div v-else-if="flagAddress === false">暂无信息</div>
          <div class="change-invoice">
            <span
              class="pointer"
              @click="goTo('/expenseCenter/invoiceInfo')"
              v-if="flagAddress === true"
              >修改</span
            >
            <span
              class="pointer"
              @click="goTo('/expenseCenter/invoiceInfo')"
              v-else-if="flagAddress === false"
              >前往添加</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column label="申请时间" width="180">
          <template slot-scope="scope">{{
            scope.row.applicationTime | dateFilter
          }}</template>
        </el-table-column>
        <el-table-column label="开票类型">
          <template slot-scope="scope">{{ scope.row.billingType }}</template>
        </el-table-column>
        <el-table-column prop="invoiceMoney" label="发票总额"></el-table-column>
        <el-table-column prop="invoiceTitle" label="发票抬头"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{
            scope.row.billingState | billingStateFilter
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <span class="pointer" @click="handleDetail(scope.row.id)"
              >详情</span
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>

    <el-dialog
      title="开票详情"
      :visible.sync="invoiceDialog"
      width="600px"
      center
    >
      <div class="dialog">
        <div class="dialog-title">
          <div>
            申请时间：
            <span>{{ applicationTime }}</span>
          </div>
          <div>
            开票类型：
            <span>{{ billingTypeDetial }}</span>
          </div>
        </div>
        <div class="table">
          <el-table :data="detialList" border stripe style="width: 100%">
            <el-table-column prop="productName" label="产品"></el-table-column>
            <el-table-column prop="invoiceMoney" label="金额"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 新增/修改发票信息 -->
    <el-dialog
      :title="flagBill ? '修改开票信息' : '新增发票信息'"
      :visible.sync="dialogVisibleFlag"
      width="500px"
      center
      :close-on-click-modal="false"
      @open="clickDialog"
      @close="closeDialog('invoiceInfo')"
    >
      <div class="dialog">
        <el-form
          :model="invoiceInfo"
          :rules="rules"
          ref="invoiceInfo"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="开具类型：" prop="billingType">
            <el-radio-group v-model="invoiceInfo.billingType">
              <el-radio :label="0">个人</el-radio>
              <el-radio :label="1">企业</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="发票抬头："
            prop="myTitle"
            v-if="invoiceInfo.billingType === 0"
            ref="addMyTitle"
          >
            <el-input
              v-model="myTitle"
              :disabled="true"
              placeholder="请填写营业执照全称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="发票抬头："
            prop="invoiceTitle"
            v-if="invoiceInfo.billingType === 1"
            ref="addInvoiceTitle"
          >
            <el-input
              v-model="invoiceInfo.invoiceTitle"
              placeholder="请填写营业执照全称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册用户："
            prop="name"
            v-if="invoiceInfo.billingType === 0"
            ref="addName"
          >
            <el-input
              v-model="invoiceInfo.name"
              placeholder="请填写姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="税务登记证号："
            prop="taxRegistrationCertificateNumber"
            v-if="invoiceInfo.billingType === 1"
            ref="addTaxRegistration"
          >
            <el-input
              v-model="invoiceInfo.taxRegistrationCertificateNumber"
              placeholder="请填写有效纳税人识别号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户银行名称："
            prop="bankName"
            v-if="invoiceInfo.billingType === 1"
            ref="addBankName"
          >
            <el-input
              v-model="invoiceInfo.bankName"
              placeholder="请填写您开户许可证上的银行"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="基本开户账户："
            prop="accountOpening"
            v-if="invoiceInfo.billingType === 1"
            ref="addAccountOpening"
          >
            <el-input
              v-model="invoiceInfo.accountOpening"
              placeholder="请填写您开户许可证上的银行账号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册场所地址："
            prop="registeredAddress"
            v-if="invoiceInfo.billingType === 1"
            ref="addRegisteredAddress"
          >
            <el-input
              v-model="invoiceInfo.registeredAddress"
              placeholder="请填写您营业执照上的注册地址"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册固定电话："
            prop="fixedTelephone"
            ref="addFixedTelephone"
          >
            <el-input
              v-model="invoiceInfo.fixedTelephone"
              placeholder="请填写您的有效联系方式"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item
            label="注册固定电话："
            prop="phone"
             v-if="invoiceInfo.billingType === 0"
            ref="addPhone"
          >
            <el-input
              v-model="invoiceInfo.phone"
              placeholder="请填写您的有效联系方式"
            ></el-input>
          </el-form-item> -->

          <el-form-item label-width="50px">
            <el-button class="cancel" @click="cancleClick('invoiceInfo')"
              >取消</el-button
            >
            <el-button @click="subInvoiceInfo('invoiceInfo')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBillingInformation,
  getMailingAddress,
  getInvoiceManagementList,
  getInvoiceDetails,
  setBillingInformation,
} from "@/api/invoice.js";
export default {
  data() {
    return {
      invoiceAmountAvailable: 0,
      addressInfo: {
        mailingAddress: "",
        contactNumber: "",
        contacts: "",
      },
      myName: false,
      flag: false,
      flagBill: false,
      flagAddress: false,
      list: [],
      detialList: [],
      applicationTime: "",
      total: 0,
      invoiceDialog: false,
      dialogVisibleFlag: false,
      billType: "",
      billingTypeDetial: "",
      deepInfo: {},
      myTitle: "个人",
      officTitle: "企业",
      id: "",
      invoiceInfo: {
        billingType: "",
        invoiceType: "",
        invoiceTitle: "",
        taxRegistrationCertificateNumber: "",
        bankName: "",
        accountOpening: "",
        registeredAddress: "",
        fixedTelephone: "",
        name: "",
      },
      rules: {
        invoiceTitle: [
          { required: true, message: "请填写营业执照全称", trigger: "blur" },
        ],
        taxRegistrationCertificateNumber: [
          {
            required: true,
            message: "请填写有效纳税人识别号",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请填写您的姓名",
            trigger: "blur",
          },
        ],
        bankName: [
          {
            required: true,
            message: "请填写您开户许可证上的银行",
            trigger: "blur",
          },
        ],
        accountOpening: [
          {
            required: true,
            message: "请填写您开户许可证上的银行账号",
            trigger: "blur",
          },
        ],
        registeredAddress: [
          {
            required: true,
            message: "请填写您营业执照上的注册地址",
            trigger: "blur",
          },
        ],
        billingType: [
          { required: true, message: "请选择发票开具类型", trigger: "blur" },
        ],
        fixedTelephone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // 这个只能验证手机号
          // { pattern:/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: "请输入合法手机号", trigger: "blur" }
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的手机号/电话号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.getBillingInformation();
      this.getMailingAddress();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    });
  },
  methods: {
    //点击打开新增修改弹框
    clickDialog() {
      this.invoiceInfo = {};
      this.deepInfo = _.cloneDeep(this.invoiceInfo);
      this.dialogVisibleFlag = true;
    },
    // 提交开票信息
    subInvoiceInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _params = {
            id: this.id,
            billingType: this.invoiceInfo.billingType,
            invoiceTitle: this.invoiceInfo.invoiceTitle,
            taxRegistrationCertificateNumber: this.invoiceInfo
              .taxRegistrationCertificateNumber,
            bankName: this.invoiceInfo.bankName,
            accountOpening: this.invoiceInfo.accountOpening,
            registeredAddress: this.invoiceInfo.registeredAddress,
            fixedTelephone: this.invoiceInfo.fixedTelephone,
            name: this.invoiceInfo.name,
          };
          let _query = {
            billingType: this.invoiceInfo.billingType,
            invoiceTitle: this.invoiceInfo.invoiceTitle,
            taxRegistrationCertificateNumber: this.invoiceInfo
              .taxRegistrationCertificateNumber,
            bankName: this.invoiceInfo.bankName,
            accountOpening: this.invoiceInfo.accountOpening,
            registeredAddress: this.invoiceInfo.registeredAddress,
            fixedTelephone: this.invoiceInfo.fixedTelephone,
            name: this.invoiceInfo.name,
          };
          if (this.flagBill === true) {
            this.setBillingInformation(_params);
          } else {
            this.setBillingInformation(_query);
          }
        } else {
          return false;
        }
      });
    },
    //新增、修改发票信息
    setBillingInformation(params) {
      setBillingInformation(params).then((res) => {
        console.log(res, 1111);
        this.getBillingInformation();
        this.dialogVisible = false;
        this.dialogVisibleFlag = false;
      });
    },
    //取消修改
    cancleClick(formName) {
      //方法一
      // if (this.$refs[formName]) {
      //  this.$refs[formName].resetFields();
      //   this.getBillingInformation();
      //   this.dialogVisible = false;
      //   this.dialogVisibleFlag = false;
      // }
      //方法二
      this.dialogVisibleFlag = false;
      // this.$nextTick(() => {
      this.$refs[formName].resetFields();
      // });

      this.invoiceInfo = this.deepInfo;
    },
    //关闭对话框
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisibleFlag = false;
      //方法一
      // this.$refs["invoiceInfo"].resetFields();
      // this.getBillingInformation();
      //方法二
      // this.$nextTick(() => {
      //   this.$refs["invoiceInfo"].resetFields();
      // });
    },
    fetchData() {
      getInvoiceManagementList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        ""
      ).then((res) => {
        this.list = res.data.rows;
        this.total = res.data.total;
        // console.log(this.list);
      });
    },
    // 获取开票信息
    getBillingInformation() {
      getBillingInformation().then((res) => {
        if (res.data.billingInformationStatus === true) {
          this.invoiceInfo = res.data.userBillingInformation;
          this.billType = res.data.userBillingInformation.billingType;
          this.id = res.data.userBillingInformation.id;
          this.flagBill = res.data.billingInformationStatus;
        } else {
          this.flag = true;
        }
        this.invoiceAmountAvailable = res.data.invoiceAmountAvailable;
      });
    },
    //获取邮寄地址
    getMailingAddress() {
      getMailingAddress().then((res) => {
        if (res.data.mailingAddressStatus === true) {
          this.addressInfo = res.data.userMailingAddress;
          this.flagAddress = res.data.mailingAddressStatus;
        } else {
          this.flag = true;
        }
      });
    },
    goTo(path) {
      this.$router.push(path);
    },
    handleDetail(id) {
      getInvoiceDetails(id).then((res) => {
        if (res.code === 200) {
          // console.log(res.data, 11111);
          this.applicationTime = res.data.applicationTime;
          this.detialList = res.data.tobeInvoiceManagements;
          this.billingTypeDetial = res.data.billingType;
        }
      });
      this.invoiceDialog = true;
    },
    handleExport(id) {
      // console.log("导出明细");
    },
  },
};
</script>

<style lang="scss">
.invoice {
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
  .el-form-item__content {
    margin-left: 10px;
  }
  .item {
    margin: 4px;
  }
}
</style>

<style lang="scss" scoped>
.invoice {
  padding: 0 30px 30px;
  background-color: #fff;
  .apply {
    padding-top: 40px;
    .btnApply {
      margin-top: 2px;
      display: inline-block;
    }
    .apply-count {
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
      color: rgba(2, 2, 2, 1);
      span {
        color: #ff0000;
      }
    }

    .apply-btn {
      display: inline-block;
      margin-left: 30px;
      background: #fff;
      border: 1px solid #00a896;
      border-radius: 2px;
      font-size: 14px;
      color: #00a896;
      padding: 10px 20px;
    }
  }
  .invoice-info-wraper {
    display: flex;
    .invoice-info {
      flex: 1;
      margin-top: 30px;
      margin-right: 20px;
      padding: 20px 30px;
      background: rgba(247, 247, 247, 1);
      &:last-child {
        margin-right: 0px;
      }
      .invoice-info-title {
        font-size: 16px;
        font-weight: 700;
        color: #020202;
        margin-bottom: 16px;
      }
      .invoice-info-detail {
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 26%;
            font-size: 12px;
            line-height: 30px;
            color: #272727;
            &:nth-child(odd) {
              width: 72%;
            }
          }
        }
        .change-invoice {
          margin-top: 10px;
          color: #00a896;
          font-size: 14px;
        }
      }
    }
  }

  .table {
    padding: 20px 0 30px;
    span {
      cursor: pointer;
      padding: 8px 16px;
      color: rgba(0, 168, 150, 1);
    }
  }
}
.dialog {
  padding: 26px 55px;
  .dialog-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 700;
    color: #272727;
    span {
      font-weight: 400;
    }
  }
  .el-button {
    color: #fff;
    width: 120px;
    height: 39px;
    background: #00a795;
    border-radius: 3px;
    margin-top: 20px;
  }
  .cancel {
    background-color: #fff;
    color: #00a795;
    border: 1px solid #00a795;
    margin-right: 30px;
  }
}
</style>
