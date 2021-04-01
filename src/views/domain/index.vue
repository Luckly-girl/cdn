<template>
  <div class="domain-manage">
    <div class="domain-title">域名管理</div>
    <div class="detail">
      <span class="domain-button" @click="addDomain">添加域名</span>
      <div class="domain-input">
        <div class="search-name">
          <span>域名</span>
          <el-input
            v-model="list.realmName"
            placeholder="请输入域名"
          ></el-input>
        </div>
        <!-- <div class="search-pro">
          <span>产品</span>
          <el-input placeholder="请输入产品名称"></el-input>
        </div>-->
        <div class="domain-export pointer" @click="searchData">
          <span style="color: #fff">搜索</span>
          <img src="../../assets/images/down.png" @click="domainExport" alt />
        </div>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tables"
        border
        style="width: 100%"
        @filter-change="statusFilter"
      >
        <el-table-column prop="realmName" label="域名" width="200">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title
              width="200"
              trigger="hover"
              :content="scope.row.realmName"
            >
              <div style="width: 100%" slot="reference">
                <span class="ellipsis-span">{{ scope.row.realmName }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="allDomin"
          label="CNAME"
          width="230"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="nginxState"
          :label="domainStatusText"
          :filters="nginxStateList"
          column-key="nginxState"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="list.nginxState == '' ? [] : [list.nginxState]"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.nginxState == '0'"
              @click="noDeployTable(scope.row.id)"
            >
              <span style="color: #46a2fa">未部署</span>
            </div>
            <div v-if="scope.row.nginxState == '1'">
              <span style="color: #46a2fa">部署中</span>
            </div>
            <div v-if="scope.row.nginxState == '2'">
              <span style="color: #46a2fa">部署成功</span>
            </div>
            <div
              v-else-if="scope.row.nginxState == '3'"
              @click="deployTable(scope.row.id)"
            >
              <span style="color: #fa4c4c">部署失败</span>
              <!-- <i class="iconfont iconbutton_explain"></i> -->
            </div>
            <!-- {{scope.row.nginxState | nginxStateFilter -->
          </template>
        </el-table-column>
        <el-table-column
          :label="domainTypeText"
          prop="businessType"
          :filters="businessTypeList"
          column-key="businessType"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="list.businessType == '' ? [] : [list.businessType]"
        >
          <template slot-scope="scope">
            {{ scope.row.businessType | businessTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          :label="domainHttpText"
          prop="sslStatus"
          :filters="httpsSetList"
          column-key="sslStatus"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="list.sslStatus == '' ? [] : [list.sslStatus]"
        >
          <template slot-scope="scope">
            {{ scope.row.sslStatus | httpsSetListFilter }}
          </template>
        </el-table-column>
        <el-table-column
          :label="domainSourceTypeText"
          prop="type"
          :filters="sourceList"
          column-key="type"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="list.type == '' ? [] : [list.type]"
        >
          <template slot-scope="scope">
            {{ scope.row.type | sourceListFilter }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          :label="domainServeText"
          prop="quickenArea"
          :filters="serveLocalList"
          column-key="quickenArea"
          :filter-multiple="false"
          :filter-method="filterTag"
          :filtered-value="list.quickenArea == '' ? [] : [list.quickenArea]"
        >
          <template slot-scope="scope">
            {{ scope.row.quickenArea | serveLocalListFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="insertTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <!-- <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-select
              v-model="addSiteForm.groupName"
              @change="handleChange"
              placeholder="请选择"
            >
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">{{ scope.row.groupName }}</template>
        </el-table-column> -->
        <el-table-column
          prop="groupName"
          column-key="groupName"
          :filter-multiple="false"
          :filters="groupList"
          :filter-method="filterTagGroup"
          :label="groupNameText"
          :filtered-value="list.groupName == '' ? [] : [list.groupName]"
        >
          <template slot-scope="scope">{{ scope.row.groupName }}</template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)">管理</span>
            <span @click="handleCopy(scope.row)">复制配置</span>
            <span
              @click="handleOpen(scope.row.id, 1)"
              v-if="scope.row.parseOnoff === 0"
              >启用</span
            >
            <span
              :style="scope.row.parseOnoff === 1 ? 'color:#999' : ''"
              @click="handleOpen(scope.row.id, 0)"
              v-if="scope.row.parseOnoff === 1"
              >停止</span
            >
            <span @click="handleDelete(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        :total="total"
        class="pagenation"
      ></pagination>
    </div>
    <!-- 添加域名对话框 -->
    <!-- <div class="dialogDiv"> -->
    <el-dialog
      title="添加域名"
      :visible.sync="dialogAddVisible"
      :modal-append-to-body="false"
      :ref="addSiteForm"
      @closed="resetForm('addSiteForm')"
      width="600px"
    >
      <div class="demain-input">
        <div class="demain-a">
          <p>域名配置</p>
        </div>
        <el-form ref="addSiteForm" :rules="addRules" :model="addSiteForm">
          <el-form-item label="域名:" prop="realmName" class="demain-name">
            <el-input v-model="addSiteForm.realmName"></el-input>
            <p>多个域名间用,隔开</p>
          </el-form-item>
          <el-form-item label="分组:" prop="groupName" class="demain-group">
            <el-select v-model="addSiteForm.groupName" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
            <span @click="newdialog">新建分组</span>
          </el-form-item>
          <el-form-item
            label="业务类型:"
            prop="businessType"
            class="demain-work"
          >
            <el-select
              v-model="addSiteForm.businessType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessTypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="加速区域:" prop="quickenArea">
            <el-radio-group v-model="addSiteForm.quickenArea">
              <el-radio :label="0">国内</el-radio>
              <el-radio :label="1">海外</el-radio>
              <el-radio :label="2">全球</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="端口:" prop="portNum" class="demain-port">
            <el-input
              v-model="addSiteForm.portNum"
              placeholder="不填写将使用默认端口"
            ></el-input>
          </el-form-item>

          <div class="demain-b">
            <p>源站配置</p>
          </div>
          <el-form-item
            label="源站地址:"
            :rules="addRules.ip"
            :prop="`ipTypes.${index}.ip`"
            class="demain-address"
            v-for="(item, index) in addSiteForm.ipTypes"
            :key="index"
          >
            <el-input type="textarea" :rows="2" v-model="item.ip"></el-input>
            <p>支持填充多个源站IP(一行一个)或一个域名</p>
          </el-form-item>

          <el-form-item label="回源协议:" prop="type" class="sourceHtp">
            <el-radio-group v-model="addSiteForm.type" @change="clickRadio">
              <el-radio :label="1">HTTP</el-radio>
              <el-radio :label="2">HTTPS</el-radio>
              <!-- <el-radio :label="3">协议跟随</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="hide" v-if="flagFalse === true">
        <div class="oneBook">
          <label>源IP私钥文本域</label>
          <el-input
            type="textarea"
            :rows="3"
            v-model="addSiteForm.originPrivkey"
          ></el-input>
        </div>
        <div class="twoBook" style="margin-top: 20px">
          <label>源IP证书文本域</label>
          <el-input
            type="textarea"
            :rows="3"
            v-model="addSiteForm.originFullchain"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="addFooter">
        <el-button @click="resetForm('addSiteForm')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addSiteForm')"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 复制配置对话框 -->
    <el-dialog
      title="复制配置"
      :visible.sync="dialogAddVisibleCouse"
      :ref="addSiteForm"
      @closed="resetForm('addSiteForm')"
      width="600px"
    >
      <div class="demain-input">
        <div class="demain-a">
          <p>域名配置</p>
        </div>
        <el-form ref="addSiteForm" :rules="addRules" :model="addSiteForm">
          <el-form-item label="域名:" prop="realmName" class="demain-name">
            <el-input v-model="addSiteForm.realmName"></el-input>
            <p>多个域名间用,隔开</p>
          </el-form-item>
          <el-form-item label="分组:" prop="groupName" class="demain-group">
            <el-select v-model="addSiteForm.groupName" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
            <span @click="newdialog">新建分组</span>
          </el-form-item>
          <el-form-item
            label="业务类型:"
            prop="businessType"
            class="demain-work"
          >
            <el-select
              v-model="addSiteForm.businessType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessTypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="加速区域:" prop="quickenArea">
            <el-radio-group v-model="addSiteForm.quickenArea">
              <el-radio :label="0">国内</el-radio>
              <el-radio :label="1">海外</el-radio>
              <el-radio :label="2">全球</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="端口:" prop="portNum" class="demain-port">
            <el-input
              v-model="addSiteForm.portNum"
              placeholder="不填写将使用默认端口"
            ></el-input>
          </el-form-item>

          <div class="demain-b">
            <p>源站配置</p>
          </div>
          <el-form-item
            label="源站地址:"
            :rules="addRules.ip"
            :prop="`ipTypes.${index}.ip`"
            class="demain-address"
            v-for="(item, index) in addSiteForm.ipTypes"
            :key="index"
          >
            <el-input type="textarea" :rows="2" v-model="item.ip"></el-input>
            <p>支持填充多个源站IP(一行一个)或一个域名</p>
          </el-form-item>

          <el-form-item label="回源协议:" prop="type" class="sourceHtp">
            <el-radio-group v-model="addSiteForm.type" @change="clickRadio">
              <el-radio :label="1">HTTP</el-radio>
              <el-radio :label="2">HTTPS</el-radio>
              <!-- <el-radio :label="3">协议跟随</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="hide" v-if="flagFalse === true">
        <div class="oneBook">
          <label>源IP私钥文本域</label>
          <el-input
            type="textarea"
            :rows="3"
            v-model="addSiteForm.originPrivkey"
          ></el-input>
        </div>
        <div class="twoBook" style="margin-top: 20px">
          <label>源IP证书文本域</label>
          <el-input
            type="textarea"
            :rows="3"
            v-model="addSiteForm.originFullchain"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="addFooter">
        <el-button @click="resetForm('addSiteForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddCuse('addSiteForm')"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- </div> -->
    <!-- 新建分组对话框 -->
    <div class="dialogIn">
      <el-dialog title="新建分组" :visible.sync="groupVisible" width="550px">
        <!-- <div class="new-groupName"> -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="分组名称:" prop="newGroupName">
            <el-input v-model="ruleForm.newGroupName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="addFooter">
          <el-button @click="newGroupClose">取 消</el-button>
          <el-button type="primary" @click="newGroup('ruleForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import {
  querySiteByCondition,
  queryGroupName,
  updateDnsSiteParse,
  deleteNginxInfo,
  addGroupName,
  exportSiteInfo,
  addNginxInfo,
  addNginxInfoNew,
  deployNginxFile,
  updateNginxDeployStatus,
} from "@/api/domain.js";
import { splitArr } from "@/utils/filter";
export default {
  data() {
    //校验新建分组名称
    const moreRule = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{2,10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入2-10位的英文及数字"));
      } else {
        callback();
      }
    };
    //添加域名格式是否正确
    const addRealmNameRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写域名"));
      } else {
        const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        let _arr = splitArr(value);
        if (
          _arr.every((item) => {
            if (!reg.test(item)) {
              return false;
            } else {
              return true;
            }
          })
        ) {
          callback();
        } else {
          callback(new Error("请输入正确的域名"));
        }
      }
    };
    //添加端口号校验
    const portNumRule = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (value == "22") {
          callback(new Error("端口号不可填写为'22'"));
        } else {
          callback();
        }
      }
    };
    return {
      groupVisible: false, //新建分组弹框状态
      tableData: [], //域名列表
      total: 0, //总数
      //添加域名信息
      addSiteForm: {
        realmName: "", //用户输入的域名
        groupName: "", //用户选择分组
        businessType: "", //选择业务类型
        quickenArea: 0, //选择服务地域
        portNum: "", //用户输入的端口号
        type: 1, //回源协议
        ipTypes: [
          //源站地址
          {
            ip: "",
            type: "web",
            ipType: 0,
            ableStatus: 1,
          },
        ],
        originPrivkey: "", // 私钥文本域
        originFullchain: "", // 证书文本域
        // copySiteId:"" //复制配置id
      },
      productId: "",
      multiplexId: "",
      list: {
        //请求参数
        realmName: "",
        sslStatus: "", //http配置
        nginxState: "", //域名状态
        businessType: "",
        groupName: "",
        quickenArea: "",
        type: "",
      },
      siteId: "",
      parseOnoff: 0,
      reuse: false, //判断是否是复制配置操作
      // realmNames: [], //获取域名数组
      groupList: [], //获取分组信息
      groupItem: "",
      options: [
        {
          value: 0,
          label: "新建分组",
        },
      ],
      disableVisible: false, //添加分组弹框状态
      dialogAddVisible: false, //添加域名对话框状态
      dialogAddVisibleCouse: false, //复制配置对话框状态
      flagFalse: false,
      ruleForm: {
        //新建分组表单
        newGroupName: "",
      },
      //新建分组表单验证
      rules: {
        newGroupName: [
          { required: true, validator: moreRule, trigger: "blur" },
        ],
      },
      //添加域名表单验证
      addRules: {
        realmName: [
          { required: true, validator: addRealmNameRule, trigger: "blur" },
        ],
        portNum: [{ validator: portNumRule, trigger: "blur" }],
        ip: [{ required: true, message: "请输入ip或域名", trigger: "blur" }],
      },
    };
  },
  computed: {
    domainStatusText() {
      if (this.list.nginxState === "") {
        return "状态";
      } else {
        return this.$store.state.nginxStateList[this.list.nginxState].text;
      }
    },
    domainTypeText() {
      if (this.list.businessType === "") {
        return "业务类型";
      } else {
        return this.$store.state.businessTypeList[this.list.businessType].text;
      }
    },
    domainHttpText() {
      if (this.list.sslStatus === "") {
        return "HTTPS配置";
      } else {
        return this.$store.state.httpsSetList[this.list.sslStatus].text;
      }
    },
    domainSourceTypeText() {
      if (this.list.type === "") {
        return "回源协议";
      } else {
        return this.$store.state.sourceList[this.list.type].text;
      }
    },
    domainServeText() {
      if (this.list.quickenArea === "") {
        return "服务地域";
      } else {
        return this.$store.state.serveLocalList[this.list.quickenArea].text;
      }
    },
    groupNameText() {
      if (this.list.groupName === "") {
        return "分组";
      } else {
        return this.list.groupName;
      }
    },
    // 域名状态
    nginxStateList() {
      return this.$store.state.nginxStateList;
    },
    // // 业务类型
    businessTypeList() {
      return this.$store.state.businessTypeList;
    },
    //HTTPS配置
    httpsSetList() {
      return this.$store.state.httpsSetList;
    },
    //回源协议
    sourceList() {
      return this.$store.state.sourceList;
    },
    //服务地域
    serveLocalList() {
      return this.$store.state.serveLocalList;
    },
    //模糊查询
    tables() {
      const realmName = this.realmName;
      if (realmName) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key].toLowerCase().indexOf(value) > -1);
          });
        });
      }
      // console.log(this.tableData);
      return this.tableData;
      this.fetchData();
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
      this.groupTableData();
    });
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    //获取域名详情列表
    async fetchData() {
      const { data: res } = await querySiteByCondition(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.list.realmName,
        this.list.sslStatus,
        this.list.nginxState,
        this.list.businessType,
        this.list.groupName,
        this.list.quickenArea,
        this.list.type
      );
      this.tableData = res.rows;
      this.total = res.total;
    },
    //导出域名信息
    async domainExport() {
      const { data: domainExt } = await exportSiteInfo(
        this.list.realmName,
        this.list.sslStatus,
        this.list.nginxState,
        this.list.businessType,
        this.list.groupName,
        this.list.quickenArea,
        this.list.type
      );
      this.$router.push("/expenseCenter/exportRecord");
    },
    //未部署
    async noDeployTable(nginxId) {
      const { res: noDeploy } = await deployNginxFile(nginxId);
      this.fetchData();
    },
    //部署失败
    async deployTable(nginxId) {
      const { res: deploy } = await updateNginxDeployStatus(nginxId);
      this.fetchData();
    },
    //获取分组信息
    async groupTableData() {
      const { data: resVal } = await queryGroupName();
      // console.log(resVal.rows);
      this.groupList = [];
      resVal.rows.forEach((item) => {
        this.groupItem = item;
        // console.log(item, this.groupItem);
        this.groupList.push({
          text: item.groupName,
          value: item.groupName,
        });
      });
      // console.log(JSON.stringify(this.groupList[0].text));
    },
    statusFilter(filter) {
      if (filter.nginxState) {
        // console.log(filter.nginxState)
        if (filter.nginxState.length === 1) {
          this.list.nginxState = filter.nginxState[0];
        } else {
          this.list.nginxState = "";
        }
      }
      if (filter.businessType) {
        if (filter.businessType.length === 1) {
          this.list.businessType = filter.businessType[0];
        } else {
          this.list.businessType = "";
        }
      }
      if (filter.sslStatus) {
        if (filter.sslStatus.length === 1) {
          this.list.sslStatus = filter.sslStatus[0];
        } else {
          this.list.sslStatus = "";
        }
      }
      if (filter.type) {
        if (filter.type.length === 1) {
          this.list.type = filter.type[0];
        } else {
          this.list.type = "";
        }
      }
      if (filter.quickenArea) {
        if (filter.quickenArea.length === 1) {
          this.list.quickenArea = filter.quickenArea[0];
        } else {
          this.list.quickenArea = "";
        }
      }
      if (filter.groupName) {
        if (filter.groupName.length === 1) {
          this.list.groupName = filter.groupName[0];
        } else {
          this.list.groupName = "";
        }
      }
      this.searchData();
    },
    filterTag(value, row) {
      // console.log(value,row);
      return true;
    },
    //点击选择分组
    filterTagGroup(value, row) {
      // console.log(value, column);
      return (this.list.groupName = value);
    },
    //分组筛选
    // handleChange(val) {
    //   // return (row.groupName = val);
    // },
    //管理
    handleEdit(index, row) {
      this.$router.push({
        path: "/cdn/domainSetUp",
        query: { data: JSON.stringify(row) },
      });
    },
    //复制配置
    handleCopy(data) {
      this.productId = data.productId;
      this.multiplexId = data.id;
      this.reuse = true;
      // console.log(this.addSiteForm);
      for (let key of Object.keys(this.addSiteForm)) {
        if (key == "ipTypes") {
          if (data["ipGroupInfo"].web) {
            for (let [index, web] of data["ipGroupInfo"].web.entries()) {
              this.addSiteForm[key][0].ip += web;
              if (index != data["ipGroupInfo"].web.length - 1) {
                this.addSiteForm[key][0].ip += "\n";
              }
            }
          }
        } else {
          this.addSiteForm[key] = data[key];
          if (this.addSiteForm.type == 2) {
            this.flagFalse = true;
          } else {
            this.flagFalse = false;
          }
        }
      }
      // this.fetchData();
      // setTimeout(() => {
      this.dialogAddVisibleCouse = true;
      // }, 500);
    },
    //启用停止
    async handleOpen(id, parseOnoff) {
      const { data: dataOpen } = await updateDnsSiteParse(id, parseOnoff);
      this.fetchData();
    },
    //添加域名
    addDomain() {
      this.reuse = false;
      this.dialogAddVisible = true;
    },
    // 删除站点操作
    handleDelete(id) {
      this.$confirm("此操作将永久删除该站点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteNginxInfo(id).then((res) => {
            // this.clearInput();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    //添加按钮取消,对话框关闭
    resetForm(formName) {
      // 移除表单校验
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.dialogAddVisible = false;
      this.dialogAddVisibleCouse = false;
      this.flagFalse = false;
      this.addSiteForm = {
        groupName: "", //  当前产品id
        businessType: "", //业务类型
        quickenArea: 0, //加速区域
        type: 1, // 协议类型 1.http 2.https
        // recordLine: 0,
        realmName: "", // 用户输入的域名
        // realmName: [''], // 用户输入的域名
        portNum: "", // 端口号
        ipTypes: [
          {
            ip: "",
            type: "web",
            ipType: 0,
            ableStatus: 1,
          },
        ],
        originPrivkey: "", // 私钥文本域
        originFullchain: "", // 证书文本域
      };
    },
    //添加域名提交
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let ipTypes = [];
          for (let item of this.addSiteForm.ipTypes[0].ip.split("\n")) {
            ipTypes.push({
              ip: item,
              type: "web",
              ipType: 0,
              ableStatus: 1,
            });
          }
          let _params = {
            realmName: splitArr(this.addSiteForm.realmName),
            groupName: this.addSiteForm.groupName,
            businessType: this.addSiteForm.businessType,
            quickenArea: this.addSiteForm.quickenArea,
            portNum: this.addSiteForm.portNum,
            type: this.addSiteForm.type,
            // copySiteId: this.addSiteForm.copySiteId,
            ipTypes: ipTypes,
            originPrivkey: this.addSiteForm.originPrivkey,
            originFullchain: this.addSiteForm.originFullchain,
            productId: this.productId,
          };
          if (this.reuse === false) {
            this.addNginxInfo(_params);
          }
        } else {
          return false;
        }
        // console.log(this.addSiteForm.groupName)
      });
    },
    //添加域名
    addNginxInfo(params) {
      addNginxInfo(params).then((res) => {
        this.currentPage = 1;
        this.fetchData();
        // 刷新完成后 需要关闭弹框
        this.dialogAddVisible = false;
        this.flagFalse = false;
      });
      // setTimeout(() => {
      //   this.addLoading = false;
      // }, 3000);
    },
    //点击https出现输入框
    clickRadio(val) {
      if (val === 2) {
        this.flagFalse = true;
      } else {
        this.flagFalse = false;
      }
    },
    //复制配置提交
    submitAddCuse(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let ipTypes = [];
          for (let item of this.addSiteForm.ipTypes[0].ip.split("\n")) {
            ipTypes.push({
              ip: item,
              type: "web",
              ipType: 0,
              ableStatus: 1,
            });
          }
          let _paramsInfo = {
            realmName: splitArr(this.addSiteForm.realmName),
            groupName: this.addSiteForm.groupName,
            businessType: this.addSiteForm.businessType,
            quickenArea: this.addSiteForm.quickenArea,
            portNum: this.addSiteForm.portNum,
            type: this.addSiteForm.type,
            ipTypes: ipTypes,
            originPrivkey: this.addSiteForm.originPrivkey,
            originFullchain: this.addSiteForm.originFullchain,
            productId: this.productId,
            multiplexId: this.multiplexId,
          };
          if (this.reuse === true) {
            this.addNginxInfoNew(_paramsInfo);
          }
        } else {
          return false;
        }
      });
    },
    //复制配置
    addNginxInfoNew(_paramsInfo) {
      addNginxInfoNew(_paramsInfo).then((res) => {
        this.currentPage = 1;
        // 刷新列表
        // this.clearInput();
        this.fetchData();
        // 刷新完成后 需要关闭弹框
        this.dialogAddVisibleCouse = false;
      });
      // setTimeout(() => {
      //   this.addLoading = false;
      // }, 3000);
    },
    //点击新建分组弹框
    newdialog() {
      this.groupVisible = true;
    },
    //弹框新建分组确定
    newGroup(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addGroupName(this.ruleForm.newGroupName).then((res) => {
            if (res.code == 200) {
              this.groupTableData();
              this.groupVisible = false;
              this.$refs["ruleForm"].resetFields();
            }
          });
        } else {
          return;
        }
      });
    },
    newGroupClose() {
      this.groupVisible = false;
      this.$refs["ruleForm"].resetFields();
    },
  },
  watch: {
    tableData(newData) {
      // console.log(newData)
    },
  },
};
</script>

<style lang="scss">
.domain-manage {
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
      .el-select {
        width: 140px;
        .el-input {
          width: 130px;
        }
        .el-input__inner {
          width: 120px;
        }
      }
    }
  }
  .el-dialog {
    height: auto;
  }
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
  }
  .el-dialog__body {
    margin-left: 0;
  }
  .el-dialog__title {
    padding-left: 30px;
    margin: 0;
  }
  .el-select {
    width: 150px;
  }
  .el-radio-group {
    padding: 0;
    margin-left: 18px;
  }
  .el-checkbox-group {
    display: inline-block;
    margin-left: 18px;
  }
  .el-input {
    width: 260px;
    margin-left: 20px;
  }
  .el-textarea {
    width: 300px;
    margin-left: 20px;
  }
  .el-textarea__inner {
    width: 300px;
  }
  .el-form-item__label {
    display: inline-block;
    width: 70px;
    height: 30px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .demain-address {
    .el-form-item__error {
      position: absolute;
      top: 70px;
      left: 90px;
    }
  }
  .demain-name {
    .el-form-item__error {
      position: absolute;
      top: 40px;
      left: 90px;
    }
  }
  .search-name {
    .el-input__inner {
      width: 270px;
    }
  }
  .dialogIn {
    .el-dialog {
      height: 260px;
    }
    .el-dialog__header {
      height: 60px;
      line-height: 60px;
      background: #f9f9f9;
    }
    .el-dialog__title {
      padding-left: 30px;
      margin: 0;
    }
    .el-input {
      width: 300px;
      margin-top: 50px;
    }
    .el-input__inner {
      width: 300px;
    }
    .el-form-item__label {
      margin: 50px 0 0 50px;
    }
    .el-form-item__error {
      position: absolute;
      top: 93px;
      left: 140px;
    }
  }
}
</style>

<style lang="scss" scoped>
.domain-manage {
  padding: 0 30px 30px;
  background-color: #fff;
  .domain-title {
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
    .domain-button {
      display: inline-block;
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
    .domain-input {
      display: flex;
      align-items: center;
      justify-content: center;
      .domain-export {
        position: relative;
        width: 100px;
        height: 30px;
        span {
          position: absolute;
          width: 60px;
          height: 100%;
          text-align: center;
          line-height: 30px;
          background-color: rgba(0, 168, 150, 1);
          border-radius: 3px 3px;
        }
        img {
          position: absolute;
          top: 5px;
          left: 75px;
        }
      }
      .search-name {
        flex: 1;
        width: 350px;
      }
    }
  }
  .table {
    .el-input {
      width: 300px;
      height: 30px;
      margin: 5px 0 0px 20px;
    }
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin: 0 15px;
      color: #01a997;
      cursor: pointer;
    }
  }
  // .dialogDiv {
  p {
    padding: 10px 0 30px 35%;
    color: #6e6e6e;
  }
  .demain-a,
  .demain-b {
    width: 480px;
    height: 30px;
    font-size: 15px;
    color: #000;
    font-weight: 700;
    p {
      width: 100px;
      padding: 0;
      margin-top: 15px;
    }
  }
  .demain-b {
    border-top: 1px solid #eaeaea;
  }
  .demain-input {
    width: 480px;
    margin: auto;
    .demain-name,
    .demain-port {
      p {
        width: 180px;
        margin: 10px 0 0 90px;
        padding: 0;
        color: #6e6e6e;
      }
    }
    .demain-group,
    .demain-work {
      .el-select {
        width: 200px;
      }
    }
    .demain-group {
      span {
        display: inline-block;
        width: 80px;
        height: 35px;
        border: 1px solid #b7d1c9;
        color: #6e6e6e;
        text-align: center;
        line-height: 35px;
        border-radius: 3px 3px;
        cursor: pointer;
        margin-left: 110px;
      }
    }
    .demain-address {
      margin-top: 15px;
      p {
        color: #6e6e6e;
        width: 280px;
        margin: 10px 0 0 90px;
        padding: 0;
      }
    }
    .sourceHtp {
      margin-top: 15px;
      width: 480px;
    }
  }
  .hide {
    height: 260px;
    .oneBook,
    .twoBook {
      margin-left: 130px;
      label,
      .el-input {
        display: block;
        margin-left: 20px;
      }
    }
  }
  .addFooter {
    // height: 60px;
    text-align: center;
    .el-button {
      margin: 0 30px;
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
  }
  // }
}
</style>
