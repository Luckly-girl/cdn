<template>
  <div class="order-detail">
    <div>
      <div class="order-title">订单详情</div>
      <div class="table">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="product" label="产品" width="320"></el-table-column>
          <el-table-column prop="productNum" label="数量" width="120"></el-table-column>
          <el-table-column prop="detail" label="具体详情"></el-table-column>
          <el-table-column prop="payType" label="购买方式"></el-table-column>
          <el-table-column prop="time" label="起止时间" width="200"></el-table-column>
          <el-table-column prop="money" label="金额"></el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <div class="order-title">相关信息</div>
      <div class="detail">
        <ul>
          <li>
            订单编号：
            <span>200369901540559</span>
          </li>
          <li>
            原价：
            <span>500.00</span>
          </li>
          <li>
            订单类型：
            <span>新购</span>
          </li>
          <li>
            代金券：
            <span>360.00</span>
          </li>
          <li>
            创建时间：
            <span>2020-1-2 12:25:25</span>
          </li>
          <li>
            应付：
            <span>200.00</span>
          </li>
          <li>
            支付时间：
            <span>2020-1-2 12:25:25</span>
          </li>
          <li>
            已支付：
            <span>￥200.00</span>
          </li>
          <li>
            订单来源：
            <span></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: "",
      searchForm: {
        value1: "",
        orderNum: ""
      },
      tableData: [
        {
          product: "CDN基础版 实例名称：103505863115",
          productNum: "1",
          detail: "200M流量",
          payType: "按量",
          time: "2020-01-02 12:25:30",
          money: "256.00"
        },
        {
          product: "CDN基础版 实例名称：103505863115",
          productNum: "1",
          detail: "200M流量",
          payType: "按量",
          time: "2020-01-02 12:25:30",
          money: "256.00"
        },
        {
          product: "CDN基础版 实例名称：103505863115",
          productNum: "1",
          detail: "200M流量",
          payType: "按量",
          time: "2020-01-02 12:25:30",
          money: "256.00"
        },
        {
          product: "CDN基础版 实例名称：103505863115",
          productNum: "1",
          detail: "200M流量",
          payType: "按量",
          time: "2020-01-02 12:25:30",
          money: "256.00"
        },
        
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
.order-detail {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }

  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
    font-size: 12px;
    color: rgba(113, 113, 113, 1);
  }

  .el-table th > .cell {
    font-size: 14px;
  }

  .el-table--enable-row-transition .el-table__body td {
    height: 55px;
  }
}
</style>


<style lang="scss" scoped>
.order-detail {
  background-color: #fff;
  .order-title {
    text-align: center;
    padding-top: 20px;
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
  .detail {
    padding: 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 520px;
      margin: 0 auto;
      // border: 1px solid red;
      li {
        width: 220px;
        margin-right: 76px;
        // border: 1px solid pink;
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
