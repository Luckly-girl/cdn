<template>
  <div class="parameter">
    <div class="top_cook">
      参数检测
      <el-switch
        v-model="onOff"
        active-color="#13ce66"
        inactive-color="#B0B0B0"
        @change="handleChange"
      >
      </el-switch>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="data" label="拦截正则表达式" width="180">
        </el-table-column>
        <el-table-column prop="ruleTag" label="拦截字段"> </el-table-column>
        <el-table-column prop="num" label="拦截次数"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              v-if="scope.row.onOff == 1"
              class="tab_btn"
              @click="closeClick(0, scope.row.id)"
              >启用</span
            >
            <span v-else class="tab_off" @click="openClick(1, scope.row.id)"
              >停止</span
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        :total="total"
        class="pagenation"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { queryErrWafconf, updateWafOnOff, updateWafconf } from "@/api/waf.js";
export default {
  data() {
    return {
      type: "args",
      onOff: false,
      value: 0,
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    id() {
      return this.$route.query.data;
    },
  },
  methods: {
    //获取列表
    fetchData() {
      queryErrWafconf(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.id,
        this.type
      ).then((res) => {
        this.total = res.data.rows.wafTotal;
        if (res.data.rows.onOff == 1) {
          this.onOff = true;
        } else if (res.data.rows.onOff == 0) {
          this.onOff = false;
        }
      });
    },
    //改变waf开关状态
    handleChange(val) {
      if (val == false) {
        this.onOff = 0;
      } else {
        this.onOff = 1;
      }
      updateWafOnOff(this.id, this.type, this.onOff).then((res) => {});
    },
    //关闭
    closeClick(val, id) {
      updateWafconf(id, val).then((res) => {
        if (res.code == 200) {
          this.fetchData();
        }
      });
    },
    //开启
    openClick(val, id) {
      updateWafconf(id, val).then((res) => {
        if (res.code == 200) {
          this.fetchData();
        }
      });
    },
  },
};
</script>

<style lang="scss">
.parameter {
  .table {
    padding: 20px 0 30px;
    .el-table th > .cell,
    .el-table td > .cell {
      height: 33px;
      text-align: center;
      font-size: 12px;
      color: #717171;
    }

    .el-table th > .cell {
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
    }
    .el-table--enable-row-transition .el-table__body td {
      height: 55px;
    }

    .el-table__body tr.current-row > td {
      background-color: #eee !important;
    }
    .pagenation {
      .el-input {
        width: 70px;
        margin-left: 0;
      }
      .el-input__inner {
        width: 60px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.parameter {
  padding: 20px 30px;
  background-color: #fff;
  .top_cook {
    height: 35px;
    font-size: 14px;
    .el-switch {
      margin-left: 15px;
    }
  }
  .table {
    .tab_btn {
      color: #4d71ee;
    }
    .tab_off {
      color: rgb(177, 173, 173);
    }
  }
}
</style>