<template>
  <div class="invoice-application">
    <div class="order-title">申请开票</div>

    <div class="daoqi">
      <el-form ref="form" label-width="110px">
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
      <div class="search">
        <i class="el-icon-search pointer" @click="fetchData"></i>
        <el-input v-model="input" placeholder="请输入内容" icon="el-icon-search"></el-input>
      </div>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="选择" width="120">
          <template slot-scope="scope">
            <div
              class="table-circle"
              :class="{ 'table-active' : scope.row.bool }"
              @click="selectedClick(scope.row.id)"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="订单编号"></el-table-column>
        <el-table-column prop="productName" label="类型"></el-table-column>
        <el-table-column prop="createdTime" label="产品"></el-table-column>
        <el-table-column prop="payTime" label="实付金额"></el-table-column>
        <el-table-column prop="payTime" label="可申请开票金额"></el-table-column>
        <el-table-column prop="createdTime" label="订单支付时间"></el-table-column>
      </el-table>
    </div>

    <div class="order-footer pointer" @click="dataSetClick">下一步</div>

    <el-dialog title="确认信息" :visible.sync="dialogVisible" width="500px" center>
      <div class="dialog-select">
        <div class="input-wrap">
          <ul>
            <li>
              发票抬头：
              <span>*****有限公司</span>
            </li>
            <li>
              开具类型：
              <span>企业</span>
            </li>
            <li>
              发票类型：
              <span>增值税普通发票</span>
            </li>
            <li>
              税务登记证号：
              <span>*****</span>
            </li>
            <li>
              开户银行名称：
              <span>*******</span>
            </li>
            <li>
              基本开户账号：
              <span>*******</span>
            </li>
            <li>
              注册场所地址：
              <span>*******</span>
            </li>
            <li>
              注册固定电话：
              <span>*******</span>
            </li>
            <li>
              <strong class="remark">备注：</strong>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="textarea"
              ></el-input>
            </li>
          </ul>
        </div>
        <div class="input-wrap">
          <ul>
            <li>
              邮寄地址：
              <span>*****</span>
              <span class="change pointer" @click="changeClick">修改</span>
            </li>
            <li>
              联系人：
              <span>******</span>
            </li>
            <li>
              联系方式：
              <span>*******</span>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      input: "",
      value1: "",
      textarea: "",
      tableData: [
        {
          id: 0,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "取消",
          money: "256.00",
          bool: false
        },
        {
          id: 1,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "续费",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "处理中",
          money: "256.00",
          bool: false
        },
        {
          id: 3,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "升级",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00",
          bool: false
        }
      ]
    };
  },
  methods: {
    fetchData() {
    },
    selectedClick(id) {
      this.tableData.forEach(item => {
        if (item.id === id) {
          item.bool = !item.bool;
        }
      });
    },
    dataSetClick() {
      this.dialogVisible = true;
    },
    changeClick() {
    }
  }
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
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
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
  padding: 0px 80px;
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
        .change {
          color: #00a896;
          margin-left: auto;
          font-size: 12px;
          line-height: 28px;
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
