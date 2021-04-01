<template>
  <div class="credent-manage">
    <div class="credent-title">证书管理</div>
    <div class="detail" label-width="110px">
      <div class="credent-button">
        <span @click="upLoadBook">证书上传</span>
        <span>证书购买</span>
      </div>
      <div class="credent-input">
        <div class="search" label-width="0">
          <i class="el-icon-search pointer" @click="searchData"></i>
          <el-input class="inputKey" placeholder="输入关键字" v-model="list.value" style="width:260px"></el-input>
        </div>
        <div class="credent-export pointer" @click="downCertDetails">
          导出
          <img src="@/assets/images/expense/daochu.png" alt>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table :data="tables" border style="width: 100%">
        <el-table-column prop="realname" label="域名" width="220"></el-table-column>
        <el-table-column prop="certName" label="证书名称" width="360"></el-table-column>
        <el-table-column label="证书状态">
          <template slot-scope="scope">
            {{
            scope.row.applyStatus | applyStatusFilter
            }}
          </template>
        </el-table-column>
        <el-table-column prop="insertTime" label="开始时间"></el-table-column>
        <el-table-column prop="endDate" label="到期时间"></el-table-column>
        <el-table-column prop="backUp" label="备注"></el-table-column>
      </el-table>
      <el-dialog title="证书上传" :visible.sync="outerVisible" @close="resetForm" width="600px">
        <el-form ref="addFormRef" :model="uploadBook" label-width="75px">
          <el-form-item
            :rules="[{required:true,message:'证书名称不能为空',trigger:'blur'},{ validator: validateName, trigger: 'blur' }]"
            prop="certName"
            label="证书名称 :"
            class="bookName"
          >
            <el-input placeholder="3-10个数字或英文" v-model="uploadBook.certName"></el-input>
          </el-form-item>
          <el-form-item
            :rules="[{required:true,message:'证书内容不能为空',trigger:'blur'}]"
            prop="fullchain"
            label="证书内容 :"
            class="bookContent"
          >
            <el-input type="textarea" :rows="2" v-model="uploadBook.fullchain" placeholder="PEM编码"></el-input>
          </el-form-item>
          <el-form-item
            :rules="[{required:true,message:'私钥内容不能为空',trigger:'blur'}]"
            prop="privkey"
            label="秘钥内容 :"
            class="sshContent"
          >
            <el-input type="textarea" :rows="2" v-model="uploadBook.privkey" placeholder="PEM编码"></el-input>
          </el-form-item>
        </el-form>
        <p>已上传证书不支持下载</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">取 消</el-button>
          <el-button type="primary" @click="successBook">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        custom-class="successAlert"
        width="30%"
        title="消息提示"
        :visible.sync="innerVisible"
        @close="closeDialog"
      >
        <div>
          证书上传成功!
          <img src="../../assets/images/sucess.png">
        </div>
      </el-dialog>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import { downCertDetails } from "@/api/expense.js";
import { getCertInfoByUserId, saveCertContent } from "@/api/credentials.js";
export default {
  data() {
    return {
      total: 0,
      tableDataList: [],
      list: {
        value: ""
      },
      uploadBook: {
        certName: "",
        fullchain: "",
        privkey: ""
      },
      outerVisible: false,
      innerVisible: false
    };
  },
  computed: {
    //模糊查询
    tables() {
      const value = this.value;
      if (value) {
        return this.tableDataList.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key].toLowerCase().indexOf(value) > -1);
          });
        });
      }
      return this.tableDataList;
      this.fetchData();
    }
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    validateName(rule, value, callback) {
      if (!/^[a-zA-Z0-9]{3,10}$/.test(value)) {
        callback(new Error("证书名格式不正确"));
      } else {
        callback();
      }
    },
    fetchData() {
      getCertInfoByUserId(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.list.value
      ).then(res => {
        this.tableDataList = res.data.rows;
        this.total = res.data.total;
      });
    },
    downCertDetails() {
      downCertDetails(this.list.value).then(res => {
        this.$router.push("/expenseCenter/exportRecord");
      });
    },
    upLoadBook() {
      this.outerVisible = true;
    },
    //动态添加表格数据
    successBook() {
      this.$refs["addFormRef"].validate(async valid => {
        if (valid) {
          try {
            const { res: upBook,code } = await saveCertContent({
              certName: this.uploadBook.certName,
              fullchain: this.uploadBook.fullchain,
              privkey: this.uploadBook.privkey
            });
            // console.log(code);
            if(code==200){
            this.fetchData();
            this.innerVisible = true;
            }

            // this.tableDataList = [
            //   ...this.tableDataList,
            //   { certName: this.form.certName },
            // ];
          } catch (err) {
            // console.log(err);
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 清空表单数据
    resetForm() {
      this.outerVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    //关闭dialog
    closeDialog() {
      this.outerVisible = false;
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="scss">
.credent-manage {
  .table {
    padding: 20px 0 30px;
    .el-table th > .cell,
    .el-table td > .cell {
      height: 35px;
      text-align: center;
      font-size: 12px;
      color: rgba(113, 113, 113, 1);
    }

    .el-table th > .cell {
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
    }
    .el-table--enable-row-transition .el-table__body td {
      height: 55px;
    }
    .el-dialog__header {
      height: 60px;
      line-height: 60px;
      background: #f9f9f9;
    }
    .el-dialog__title {
      padding-left: 30px;
    }
    .el-dialog {
      width: 520px;

      p {
        padding: 0 75px;
        color: #6e6e6e;
      }
      .el-dialog__body {
        padding: 30px;
      }
    }
    .sshContent .el-input__inner,
    .bookContent .el-input__inner {
      height: 80px;
    }
    .dialog-footer {
      el-button:nth-child(1) {
        margin-left: 15px;
      }
    }
    .el-textarea {
      // width: 500px;
      width: 100%;
      // margin-left: 20px;
    }
    .el-textarea__inner {
      // width: 500px;
      width: 100%;
    }
    .el-form-item__label {
      padding-right: 10px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.credent-manage {
  padding: 0 30px 30px;
  background-color: #fff;
  .credent-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .detail {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    .credent-button {
      display: flex;
      width: 220px;
      span {
        flex: 1;
        width: 95px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #ffffff;
        font-size: 13px;
        cursor: pointer;
        background: rgba(0, 168, 150, 1);
        border-radius: 4px 4px;
      }
      span:nth-child(2) {
        margin-left: 30px;
      }
    }
    .credent-input {
      position: relative;
      width: 370px;
      .search {
        position: relative;
        i {
          position: absolute;
          right: 115px;
          top: 8px;
          z-index: 99;
          font-size: 24px;
          color: rgba(0, 168, 150, 1);
        }
      }
      .credent-export {
        position: absolute;
        right: 0;
        top: 8px;
        font-size: 14px;
        margin-left: 15px;
        color: rgba(39, 39, 39, 1);
        img {
          margin-left: 20px;
          vertical-align: middle;
        }
      }
    }
  }
  .table {
    .sshContent,
    .bookContent,
    .bookName {
      // width: 365px;
      // margin: auto;
      font-weight: bold;
      margin-top: 25px;
      label {
        padding-right: 10px;
        text-align: left;
      }
    }
    .el-input {
      // width: 260px;
      width: 100%;
      // margin-left: 20px;
    }
  }
  .dialog-footer {
    .el-button:nth-child(2) {
      margin-left: 40px;
    }
  }

  .el-button:nth-child(1) {
    width: 90px;
    height: 35px;
    background: rgba(244, 244, 244, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 1px 1px 1px 1px;
  }
  .el-button:nth-child(2) {
    width: 90px;
    height: 35px;
    background: rgba(0, 168, 150, 1);
    border-radius: 4px 4px;
  }
  .successAlert div {
    width: 130px;
    height: 200px;
    line-height: 70px;
    margin: auto;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
