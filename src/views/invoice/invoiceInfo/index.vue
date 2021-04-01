<template>
  <div class="invoice-info">
    <div class="order-title">开票信息</div>
    <div class="dialog-select invoice">
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
        </ul>
      </div>
    </div>
    <div class="order-footer pointer" @click="dataSetClick">修改</div>

    <div class="table">
      <div class="order-title tal">寄送地址</div>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="productName" label="联系人"></el-table-column>
        <el-table-column prop="productName" label="联系电话"></el-table-column>
        <el-table-column prop="createdTime" label="地址" width="260"></el-table-column>
        <el-table-column prop="payTime" label="操作" width="180">
          <template slot-scope="scope">
            <span @click="setDefault(scope.row.id)">设为默认</span>
            <span @click="change(scope.row.id)">修改</span>
            <span @click="del(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-footer ml pointer" @click="addAddressClick">+ 新增</div>
    </div>

    <el-dialog title="新增地址" :visible.sync="dialogVisible2" width="500px" center>
      <div class="dialog-select">
        <el-form
          :model="addAddress"
          :rules="rules2"
          ref="addAddress"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="联系人：" prop="name">
            <el-input v-model="addAddress.name" placeholder="请填写联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="region">
            <el-input v-model="addAddress.region" placeholder="请填写联系电话"></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="date1">
            <el-input v-model="addAddress.date1" placeholder="请填写地址"></el-input>
          </el-form-item>

          <span>
            <el-button @click="submitForm('addAddress')">提交</el-button>
          </span>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="发票信息修改" :visible.sync="dialogVisible" width="500px" center>
      <div class="dialog-select">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="开具类型：" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="个人"></el-radio>
              <el-radio label="企业"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请填写营业执照全称"></el-input>
          </el-form-item>
          <el-form-item label="税务登记证号：" prop="region">
            <el-input v-model="ruleForm.region" placeholder="请填写有效纳税人识别号"></el-input>
          </el-form-item>
          <el-form-item label="开户银行名称：" prop="date1">
            <el-input v-model="ruleForm.date1" placeholder="请填写您开户许可证上的银行"></el-input>
          </el-form-item>
          <el-form-item label="基本开户账户：" prop="date2">
            <el-input v-model="ruleForm.date2" placeholder="请填写您开户许可证上的银行账号"></el-input>
          </el-form-item>
          <el-form-item label="注册场所地址：" prop="type">
            <el-input v-model="ruleForm.type" placeholder="请填写您营业执照上的注册地址"></el-input>
          </el-form-item>
          <el-form-item label="注册固定电话：" prop="desc">
            <el-input v-model="ruleForm.desc" placeholder="请填写您的有效联系方式"></el-input>
          </el-form-item>

          <span>
            <el-button @click="submitForm('ruleForm')">提交</el-button>
          </span>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addAddress: {
        name: "",
        region: "",
        date1: ""
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: "",
        resource: "",
        desc: ""
      },
      rules2: {
        name: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        region: [
          { required: true, message: "请填写联系电话", trigger: "blur" }
        ],
        date1: [{ required: true, message: "请填写地址", trigger: "blur" }]
      },
      rules: {
        name: [
          { required: true, message: "请填写营业执照全称", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请填写有效纳税人识别号", trigger: "blur" }
        ],
        date1: [
          {
            required: true,
            message: "请填写您开户许可证上的银行",
            trigger: "blur"
          }
        ],
        date2: [
          {
            required: true,
            message: "请填写您开户许可证上的银行账号",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请填写您营业执照上的注册地址",
            trigger: "blur"
          }
        ],
        resource: [
          { required: true, message: "请选择发票开具类型", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请填写您的有效联系方式", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      dialogVisible2: false,
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
    dataSetClick() {
      this.dialogVisible = true;
    },
    addAddressClick() {
      this.dialogVisible2 = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.invoice-info {
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
}
</style>


<style lang="scss" scoped>
.invoice-info {
  padding: 0 30px 30px;
  background-color: #fff;
  .order-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }

  .table {
    padding: 20px 260px;
    .tal {
      text-align: left;
      padding-left: 30px;
    }
    span {
      font-size: 12px;
      color: #00a795;
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .order-footer {
    width: 135px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin: 0px auto;
    font-size: 14px;
    color: #00a896;
    border: 1px solid #00a896;
    border-radius: 2px;
  }
  .ml {
    width: 88px;
    margin-left: 0px;
    margin-top: 15px;
  }
}
.invoice {
  width: 260px;
  margin: 0 auto;
}

.dialog-select {
  padding: 30px 80px;
  .input-wrap {
    margin-bottom: 0;
    padding: 0 30px;
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
  margin: 20px 0;
}
</style>
