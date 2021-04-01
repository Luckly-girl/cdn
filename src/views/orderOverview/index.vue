<template>
  <div class="order-overview">
    <div class="order-title">订单总览</div>
    <div class="order-search">
      <el-form ref="form" :model="searchForm" label-width="110px">
        <el-form-item label="起止时间选择">
          <el-date-picker
            v-model="searchForm.value1"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0">
          <i class="icon-search pointer" @click="fetchData"></i>
          <el-input v-model="searchForm.orderNum"></el-input>
        </el-form-item>
      </el-form>
      <div class="order-export pointer">
        导出
        <img src="@/assets/images/expense/daochu.png" alt />
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="订单号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="100"
          :filters="[{ text: '新购', value: '新购' }, { text: '续费', value: '续费' }, { text: '升级', value: '升级' }, { text: '降级', value: '降级' }]"
          :filter-method="filterType"
        ></el-table-column>
        <el-table-column prop="createdTime" label="订单创建时间" width="200"></el-table-column>
        <el-table-column prop="payTime" label="支付/开通时间" width="200"></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :filters="[{ text: '待支付', value: '待支付' }, { text: '已支付', value: '已支付' }, { text: '处理中', value: '处理中' }, { text: '取消', value: '取消' }]"
          :filter-method="filterStatus"
        ></el-table-column>
        <el-table-column prop="money" label="金额（元）"></el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <span class="pointer" @click="handleDetail(scope.row.id)">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 100,
      value1: "",
      searchForm: {
        value1: "",
        orderNum: ""
      },
      tableData: [
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "取消",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "续费",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "处理中",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "升级",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "降级",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "已支付",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "降级",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "处理中",
          money: "256.00"
        },
        {
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00"
        }
      ]
    };
  },
  methods: {
    fetchData() {
    },
    filterType(value, row) {
      return row.type === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(id) {
    }
  }
};
</script>

<style lang="scss">
.order-overview {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }

  // .el-table th,
  // .el-table td {
  //   border: 1px solid rgba(229,229,229,1);;
  // }

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
