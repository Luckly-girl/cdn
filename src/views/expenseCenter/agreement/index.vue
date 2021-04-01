<template>
  <div class="agreement">
    <div class="order-title">合同管理</div>

    <div class="daoqi">
      <el-form>
        <el-form-item label="状态" label-width="50px">
          <el-select
            v-model="contractStatus"
            placeholder="请选择"
            clearable
            @change="fetchData"
          >
            <el-option
              v-for="(item, index) in contractStatusList"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="$router.push('/expenseCenter/agreementApplication')"
            >申请合同</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="contractNumber" label="合同号"></el-table-column>
        <el-table-column label="对应订单">
          <template slot-scope="scope">
            <el-popover placement="right" title width="200" trigger="hover">
              <p
                v-for="(item, index) in scope.row.orderNumber.split(' ')"
                :key="index"
              >
                {{ item }}
              </p>
              <div style="width: 100%" slot="reference">
                <span class="ellipsis-span">{{ scope.row.orderNumber }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.insertTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              title
              width="200"
              trigger="hover"
              v-if="scope.row.contractStatus == 2"
            >
              作废原因：{{ scope.row.cancellationReason }}
              <div style="width: 100%" slot="reference">
                <span @click="handleEdit(0, scope.row)">编辑</span>
              </div>
            </el-popover>
            <em v-else @click="handleEdit(0, scope.row)">编辑</em>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.contractStatus | contractStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="操作">
          <template slot-scope="scope">
            <em
              @click="setContractStatus(scope.row.id)"
              v-if="scope.row.contractStatus == 0"
              >转为正式</em
            >
            <em
              @click="handleEdit(1, scope.row)"
              v-if="scope.row.contractStatus != 2"
              >作废</em
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="pagination" :total="total"></pagination>
    <el-dialog
      :title="dialogType ? '操作' : '编辑备注'"
      :visible.sync="dialogVisible"
      width="538px"
      center
      @closed="init"
    >
      <div class="dialog-select">
        <div class="input-wrap">
          <ul>
            <li>
              <strong class="remark"
                >{{ dialogType ? "作废原因" : "备注信息" }}：</strong
              >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="remark"
              ></el-input>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="subEdit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getContractList,
  setContractStatus,
  updateContractRemark,
} from "@/api/contract.js";
export default {
  data() {
    return {
      dialogType: 0,
      editId: "",
      dialogVisible: false,
      contractStatus: "",
      remark: "",
      list: [],
      total: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    contractStatusList() {
      return this.$store.state.contractStatusList;
    },
  },
  methods: {
    init() {
      this.dialogType = 0;
      this.remark = "";
      this.editId = "";
    },
    setContractStatus(id) {
      setContractStatus(1, id).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
      });
    },
    fetchData() {
      getContractList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.contractStatus
      ).then((res) => {
        if (res.code === 200) {
          this.list = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    subEdit() {
      if (this.dialogType) {
        setContractStatus(2, this.editId, this.remark).then((res) => {
          if (res.code === 200) {
            this.fetchData();
            this.dialogVisible = false;
          }
        });
      } else {
        updateContractRemark(this.editId, this.remark).then((res) => {
          if (res.code === 200) {
            this.fetchData();
            this.dialogVisible = false;
          }
        });
      }
    },
    handleEdit(type, item) {
      this.dialogType = type;
      this.remark = this.dialogType ? "" : item.remark;
      this.editId = item.id;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss">
.agreement {
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
  .el-dialog .el-textarea__inner {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.agreement {
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
  }
  .table {
    padding: 20px 0 30px;
    span,
    em {
      font-style: normal;
      font-size: 12px;
      color: #00a896;
      padding: 0 10px;
      cursor: pointer;
    }
    .ellipsis-span {
      display: block;
      width: 100%;
      color: #333;
      font-size: 14px;
    }
    p {
      text-align: center;
    }
    span {
      display: flex;
      justify-content: center;
    }
  }
}

.el-form {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .el-form-item {
    margin-bottom: 0;
    .el-button {
      color: #00a896;
      width: 120px;
      border: 1px solid #00a896;
      border-radius: 3px;
    }
    .el-select {
      width: 120px;
    }
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
          width: 100px;
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
.dialog-footer .el-button {
  color: #fff;
  width: 174px;
  height: 39px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
}
</style>
