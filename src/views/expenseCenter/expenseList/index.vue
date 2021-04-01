<template>
  <div class="expense-list">
    <div class="order-title">费用账单</div>

    <div class="daoqi">
      <el-date-picker v-model="month" type="month" value-format="yyyy-MM" placeholder @change="handleChangeMonth"></el-date-picker>
      <ul>
        <li
          v-for="(item, index) in timeTypeList"
          :key="index"
          :class="{ active : item.id === timeType }"
          @click="handleClick(item.id)"
        >{{ item.name }}</li>
      </ul>
      <el-select v-model="feeType" placeholder="请选择" @change="changeType">
        <el-option
          v-for="item in feeTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <div class="echarts">
      <expense-list ref="expense_charts"></expense-list>
    </div>

    <div class="title-wrap">
      <div></div>
      <div class="order-title">{{expenseTitle}}账单汇总</div>
      <div class="order-export pointer" @click="dataSetClick">
        导出pdf
        <img src="@/assets/images/expense/daochu.png" alt />
      </div>
    </div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="billTime" label="账期"></el-table-column>
        <el-table-column prop="originalAmount" label="原价"></el-table-column>
        <el-table-column prop="favorableAmount" label="优惠金额"></el-table-column>
        <el-table-column prop="eraseAmount" label="抹零金额"></el-table-column>
        <el-table-column prop="amountPayable" label="应付金额"></el-table-column>
        <el-table-column prop="paymentAmount" label="现金支付"></el-table-column>
        <el-table-column prop="voucherAmount" label="代金券抵扣"></el-table-column>
        <el-table-column prop="storedValueCardAmount" label="储值卡支付金额"></el-table-column>
      </el-table>
    </div>

    <el-dialog title="导出月账单PDF" :visible.sync="dialogVisible" width="500px" center>
      <div class="dialog-select">
        <div class="input-wrap">
          <div class="point">
            <img src="@/assets/images/expense/alert 2.png" alt />提示：月账单PDF在次月初生成，在次月4日10点后可导出。
          </div>

          <div class="bill">
            <div>账单</div>
            <el-date-picker
              v-model="dateSearch"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="bill">
            <div>验证码</div>
            <div>
              <el-input v-model="searchMap.verifyCode" placeholder="验证码" maxlength="4"></el-input>
              <div class="bill-img">
                <img :src="verifyCode" alt />
              </div>
              <span @click="getVerifyCode">看不清楚，换一张</span>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button class="confirm" @click="downLoadExpenseBillExport">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExpenseBill,
  getVerifyCode,
  downLoadExpenseBillExport
} from "@/api/expense.js";
import { dateFilter } from "@/filters";
export default {
  components: {
    expenseList: () => import("./components/expense-list")
  },
  data() {
    return {
      dialogVisible: false,
      month: '',
      timeType: 2,
      verifyCode: '',
      timeTypeList: [{
        name: "近半年",
        id: 1
      }, 
      {
        name: "近一年",
        id: 2
      }],
      feeType: 'amountPayable',
      feeTypeList: [
        {
          label: '全部',
          value: 'amountPayable'
        },
        {
          label: '现金',
          value: 'paymentAmount'
        },
        {
          label: '代金券',
          value: 'voucherAmount'
        },
        {
          label: '储值卡',
          value: 'storedValueCardAmount'
        }
      ],
      dateSearch: [],
      searchMap: {
        startTime: '',
        endTime: '',
        verifyCode: ''
      },
      list: [],
      xdata: [],
      ydata: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData()
    })
  },
  computed: {
    expenseTitle() {
      if (this.timeType == 0) {
        return this.month.replace(/-/, '年') + '月'
      } else {
        return this.timeTypeList.filter(item => { return this.timeType === item.id})[0].name
      }
    }
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.searchMap.startTime = val[0];
        this.searchMap.endTime = val[1];
      } else {
        this.searchMap.startTime = "";
        this.searchMap.startTime = "";
      }
    }
  },
  methods: {
    fetchData() {
      getExpenseBill(this.timeType, this.month).then(res => {
        this.list = res.data
        this.xdata = res.data.map((item) => {
          return item.billTime
        })
        this.ydata = res.data.map((item) => {
          return item[this.feeType]
        })
        this.$refs.expense_charts.drawLine(this.xdata, this.ydata)
      })
    },
    changeType() {
      this.ydata = this.list.map((item) => {
        return item[this.feeType]
      })
      this.$refs.expense_charts.drawLine(this.xdata, this.ydata)
    },
    filterType(value, row) {
      return row.type === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(id) {
    },
    handleChangeMonth(month) {
      if (!this.month) {
        this.month = ''
        this.timeType = 2
      } else {
        this.timeType = 0
      }
      this.fetchData()
    },
    handleClick(id) {
      this.timeType = id;
      if (!this.timeType) {
        this.timeType = 0
      } else {
        this.month = ''
      }
      this.fetchData()
    },
    xufeiClick(ind) {
      this.xufeiMark = ind;
    },
    selectedClick(id) {
      this.tableData.forEach(item => {
        if (item.id === id) {
          item.bool = !item.bool;
        }
      });
      let count = 0;
      this.tableData.map(item => {
        if (item.bool) {
          count++;
        }
      });
      this.counter = count;
    },
    dataSetClick() {
      this.getVerifyCode()
      this.dialogVisible = true;
    },
    getVerifyCode() {
      getVerifyCode().then(res => {
        this.verifyCode = `data:image/jpg;base64,${res.data}`
      })
    },
    downLoadExpenseBillExport() {
      downLoadExpenseBillExport(
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.searchMap.verifyCode
      ).then(res => {
        this.dialogVisible = false
        this.$router.push('/expenseCenter/exportRecord')
      })
    }
  }
};
</script>

<style lang="scss">
.expense-list {
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

  .el-date-editor.el-input {
    width: 160px;
  }

}
</style>


<style lang="scss" scoped>
.expense-list {
  padding: 0 30px 30px;
  background-color: #fff;
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .order-title {
      padding-bottom: 20px;
    }
  }
  .order-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
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
  .daoqi {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 20px;
    ul {
      display: flex;
      align-items: center;
      margin: 0 10px;
      li {
        height: 30px;
        line-height: 30px;
        padding: 0px 20px;
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 2px;
        font-size: 14px;
        color: rgba(0, 168, 150, 1);
        margin: 0 5px;
        cursor: pointer;
      }
      li.active {
        background-color: rgba(0, 168, 150, 1);
        color: #fff;
      }
    }
  }
  .echarts {
    margin-bottom: 30px;
  }
  .table {
    padding: 30px 0;
    span {
      cursor: pointer;
      padding: 8px 16px;
      color: #45a2fa;
    }
  }
}
.dialog-select {
  .input-wrap {
    margin-bottom: 0;
    width: 346px;
    margin: 0 auto;
    .bill {
      width: 330px;
      margin: 26px auto;
      font-size: 14px;
      color: rgba(126, 126, 126, 1);

      > div {
        display: flex;
        align-items: center;
        padding: 0 4px;
        margin-bottom: 16px;
        .el-input {
          width: 100px;
        }
        .bill-img {
          width: 100px;
          height: 40px;
          margin: 0 10px;
        }
        span {
          cursor: pointer;
          font-size: 12px;
          color: rgba(126, 126, 126, 1);
        }
      }
    }
    .point {
      display: flex;
      align-items: center;
      justify-items: center;
      padding-top: 20px;
      font-size: 12px;
      color: rgba(255, 106, 0, 1);
      img {
        padding-right: 6px;
      }
    }
    .el-select {
      padding: 0 10px;
      text-align: center;
      display: inline-block;
      width: 80px;
      margin-top: 54px;
    }
  }
}
.el-button {
  width: 105px;
  height: 40px;
  color: rgba(32, 32, 32, 1);
  border-radius: 3px;
  margin: 0 50px;
}
.el-button.confirm {
  background: rgba(0, 174, 120, 1);
  color: #fff;
}
.el-select {
  width: 100px;
}
</style>
