<template>
  <div class="certificate-management">
    <el-dialog
      custom-class="cerficateDialog"
      width="550px"
      title="证书选择"
      :visible.sync="cerficVisible"
    >
      <div class="_input">
        <el-input @change="searchData" v-model="cerfiSearch" placeholder="输入证书名称搜索">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="_table">
        <el-table height="200px" :data="cerficateData">
          <el-table-column align="center" property="certName" label="证书名称"></el-table-column>
          <el-table-column align="center" property="name" label="证书状态">
            <template slot-scope="scope">
              <span>{{applyStatusList[scope.row.applyStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" property="insertTime" label="开始日期"></el-table-column>

          <el-table-column align="center" property="endDate" label="结束日期"></el-table-column>
          <el-table-column align="center" width="60px" label="选择">
            <template slot-scope="scope">
              <span @click="select(scope.row)" style="color:#00A896;cursor:pointer">选择</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <footer>
        <el-pagination
          :pager-count="5"
          small
          layout="prev, pager, next"
          :total="total"
          @current-change="pageSkip"
        ></el-pagination>
      </footer>
    </el-dialog>

    <tip-box></tip-box>
    <div class="_form">
      <div class="_title">
        <h3>选择证书</h3>
        <p>SSL证书提供了一种在互联网上身份验证的方式，是用来标识和证明双方身份的数字信息文件</p>
      </div>
      <div class="_line"></div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="证书来源">
          <el-radio-group @change="change" v-model="form.source">
            <el-radio label="1">自有证书</el-radio>
            <el-radio label="2">托管证书</el-radio>
            <el-radio label="3">免费证书</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :rules="[{required:true,message:'证书内容不能为空',trigger:'blur'}]"
          prop="fullchain"
          label="证书内容"
          v-if="form.source === '1'"
        >
          <el-input type="textarea" v-model="form.fullchain" placeholder="PEM编码"></el-input>
        </el-form-item>
        <el-form-item
          :rules="[{required:true,message:'私钥内容不能为空',trigger:'blur'}]"
          prop="privkey"
          label="私钥内容"
          v-if="form.source === '1'"
        >
          <el-input type="textarea" v-model="form.privkey" placeholder="PEM编码"></el-input>
        </el-form-item>
        <el-form-item
          :rules="[{required:true,message:'证书名称不能为空',trigger:'blur'}]"
          prop="certName"
          label="证书名称"
          v-if="form.source === '1'"
        >
          <el-input placeholder="证书名称为2-10个数字或字母" v-model="form.certName"></el-input>
        </el-form-item>

        <el-form-item v-if="form.source === '3'">
          <div class="explain">
            <p>1. 当前加速域名需正确配置CNAME。如何配置CNAME？</p>
            <p>2. 当前加速域名的DNS记录中不能有CAA记录。</p>
            <p>3.免费证书仅能保护当前加速域名，www域名申请免费证书会自动绑定顶级域名，所以需要将顶级域名的CNAME解析至阿里云CDN。</p>
            <p>
              4. 免费证书有效期一年，生效之后加速域名的 SSL Labs
              安全等级为A，到期自动续签。
            </p>
            <p>5. 免费证书不支持泛域名申请。</p>
            <p>6. 需授权佰讯云代申请免费证书。</p>
          </div>
          <el-checkbox v-model="form.checked">同意授权佰讯云申请免费证书</el-checkbox>
        </el-form-item>

        <el-form-item
          :rules="[{required:true,message:'证书名称不能为空',trigger:'blur'}]"
          prop="freeCertName"
          label="证书名称"
          v-if="form.source === '3'"
        >
          <el-input placeholder="证书名称为3-10个数字或字母" v-model="form.freeCertName"></el-input>
        </el-form-item>

        <!-- <el-form-item v-if="form.source === '2'">
          <p style="text-align: left;padding-left:50px">
            点击
            <span class="highlight">SSL证书管理</span>查看托管证书详情，您可以在SSL证书管理页面购买证书
          </p>
        </el-form-item>-->

        <el-form-item label="证书列表" v-if="form.source === '2'">
          <!-- <el-select @click.native="selectCertificate" v-model="form.region" placeholder="证书一">
            <el-option label="证书一" value="shanghai"></el-option>
            <el-option label="证书二" value="beijing"></el-option>
          </el-select>-->
          <div class="cerfiList">
            <p>{{cerficateName}}</p>
            <el-button @click.native="selectCertificate">选择证书</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel" class="_cancel_btn">取消</el-button>
          <el-button type="primary" @click="onSubmit" class="_save_btn">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import TipBox from "./tip-box";
import { updatePemContent, applyCertificate, selectCertInfo } from "@/api/site";
import { getCertInfoByUserId } from "@/api/credentials.js";
export default {
  components: {
    TipBox
  },
  data() {
    return {
      cerficVisible: false,
      cerfiSearch: "",
      cerficateData: [],
      cerficateName: "",
      form: {
        checked: false,
        region: "",
        type: [],
        source: "1",
        privkey: "",
        certName: "",
        fullchain: "",
        freeCertName: ""
      },
      currentPage: 1,
      total: 0,
      //证书状态
      applyStatusList: [
        "未申请",
        "正在申请",
        "已经申请",
        "行程申请中",
        "申请失败",
        "取消申请"
      ]
    };
  },
  created() {
    this.initCerficate();
  },
  computed: {
    id() {
      return JSON.parse(this.$route.query.data).id;
    },
    productId() {
      return JSON.parse(this.$route.query.data).productId;
    },
    certName() {
      return JSON.parse(this.$route.query.data).certName;
    },
    certificateId() {
      return JSON.parse(this.$route.query.data).certificateId;
    }
  },
  methods: {
    initCerficate() {
      this.cerficateName = this.certName;
      this.form.region = this.certificateId;
    },
    onSubmit() {
      if (this.form.source === "1") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updatePemContent({
              id: this.id,
              privkey: this.form.privkey,
              fullchain: this.form.fullchain,
              certName: this.form.certName
            }).then(res => {
              if (res.code == 200) {
                this.$message.success("证书保存成功！");
                this.$router.push("/cdn/credentials");
              }
            });
          }
        });
      } else if (this.form.source === "3") {
        if (this.form.checked) {
          if (this.form.freeCertName) {
            applyCertificate({
              id: this.id,
              productId: this.productId,
              certName: this.form.freeCertName
            }).then(res => {
              if (res.code == 200) {
                this.$router.push("/cdn/credentials");
              }
            });
          } else {
            this.$message.error("请输入证书名");
          }
        } else {
          this.$message.error("请选择同意授权！");
        }
      } else if (this.form.source === "2") {
        if (this.form.region) {
          selectCertInfo(this.id, this.form.region).then(res => {
            if (res.code == 200) {
              this.$message.success("证书保存成功");
              this.$router.push("/cdn/credentials");
            }
          });
        } else {
          this.$message.error("请选择证书");
        }
      }
    },
    cancel() {
      this.$message.success("取消所有操作");
      if (this.form.source == "1") {
        this.$refs["form"].resetFields();
      } else if (this.form.source == "3") {
        this.form.freeCertName = "";
        this.form.checked = false;
      }
    },
    change(a) {
      if (a == "3") {
        this.$refs["form"].resetFields();
        this.form.privkey = "";
        this.form.fullchain = "";
        this.form.certName = "";
      }
    },
    selectCertificate() {
      this.cerfiSearch = "";
      this.currentPage = 1;
      this.fetchData();
      this.cerficVisible = true;
    },
    fetchData() {
      getCertInfoByUserId(this.currentPage, 10, this.cerfiSearch).then(res => {
        this.cerficateData = res.data.rows;
        this.total = res.data.total;
      });
    },
    pageSkip(page) {
      this.currentPage = page;
      this.fetchData();
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    select(obj) {
      this.cerficateName = obj.certName;
      this.form.region = obj.id;
      this.cerficVisible = false;
    }
  }
};
</script>


<style lang="scss">
.certificate-management {
  .el-table .cell {
    color: #717171;
  }
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    .el-dialog__headerbtn {
      width: auto;
      height: auto;
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 30px 20px 10px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-form-item__label {
    padding-right: 20px !important;
  }
}
</style>


<style lang="scss" scoped>
@import "@styles/theme.scss";
.certificate-management {
  padding: 15px 134px;
  .cerficateDialog {
    ._input {
      width: 330px;
      margin: auto;
    }
    ._table {
      margin-top: 20px;
    }
    footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;
    }
  }
  ._form {
    padding: 16px 38px;
    margin-top: 11px;
    background-color: #ffffff;
    ._line {
      margin: 10px 0;
      height: 1px;
      background: rgba(249, 249, 249, 1);
    }
    .explain {
      padding: 10px 15px;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(238, 238, 238, 1);
      p {
        text-align: left;
      }
    }
    h3 {
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(2, 2, 2, 1);
    }
    p {
      text-align: center;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
    }
  }
  .highlight {
    color: $theme-color;
  }
}
</style>
<style lang="scss">
.certificate-management {
  .el-form-item__label {
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(2, 2, 2, 1);
    font-size: 14px;
  }
  .el-radio__label {
    padding-left: 10px;
    color: #666666;
  }
  .el-select {
    width: 80%;
  }
  ._cancel_btn {
    background: rgba(244, 244, 244, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 2px 2px 2px 2px;
    padding: 7px 40px;
    margin-right: 20px;
  }
  ._save_btn {
    background: rgba(0, 168, 150, 1);
    border-radius: 2px 2px 2px 2px;
    padding: 7px 40px;
    span {
      color: #ffffff;
    }
  }
  .cerfiList {
    display: flex;
    align-items: center;
    p {
      margin-right: 15px;
    }
  }
}
</style>
