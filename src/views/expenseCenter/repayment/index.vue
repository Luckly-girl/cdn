<template>
  <div class="repayment">
    <div class="order-title">续费管理</div>
    <div class="daoqi">
      <ul>
        <li
          v-for="(item, index) in daoqiList"
          :key="index"
          :class="{ active: index === expirationDate }"
          @click="daoqiClick(index)"
        >
          {{ item }}
        </li>
      </ul>
      <div class="search">
        <i class="el-icon-search pointer"></i>
        <el-input
          v-model="input"
          placeholder="请输入内容"
          icon="el-icon-search"
        ></el-input>
      </div>
    </div>
    <div class="daoqi">
      <ul>
        <li
          v-for="(item, value) in xufeiList"
          :key="value"
          :class="{ active: value === renewalType }"
          @click="xufeiClick(value)"
        >
          {{ item.text }}
        </li>
      </ul>
      <div class="date-set pointer" @click="dataSetClick">统一到期日设置</div>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="productName" label="待续费产品">
          <template slot-scope="scope">
            <div
              class="table-circle"
              :class="{ 'table-active': scope.row.bool }"
              @click="selectedClick(scope.row.id)"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
              {{ scope.row.productName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="地域"></el-table-column>
        <el-table-column label="倒计时" width="200" prop="endTime">
          <!-- <template slot-scope="scope">
            {{ scope.row.endTime }}
          </template> -->
          <!-- {{ day }}天{{ hr }}小时{{ min }}分{{ sec }}秒 -->
        </el-table-column>

        <el-table-column
          prop="expirationDate"
          label="到期时间"
          width="200"
        ></el-table-column>
        <el-table-column prop="operate" label="操作" min-width="110px">
          <template slot-scope="scope">
            <span @click="handleDetail(scope.row.id)">续费</span>
            <span @click="handleDetail(scope.row.id)">开通自动学费</span>
            <span @click="handleDetail(scope.row.id)">不续费</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="pagination" :total="total"></pagination>

    <div class="order-footer">
      <div class="table-circle tal" :class="{ 'table-active': counter > 0 }">
        <div class="outer">
          <div class="inner"></div>
        </div>
        已选中 <span>{{ counter }}</span
        >个
      </div>
      <ul>
        <li>批量续费</li>
        <li>开通自动续费</li>
        <li>设置为不续费</li>
      </ul>
    </div>

    <el-dialog
      title="自动续费统一到期日"
      :visible.sync="dialogVisible"
      width="500px"
      center
    >
      <div class="dialog-select">
        <div class="input-wrap">
          每月
          <el-select v-model="dataValue" placeholder="1">
            <el-option
              v-for="item in dataOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option> </el-select
          >日0点
        </div>

        <div>
          仅支持未过期服务器产品，已过期产品不能使用本设置。每个月1号0点设置完成后，您可以在续费时选择对齐到期日
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">设置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRenewCounts, getRenewList } from "@/api/renew.js";
export default {
  data() {
    return {
      dataOptions: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "5",
          label: "5",
        },
        {
          value: "6",
          label: "6",
        },
        {
          value: "7",
          label: "7",
        },
        {
          value: "8",
          label: "8",
        },
        {
          value: "9",
          label: "9",
        },
        {
          value: "10",
          label: "10",
        },
        {
          value: "11",
          label: "11",
        },
        {
          value: "12",
          label: "12",
        },
        {
          value: "13",
          label: "13",
        },
        {
          value: "14",
          label: "14",
        },
        {
          value: "15",
          label: "15",
        },
        {
          value: "16",
          label: "16",
        },
        {
          value: "17",
          label: "17",
        },
        {
          value: "18",
          label: "18",
        },
        {
          value: "19",
          label: "19",
        },
        {
          value: "20",
          label: "20",
        },
        {
          value: "21",
          label: "21",
        },
        {
          value: "22",
          label: "22",
        },
        {
          value: "23",
          label: "23",
        },
        {
          value: "24",
          label: "24",
        },
        {
          value: "25",
          label: "25",
        },
        {
          value: "26",
          label: "26",
        },
        {
          value: "27",
          label: "27",
        },
        {
          value: "28",
          label: "28",
        },
        {
          value: "29",
          label: "29",
        },
        {
          value: "30",
          label: "30",
        },
      ],
      dataValue: "",
      dialogVisible: false,
      counter: 0,
      input: "",
      total: 0, //总数
      expirationDate: 0, // 默认下标
      renewalType: 0, // 默认下标
      daoqiList: [
        "全部",
        "7天内到期",
        "15天内到期",
        "2个月内到期",
        "3个月内到期",
      ],
      xufeiList: [
        { value: 0, text: "手动续费" },
        { value: 1, text: "自动续费" },
        { value: 2, text: "到期不续费" },
      ],
      value1: "",
      time: "",
      searchForm: {
        value1: "",
        orderNum: "",
      },
      tableData: [],
    };
  },
  created() {
    this.$nextTick(() => {
      this.daoqiClick();
    });
  },
  mounted() {},
  methods: {
    filterType(value, row) {
      return row.type === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(id) {
      // console.log(id);
    },
    async daoqiClick(valTime) {
      this.expirationDate = valTime;

      const { data: repayList } = await getRenewList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.expirationDate,
        this.renewalType
      );
      this.tableData = repayList.rows;
      var interval = setInterval(() => {
        this.tableData.forEach((item) => {
          let end = new Date(item.expirationDate.replace(/-/g, "/")).getTime();
          let now = new Date().getTime();
          this.$set(item, "endTime", this.timeDown(parseInt(end - now) / 1000));
          let time = item.endTime; //倒计时时间戳
          // console.log(time, this.tableData);
        });
      }, 1000);
      this.total = repayList.total;
    },
    //倒计时
    timeDown(time) {
      // let timer = setInterval(() => {
      if (time < 0) {
        return "已到期";
      } else {
        let d = parseInt(time / (24 * 60 * 60));
        let h = parseInt((time / (60 * 60)) % 24);
        let m = parseInt((time / 60) % 60);
        let s = parseInt(time % 60);
        return `${d}天${h}小时${m}分${s}秒`; // 需要修改时间样式的话 ，比如需要什么30分钟倒计时，就只保留分和秒
        // clearInterval(timer);
      }
      // }, 1000);
    },
    async xufeiClick(valType) {
      this.renewalType = valType;
      const { data: repay } = await getRenewCounts(this.renewalType);
    },
    selectedClick(id) {
      this.tableData.forEach((item) => {
        if (item.id === id) {
          item.bool = !item.bool;
        }
      });
      let count = 0;
      this.tableData.map((item) => {
        if (item.bool) {
          count++;
        }
      });
      this.counter = count;
    },
    dataSetClick() {
      this.dialogVisible = true;
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style lang="scss">
.repayment {
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
}
</style>

<style lang="scss" scoped>
.repayment {
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
        height: 30px;
        line-height: 30px;
        padding: 0px 18px;
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 2px;
        font-size: 14px;
        color: rgba(0, 168, 150, 1);
        margin-right: 16px;
        cursor: pointer;
      }
      li.active {
        background-color: rgba(0, 168, 150, 1);
        color: #fff;
      }
    }
    .date-set {
      font-size: 14px;
      color: rgba(0, 168, 150, 1);
    }
  }
  .table {
    padding: 20px 0 30px;
    span {
      cursor: pointer;
      padding: 8px 10px;
      color: #45a2fa;
      margin: 0 2px;
      // border: 1px solid red;
    }
  }
  .order-footer {
    display: flex;
    ul {
      display: flex;
      li {
        cursor: pointer;
        margin-right: 30px;
        font-size: 14px;
        color: rgba(0, 168, 150, 1);
      }
    }
  }
  .tal {
    width: 22%;
    text-align: left;
  }
  .table-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: bottom;
    .outer {
      width: 22px;
      height: 22px;
      margin-right: 20px;
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
.el-form {
  display: flex;
  margin-right: auto;
  .el-form-item {
    margin-right: 20px;
  }
}
.dialog-select {
  .input-wrap {
    margin-bottom: 0;
    .el-select {
      padding: 0 10px;
      text-align: center;
      display: inline-block;
      width: 80px;
      margin-top: 54px;
      // color: rgba(102, 102, 102, 1);
    }
  }

  div {
    width: 320px;
    font-size: 12px;
    color: rgba(126, 126, 126, 1);
    margin: 0 auto 30px;
  }
}
.el-button {
  color: #fff;
  width: 174px;
  height: 39px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
}
</style>
