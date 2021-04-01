<template>
  <div class="details-of-dosage">
    <div class="order-title">用量明细</div>

    <div class="daoqi">
      <div class="search">
        <i class="el-icon-search pointer" @click="fetchData"></i>
        <el-input v-model="input" placeholder="请输入内容" icon="el-icon-search"></el-input>
      </div>
      <el-form ref="form"  label-width="110px">
        <el-form-item label="起止时间选择">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="time" label="产品名"></el-table-column>
        <el-table-column prop="in" label="开始时间"></el-table-column>
        <el-table-column prop="out" label="截止时间"></el-table-column>
        <el-table-column prop="balance" label="用量明细">
          <template slot-scope="scope">
            <span class="pointer" @click="handleDownLoad(scope.row.id)">下载</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="mark">系统仅保存6个月内的数据，如有需要请您及时下载和做好用量明细数据的本地保存。导出文件格式为CSV，可以使用Excel等工具查看。</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      value1: "",
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
    },
  }
};
</script>

<style lang="scss">
.details-of-dosage {
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
    width: 280px;
  }
}
</style>


<style lang="scss" scoped>
.details-of-dosage {
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
      margin: 0 10px;
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
  }
  .table {
    padding: 20px 0 30px;
    span {
      cursor: pointer;
      padding: 8px 16px;
      color: rgba(0, 168, 150, 1);
    }
    .mark {
      font-size: 12px;
      color: rgba(80, 80, 80, 1);
      line-height: 56px;
    }
  }
}
.el-form {
  display: flex;
  .el-form-item {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
