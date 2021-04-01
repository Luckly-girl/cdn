<template>
  <div class="agreement">
    <div class="order-title">合同管理</div>

    <div class="daoqi">
      <el-form>
        <el-form-item label="状态" label-width="50px">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="agreeApplication">申请合同</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="合同号"></el-table-column>
        <el-table-column prop="productName" label="对应订单"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间"></el-table-column>
        <el-table-column prop="payTime" label="备注"></el-table-column>
        <el-table-column prop="createdTime" label="操作">
          <tenplate slot-scope="scope">
            <span @click="checkClick(scope.row.id)">查看电子合同</span>
            <span @click="applicationClick(scope.row.id)">申请邮寄</span>
          </tenplate>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
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
    agreeApplication() {
      // this.$router.push("")
    }
  }
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
    span {
      font-size: 12px;
      color: #00A896;
      padding: 0 10px;
      cursor: pointer;
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
</style>
