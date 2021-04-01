<template>
  <div class="order-overview">
    <div class="order-title">订单总览</div>
    <div class="order-search">
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
        <el-form-item label-width="0">
          <i class="icon-search pointer" @click="searchData"></i>
          <el-input v-model="searchMap.orderNumber"></el-input>
        </el-form-item>
      </el-form>
      <div class="order-export pointer" @click="gotoExport">
        导出
        <img src="@/assets/images/expense/daochu.png" alt />
      </div>
    </div>
    <div class="table">
      <el-table
        :data="list"
        border
        stripe
        style="width: 100%"
        @filter-change="statusFilter"
      >
        <el-table-column
          prop="orderNumber"
          label="订单号"
          min-width="140"
        ></el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="orderStatus"
          :label="orderStatusText"
          :filters="orderStatusList"
          column-key="orderStatus"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="
            searchMap.orderStatus == '' ? [] : [searchMap.orderStatus]
          "
        >
          <template slot-scope="scope">
            {{ scope.row.orderStatus | orderStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="订单创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.orderCreationTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="支付/开通时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.paymentTime | dateFilter }}
          </template></el-table-column
        >
        <el-table-column
          prop="orderType"
          :label="orderTypeText"
          :filters="orderTypeList"
          column-key="orderType"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="
            searchMap.orderType == '' ? [] : [searchMap.orderType]
          "
        >
          <template slot-scope="scope">
            {{ scope.row.orderType | orderTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="金额（元）"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="pointer" @click="handleDetail(scope.row.orderNumber)"
              >详情</span
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import { getOrderList, downLoadOrderExport } from "@/api/order.js";
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      total: 0,
      dateSearch: [],
      searchMap: {
        orderNumber: "",
        orderStatus: "",
        orderType: "",
        startTime: "",
        endTime: "",
      },
      list: [],
    };
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
      this.searchData();
    },
  },
  computed: {
    orderStatusText() {
      if (this.searchMap.orderStatus === "") {
        return "订单状态";
      } else {
        return this.$store.state.orderStatusList[this.searchMap.orderStatus]
          .text;
      }
    },
    orderTypeText() {
      if (this.searchMap.orderType === "") {
        return "订单类型";
      } else {
        return this.$store.state.orderTypeList[this.searchMap.orderType].text;
      }
    },
    // 订单状态
    orderStatusList() {
      return this.$store.state.orderStatusList;
    },
    // 订单类型
    orderTypeList() {
      return this.$store.state.orderTypeList;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      getOrderList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.orderNumber,
        this.searchMap.orderStatus,
        this.searchMap.orderType,
        this.searchMap.startTime,
        this.searchMap.endTime
      ).then((res) => {
        // console.log(res.data.rows)
        this.list = res.data.rows;
        this.total = res.data.total;
      });
    },
    //导出域名信息
    async gotoExport() {
      const { data: orderRes } = await downLoadOrderExport(
        this.searchMap.orderNumber,
        this.searchMap.orderStatus,
        this.searchMap.orderType,
        this.searchMap.startTime,
        this.searchMap.endTime
      );
      this.$router.push("/expenseCenter/exportRecord");
    },
    statusFilter(filter) {
      if (filter.orderStatus) {
        if (filter.orderStatus.length === 1) {
          this.searchMap.orderStatus = filter.orderStatus[0];
        } else {
          this.searchMap.orderStatus = "";
        }
      }
      if (filter.orderType) {
        if (filter.orderType.length === 1) {
          this.searchMap.orderType = filter.orderType[0];
        } else {
          this.searchMap.orderType = "";
        }
      }
      this.searchData();
    },
    filterTag() {
      return true;
    },
    filterType(value, row) {
      return row.type === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(orderNumber) {
      this.$router.push({
        path: "/expenseCenter/orderDetail",
        query: { orderNumber: orderNumber },
      });
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
}
</style>

<style lang="scss" scoped>
.order-overview {
  background-color: #fff;
  .order-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .order-search {
    display: flex;
    padding: 0 30px;
    .order-export {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: rgba(39, 39, 39, 1);
      img {
        margin-left: 20px;
      }
    }
  }
  .table {
    padding: 30px;
    span {
      color: #45a2fa;
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
