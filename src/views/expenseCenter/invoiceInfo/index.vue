<template>
  <div class="invoice-info">
    <div class="order-title">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      寄送地址
    </div>

    <div class="table">
      <div class="order-title-out">
        <div
          class="order-footer ml pointer"
          @click="addAddressClick"
          v-if="tableData.length < 20"
        >
          + 新增
        </div>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="contacts" label="联系人"></el-table-column>
        <el-table-column
          prop="contactNumber"
          label="联系电话"
        ></el-table-column>
        <el-table-column prop="mailingAddress" label="地址"></el-table-column>
        <el-table-column prop="payTime" label="操作" width="180px">
          <template slot-scope="scope">
            <span
              @click="setDefaultMailingAddress(scope.row.id)"
              v-if="scope.row.defaultState != 0"
              >设为默认</span
            >
            <span @click="editAddressClick(scope.row)">修改</span>
            <span @click="delMailingAddress(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="新增地址"
      :visible.sync="addressDialog"
      width="500px"
      center
      @closed="init"
    >
      <div class="dialog-select">
        <el-form
          :model="addAddress"
          :rules="rules2"
          ref="addAddress"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="联系人：" prop="contacts">
            <el-input
              v-model="addAddress.contacts"
              placeholder="请填写联系人"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactNumber">
            <el-input
              v-model="addAddress.contactNumber"
              placeholder="请填写联系电话"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="mailingAddress">
            <el-input
              v-model="addAddress.mailingAddress"
              placeholder="请填写地址"
            ></el-input>
          </el-form-item>

          <span>
            <el-button @click="setMailingAddress('addAddress')">提交</el-button>
          </span>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMailingAddressList,
  setMailingAddress,
  setDefaultMailingAddress,
  delMailingAddress,
} from "@/api/invoice.js";
export default {
  data() {
    let mobile = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (value.length < 11) {
          callback(new Error("请输入正确格式的手机号"));
        } else {
          const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正确格式的手机号"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      addAddress: {
        id: null,
        contacts: "",
        contactNumber: "",
        mailingAddress: "",
      },
      rules2: {
        contacts: [
          { required: true, message: "请填写联系人", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, validator: mobile, trigger: "blur" },
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        mailingAddress: [
          { required: true, message: "请填写地址", trigger: "blur" },
        ],
      },
      addressDialog: false,
      // input: "",
      // value1: "",
      // textarea: "",
      tableData: [],
    };
  },
  created() {
    this.fetchData();
    // this.getBillingInformationAndMailingAddress();
  },
  methods: {
    // 获取地址列表
    fetchData() {
      getMailingAddressList().then((res) => {
        this.tableData = res.data;
      });
    },
    // 选择默认地址
    setDefaultMailingAddress(id) {
      setDefaultMailingAddress(id).then((res) => {
        this.fetchData();
      });
    },
    // 删除地址
    delMailingAddress(id) {
      delMailingAddress(id).then((res) => {
        this.fetchData();
      });
    },
    // 初始化填写地址表单
    init() {
      this.$refs["addAddress"].resetFields();
      this.addAddress = {
        id: null,
        contacts: "",
        contactNumber: "",
        mailingAddress: "",
      };
    },
    // 新增地址操作
    addAddressClick() {
      this.addAddress.id = null;
      this.addressDialog = true;
    },
    // 编辑地址操作
    editAddressClick(item) {
      this.addAddress = {
        id: item.id,
        contacts: item.contacts,
        contactNumber: item.contactNumber,
        mailingAddress: item.mailingAddress,
      };
      this.addressDialog = true;
    },
    // 新增，编辑收货地址
    setMailingAddress(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setMailingAddress(this.addAddress).then((res) => {
            this.fetchData();
            this.addressDialog = false;
          });
        } else {
          return false;
        }
      });
    },
    // 获取开票信息
    // getBillingInformationAndMailingAddress() {
    //   getBillingInformationAndMailingAddress().then(res => {
    //     this.invoiceInfo = res.data.userBillingInformation;
    //   });
    // },
    // 提交开票信息
    // subInvoiceInfo(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       setBillingInformation(this.invoiceInfo).then(res => {
    //         this.getBillingInformationAndMailingAddress();
    //         this.dialogVisible = false;
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       alert("submit!");
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // }
  },
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
    position: relative;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
    margin-right: 20px;
    span {
      position: absolute;
      left: 15px;
      display: inline-block;
      width: 40px;
      height: 20px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 168, 150, 1);
      cursor: pointer;
    }
  }
  .order-title-out {
    display: flex;
  }

  .table {
    padding: 20px 0;
    margin: 0 auto;
    width: 888px;
    .el-table {
      margin-top: 20px;
    }
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

.invoice {
  padding: 30px 50px;
  background-color: #f7f7f7;
  ul {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;
    li {
      width: 33%;
      font-size: 12px;
      font-weight: 700;
      color: rgba(39, 39, 39, 1);
      line-height: 28px;
      span {
        font-size: 12px;
        font-weight: 400;
        margin-left: 6px;
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
