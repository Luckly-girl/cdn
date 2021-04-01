<template>
  <div class="invoice">
    <div class="apply">
      <div class="apply-count">
        可申请开发票金额：
        <span>200.00</span>元
      </div>
      <div class="apply-btn">申请开票</div>
    </div>

    <div class="invoice-info">
      <div class="invoice-info-title">发票信息</div>
      <div class="invoice-info-detail">
        <ul>
          <li>默认抬头：xx（武汉）科技有限公司</li>
          <li>开具类型：企业增值税普通发票</li>
          <li>寄送地址：湖北省武汉市武昌区和平大道22号</li>
          <li>联系电话：xxxxx</li>
          <li>联系人:xxxxx</li>
        </ul>
        <div class="pointer">管理开票信息</div>
      </div>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="time" label="申请时间"></el-table-column>
        <el-table-column prop="in" label="开票类型"></el-table-column>
        <el-table-column prop="out" label="发票总额"></el-table-column>
        <el-table-column prop="out" label="发票抬头"></el-table-column>
        <el-table-column prop="out" label="状态"></el-table-column>
        <el-table-column prop="out" label="发票备注"></el-table-column>
        <el-table-column prop="balance" label="操作">
          <template slot-scope="scope">
            <span class="pointer" @click="handleDownLoad(scope.row.id)">详情</span>
            <span class="pointer" @click="handleDownLoad(scope.row.id)">导出明细</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          time: "2020-01-02 12:25:30",
          type: "充值",
          channel: "余额",
          channelNum: "2020010217582",
          mark: "续费",
          orderNum: "2020010217582",
          in: "200.00",
          out: "256.00",
          balance: "20.00"
        },
        {
          time: "2020-01-02 12:25:30",
          type: "充值",
          channel: "银行转账",
          channelNum: "2020010217582",
          mark: "续费",
          orderNum: "2020010217582",
          in: "200.00",
          out: "256.00",
          balance: "20.00"
        },
        {
          time: "2020-01-02 12:25:30",
          type: "充值",
          channel: "支付宝",
          channelNum: "2020010217582",
          mark: "续费",
          orderNum: "2020010217582",
          in: "200.00",
          out: "256.00",
          balance: "20.00"
        },
        {
          time: "2020-01-02 12:25:30",
          type: "充值",
          channel: "微信",
          channelNum: "2020010217582",
          mark: "续费",
          orderNum: "2020010217582",
          in: "200.00",
          out: "256.00",
          balance: "20.00"
        }
      ]
    };
  },
  methods: {
    fetchData() {
    }
  }
};
</script>

<style lang="scss">
.invoice {
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
}
</style>


<style lang="scss" scoped>
.invoice {
  padding: 0 30px 30px;
  background-color: #fff;
  .apply {
    padding: 40px 120px;
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
  .invoice-info {
    width: 530px;
    height: 130px;
    margin: 10px auto;
    padding: 20px 65px;
    background: rgba(247, 247, 247, 1);
    .invoice-info-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(2, 2, 2, 1);
      margin-bottom: 16px;
    }
    .invoice-info-detail {
      display: flex;
      align-items: center;
      justify-content: space-between;
      ul {
        li {
          font-size: 12px;
          line-height: 18px;
          color: rgba(39, 39, 39, 1);
        }
      }
      > div {
        color: #00A896;
        font-size: 14px;
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
</style>
