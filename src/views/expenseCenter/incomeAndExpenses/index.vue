<template>
  <div class="order-overview">
    <div class="order-title">收支明细</div>

    <div class="daoqi">
      <div class="search">
        <i class="el-icon-search pointer" @click="searchData"></i>
        <el-input
          v-model="searchMap.billNumber"
          placeholder="请输入订单/账单号"
          icon="el-icon-search"
        ></el-input>
      </div>
      <div class="order-export pointer" @click="downLoadRevenueExpenseExport">
        导出
        <img src="@/assets/images/expense/daochu.png" alt />
      </div>
    </div>
    <div class="daoqi">
      <ul>
        <li
          v-for="(item, index) in daoqiList"
          :key="index"
          :class="{ active: index === daoqiMark }"
          @click="daoqiClick(index)"
        >
          {{ item }}
        </li>
      </ul>
      <el-form ref="form" label-width="104px">
        <el-form-item label="起止时间选择">
          <el-date-picker
            v-model="dateSearch"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchData"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <div class="select-wraper">
        <div
          class="table-circle tal"
          :class="{ 'table-active': searchMap.none }"
          @click="selectClick"
        >
          <div class="outer">
            <div class="inner"></div>
          </div>
        </div>
        <span>为0费用不显示</span>
        <el-select
          v-model="searchMap.transactionType"
          @change="searchData"
          placeholder="全部交易类型"
          clearable
        >
          <el-option
            v-for="(item, index) in transactionTypeList"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
        <el-select
          v-model="searchMap.amountType"
          placeholder="全部明细"
          @change="searchData"
          clearable
        >
          <el-option
            v-for="(item, index) in amountTypeList"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
      </div>
    </div>

    <div class="table">
      <div class="table-title">
        已选择交易类型汇总：入账合计
        <span class="in">{{ totalAmount.entryAmount }}</span
        >元， 出账合计 <span class="out">{{ totalAmount.accountAmount }}</span
        >元
      </div>
      <el-table
        :data="list"
        @filter-change="statusFilter"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column label="交易时间" min-width="160">
          <template slot-scope="scope">{{
            scope.row.transactionTime | dateFilter
          }}</template>
        </el-table-column>
        <el-table-column label="交易类型">
          <template slot-scope="scope">{{
            scope.row.transactionType | transactionTypeFilter
          }}</template>
        </el-table-column>
        <el-table-column
          :label="tradingText"
          min-width="120"
          prop="tradingChannels"
          :filters="tradingChannelsList"
          column-key="tradingChannels"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="
            searchMap.tradingChannels == '' ? [] : [searchMap.tradingChannels]
          "
        >
          <template slot-scope="scope">{{
            scope.row.tradingChannels | tradingChannelsFilter
          }}</template>
        </el-table-column>
        <el-table-column
          prop="transactionSerialNumber"
          label="交易渠道流水号"
          min-width="140"
        ></el-table-column>
        <el-table-column
          prop="transactionNotes"
          label="交易渠道备注"
          min-width="110"
        ></el-table-column>
        <el-table-column
          prop="billNumber"
          label="订单号"
          min-width="140"
        ></el-table-column>
        <el-table-column
          prop="entryAmount"
          label="入账(元)"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="paymentAmount"
          label="出账(元)"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="availableAmount"
          label="可用余额"
        ></el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import {
  getRevenueAndExpenseList,
  getTotalAmount,
  downLoadRevenueExpenseExport,
} from "@/api/expense.js";
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      isSelected: false,
      daoqiMark: "",
      dateSearch: [],
      // oldVal: [],
      daoqiList: ["上月", "本月"],
      totalAmount: {
        accountAmount: "",
        entryAmount: "",
      },
      list: [],
      total: 0,
      searchMap: {
        billNumber: "",
        none: false,
        startTime: "",
        endTime: "",
        transactionType: "",
        tradingChannels: "",
        amountType: "",
        timeType: "",
      },
    };
  },
  watch: {
    dateSearch(newVal) {
      if (newVal !== null) {
        this.searchMap.startTime = dateFilter(newVal[0].getTime());
        this.searchMap.endTime = dateFilter(newVal[1].getTime());
        this.daoqiMark = "";
        this.searchMap.timeType = "";
      } else {
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
    },
  },
  computed: {
    transactionTypeList() {
      return this.$store.state.transactionTypeList;
    },
    amountTypeList() {
      return this.$store.state.amountTypeList;
    },
    tradingChannelsList() {
      return this.$store.state.tradingChannelsList;
    },
    tradingText() {
      if (this.searchMap.tradingChannels === "") {
        return "交易渠道";
      } else {
        return this.$store.state.tradingChannelsList[
          this.searchMap.tradingChannels
        ].text;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    selectClick() {
      this.searchMap.none = !this.searchMap.none;
      this.searchData();
    },
    searchData(date) {
      if (date !== null) {
        this.$refs.pagination.currentPage = 1;
        // this.startTime=date
        this.fetchData();
      } else {
        this.dateSearch = [];
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
        this.fetchData();
      }
      // console.log(date);
    },
    async fetchData() {
      const { data: resList } = await getRevenueAndExpenseList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.billNumber,
        this.searchMap.none,
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.searchMap.transactionType,
        this.searchMap.tradingChannels,
        this.searchMap.amountType,
        this.searchMap.timeType
      );
      this.list = resList.rows;
      this.total = resList.total;
      const { data: resAmount } = await getTotalAmount(
        this.searchMap.billNumber,
        this.searchMap.none,
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.searchMap.transactionType,
        this.searchMap.tradingChannels,
        this.searchMap.amountType,
        this.searchMap.timeType
      );
      this.totalAmount = resAmount;
    },
    downLoadRevenueExpenseExport() {
      downLoadRevenueExpenseExport(
        this.searchMap.billNumber,
        this.searchMap.none,
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.searchMap.transactionType,
        this.searchMap.tradingChannels,
        this.searchMap.amountType,
        this.searchMap.timeType
      ).then((res) => {
        this.$router.push("/expenseCenter/exportRecord");
      });
    },
    statusFilter(filter) {
      if (filter.tradingChannels) {
        if (filter.tradingChannels.length === 1) {
          this.searchMap.tradingChannels = filter.tradingChannels[0];
        } else {
          this.searchMap.tradingChannels = "";
        }
      }
      this.searchData();
    },
    //时间选择器获取焦点
    // timeData() {
    //   if (this.dateSearch !== null) {
    //     this.daoqiMark = "";
    //   }
    // },
    //时间选择器失去焦点
    // timeBlur() {
    //   this.dateSearch = [];
    // },
    //点击上月本月
    daoqiClick(ind) {
      this.daoqiMark = ind;
      if (this.daoqiMark === 0) {
        this.searchMap.timeType = 1;
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      } else {
        this.searchMap.timeType = 2;
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
      this.searchData();
    },
    filterTag(value, row) {
      return true;
    },
  },
};
</script>

<style lang="scss">
.order-overview {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
  .el-table--enable-row-transition .el-table__body td {
    height: 55px;
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
  .el-range-editor.el-input__inner {
    width: 260px;
  }
}
</style>

<style lang="scss" scoped>
.order-overview {
  padding: 0 30px 30px;
  background-color: #fff;
  .order-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .daoqi {
    display: flex;
    justify-content: space-between;
    padding: 0 20px 20px;
    span {
      font-size: 14px;
      color: rgba(39, 39, 39, 1);
      margin-left: 10px;
    }
    .select-wraper {
      display: flex;
      align-items: center;
      .table-circle {
        display: flex;
        justify-content: center;
        align-items: center;
        .outer {
          width: 22px;
          height: 22px;
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
      .el-select {
        width: 140px;
        margin-left: 10px;
      }
    }
    .order-export {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: rgba(39, 39, 39, 1);
      img {
        margin-left: 20px;
      }
    }
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
    ul {
      display: flex;
      align-items: center;
      li {
        width: 70px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 2px;
        font-size: 14px;
        color: rgba(0, 168, 150, 1);
        margin-right: 10px;
        cursor: pointer;
      }
      li.active {
        background-color: rgba(0, 168, 150, 1);
        color: #fff;
      }
    }
  }
  .table {
    padding: 20px 0 30px;
    .table-title {
      text-align: center;
      padding: 22px 0;
      font-size: 18px;
      font-weight: 700;
      color: rgba(39, 39, 39, 1);
      .in {
        color: #f20909;
      }
      .out {
        color: #31d21c;
      }
    }
    span {
      cursor: pointer;
      padding: 8px 16px;
      color: #45a2fa;
    }
  }
}
.el-form {
  display: flex;
  margin-right: auto;
  .el-form-item {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
