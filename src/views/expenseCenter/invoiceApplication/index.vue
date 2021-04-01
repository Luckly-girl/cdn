<template>
  <div class="invoice-application">
    <div class="order-title">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      申请开票
    </div>

    <div class="daoqi">
      <el-form ref="form" label-width="110px">
        <el-form-item label="起止时间选择">
          <el-date-picker
            v-model="dateSearch"
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
          v-model="searchMap.orderNumber"
          placeholder="请输入订单号"
          icon="el-icon-search"
        ></el-input>
      </div>
    </div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="选择" width="120">
          <template slot-scope="scope">
            <div
              class="table-circle"
              :class="{ 'table-active': scope.row.check }"
              @click="selectedClick(scope.row.id)"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
        <el-table-column prop="productName" label="产品"></el-table-column>
        <el-table-column prop="payMoney" label="实付金额"></el-table-column>
        <el-table-column
          prop="invoiceMoney"
          label="可申请开票金额"
        ></el-table-column>
        <el-table-column label="订单支付时间">
          <template slot-scope="scope">
            {{ scope.row.paymentTime | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
    <el-button
      class="order-footer"
      @click="dataSetClick"
      :disabled="invoiceIds.length < 1"
      >下一步</el-button
    >

    <el-dialog
      title="确认信息"
      :visible.sync="dialogVisible"
      width="500px"
      center
    >
      <div class="dialog-select">
        <div class="input-wrap">
          <ul>
            <li v-show="billingType === 0">
              发票抬头：
              <span>{{ myTitle }}</span>
            </li>
            <li v-show="billingType === 1">
              发票抬头：
              <span>{{ invoiceInfo.invoiceTitle }}</span>
            </li>
            <li>
              开具类型：
              <span>{{ invoiceInfo.billingType | billingTypeFilter }}</span>
            </li>
            <li>
              发票类型：
              <span>增值税普通发票</span>
            </li>
            <li v-show="billingType === 0">
              注册用户：
              <span>{{ invoiceInfo.name }}</span>
            </li>
            <li v-show="billingType === 1">
              税务登记证号：
              <span>{{ invoiceInfo.taxRegistrationCertificateNumber }}</span>
            </li>
            <li v-show="billingType === 1">
              开户银行名称：
              <span>{{ invoiceInfo.bankName }}</span>
            </li>
            <li v-show="billingType === 1">
              基本开户账号：
              <span>{{ invoiceInfo.accountOpening }}</span>
            </li>
            <li v-show="billingType === 1">
              注册场所地址：
              <span>{{ invoiceInfo.registeredAddress }}</span>
            </li>
            <li>
              注册固定电话：
              <span>{{ invoiceInfo.fixedTelephone }}</span>
            </li>
            <li>
              您选取了{{
                checkLength
              }}条订单开具发票（若选中多条订单，订单金额将合并开具在一张票据中）
            </li>
            <li>开票金额合计：￥ {{ invoiceAmountAvailable }}</li>
            <li>
              <strong class="remark">备注：</strong>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="remark"
              ></el-input>
            </li>
          </ul>
        </div>
        <div class="input-wrap">
          <ul>
            <li>
              邮寄地址：
              <span>{{ addressInfo.mailingAddress }}</span>
            </li>
            <li>
              联系人：
              <span>{{ addressInfo.contacts }}</span>
            </li>
            <li>
              联系方式：
              <span>{{ addressInfo.contactNumber }}</span>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="applyInvoiceInformation">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTobeInvoiceManagementList,
  getBillingInformationAndMailingAddress,
  applyInvoiceInformation,
} from "@/api/invoice.js";
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      dialogVisible: false,
      remark: "",
      searchMap: {
        orderNumber: "",
        startTime: "",
        endTime: "",
      },
      dateSearch: [],
      list: [],
      total: 0,
      billingType: "",
      myTitle: "个人",
      invoiceInfo: {
        id: null,
        invoiceTitle: "",
        billingType: "",
        invoiceType: "",
        taxRegistrationCertificateNumber: "",
        bankName: "",
        accountOpening: "",
        registeredAddress: "",
        fixedTelephone: "",
        name: "",
      },
      addressInfo: {
        id: null,
        mailingAddress: "",
        contacts: "",
        contactNumber: "",
      },
      checkLength: 0,
      invoiceAmountAvailable: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.searchMap.startTime = dateFilter(val[0].getTime());
        this.searchMap.endTime = dateFilter(val[1].getTime());
      } else {
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
    },
  },
  computed: {
    invoiceIds() {
      return this.list.filter((item) => item.check).map((item) => item.id);
    },
  },
  methods: {
    fetchData() {
      getTobeInvoiceManagementList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.orderNumber,
        this.searchMap.startTime,
        this.searchMap.endTime
      ).then((res) => {
        this.list = res.data.rows.map((item) => {
          return { ...item, check: false };
        });
        // console.log(this.list);
        this.total = res.data.total;
      });
    },
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    selectedClick(id) {
      this.list.forEach((item) => {
        if (item.id === id) {
          item.check = !item.check;
        }
      });
    },
    dataSetClick() {
      getBillingInformationAndMailingAddress(this.invoiceIds.join(",")).then(
        (res) => {
          this.invoiceInfo = res.data.userBillingInformation;
          this.billingType = res.data.userBillingInformation.billingType;
          this.addressInfo = res.data.userMailingAddress;
          this.invoiceAmountAvailable = res.data.invoiceAmountAvailable;
          this.checkLength = res.data.tobeInvoiceManagements.length;
          this.dialogVisible = true;
        }
      );
    },
    applyInvoiceInformation() {
      let _params = {
        billingInformationId: this.invoiceInfo.id,
        remark: this.remark,
        tobeInvoiceManagements: this.invoiceIds,
        userMailingAddressId: this.addressInfo.id,
      };
      applyInvoiceInformation(_params).then((res) => {
        this.searchData();
        this.dialogVisible = false;
      });
    },
  },
};
</script>

<style lang="scss">
.invoice-application {
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
.invoice-application {
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
  .daoqi {
    display: flex;
    padding: 0 20px 20px;
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
        width: 260px;
      }
    }
  }
  .table {
    padding: 20px 0 30px;
    .table-circle {
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      vertical-align: bottom;
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
  .order-footer {
    width: 135px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin: 25px auto 10px;
    font-size: 14px;
    color: #00a896;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #00a896;
    border-radius: 2px;
  }
}
.el-form {
  display: flex;
  margin-right: auto;
  .el-form-item {
    margin-right: 20px;
  }
}
.dialog-select {
  padding: 0px 40px;
  .input-wrap {
    margin-bottom: 0;
    padding: 30px 30px 16px;
    border-bottom: 1px solid #e5e5e5;
    &:last-child {
      padding-top: 20px;
      border-bottom: none;
    }
    ul {
      text-align: left;
      li {
        display: flex;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 700;
        color: rgba(39, 39, 39, 1);
        line-height: 24px;
        span {
          font-size: 12px;
          font-weight: 400;
          margin-left: 16px;
        }
        .remark {
          font-weight: 700;
          font-size: 12px;
          width: 50px;
        }
      }
    }
  }
}
.el-button {
  color: #fff;
  width: 174px;
  height: 39px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
}
.el-form {
  margin: 0;
  .el-form-item {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
