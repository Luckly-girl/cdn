<template>
  <div class="isolation-strategy">
    <!-- 新增安全组弹框 -->
    <el-dialog
      :title="`新增${groupType[safetyGroupType]}安全组`"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="dialog_container">
        <ul class="_form">
          <li>
            <span>安全组名称：</span>
            <el-input :maxlength="10" placeholder="不可超过10个字符长度" v-model="groupName"></el-input>
          </li>
          <li v-show="safetyGroupType!=='3'">
            <span>{{groupType[safetyGroupType]}}IP：</span>
            <el-input :rows="5" placeholder="多个IP间用“，”分隔" type="textarea" autosize v-model="ipList"></el-input>
          </li>
          <li v-show="safetyGroupType==='3'">
            <span>放行国家：</span>
            <el-select v-model="country" multiple collapse-tags placeholder="请选择国家">
              <el-option
                v-for="cu of countryList"
                :key="`country_${cu.id}`"
                :label="cu.countryName"
                :value="cu.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div class="dialog-footer">
        <el-button @click.native="reset" class="_cancel_btn">重置</el-button>
        <el-button @click.native="add" type="primary" class="_save_btn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改安全组 -->
    <el-dialog
      :title="`修改${groupType[safetyGroupType]}安全组`"
      :visible.sync="reviseDialogVisible"
      width="500px"
    >
      <div class="dialog_container">
        <ul class="_form">
          <li>
            <span>安全组类型：</span>
            <el-select v-model="safetyType" placeholder="请选择">
              <el-option v-show="safetyGroupType!=='3'" label="白名单安全组" value="1"></el-option>
              <el-option v-show="safetyGroupType!=='3'" label="黑名单安全组" value="2"></el-option>
              <el-option v-show="safetyGroupType=='3'" label="国家隔离安全组" value="3"></el-option>
            </el-select>
          </li>
          <li>
            <span>安全组名称：</span>
            <el-input :maxlength="10" placeholder="不可超过10个字符长度" v-model="groupName"></el-input>
          </li>
          <li v-show="safetyGroupType!=='3'">
            <span>{{groupType[safetyGroupType]}}IP：</span>
            <el-input :rows="5" placeholder="多个IP间用“，”分隔" type="textarea" autosize v-model="ipList"></el-input>
          </li>
          <li v-show="safetyGroupType==='3'">
            <span>放行国家：</span>
            <el-select multiple collapse-tags v-model="country" placeholder="请选择国家">
              <el-option
                v-for="cu of countryList"
                :key="`country_${cu.id}`"
                :label="cu.countryName"
                :value="cu.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div class="dialog-footer revise_footer">
        <!-- <el-button @click.native="reset" class="_cancel_btn">重置</el-button> -->
        <span @click="groupReset" class="reset_btn">重置</span>

        <div>
          <el-button @click.native="deleteGroup" class="_cancel_btn">删除</el-button>
          <el-button @click.native="confirmRevise" type="primary" class="_save_btn">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 更多安全组 -->
    <el-dialog :title="`更多安全组数据`" :visible.sync="moreDialogVisible" width="500px">
      <div class="more_container">
        <domain-tag-group class="tag_container" v-model="groupSelectedArr">
          <domain-tag
            @change="reviseGroup"
            v-for="(item, index) in names"
            :key="index"
            :value="index"
            :label="item[`${groupAlia[safetyGroupType]}Name`]"
          ></domain-tag>
        </domain-tag-group>
      </div>
    </el-dialog>
    <div class="radio-box">
      <span class="_label">安全组：</span>
      <el-radio-group v-model="safetyGroupType" size="small">
        <el-radio label="1" border>白名单安全组</el-radio>
        <el-radio label="2" border>黑名单安全组</el-radio>
        <el-radio label="3" border>国家隔离安全组</el-radio>
      </el-radio-group>
    </div>
    <div class="set-box">
      <div class="security-group">
        <span class="_title">选择安全组：</span>
        <div>
          <el-button @click="addSafetyGroup" round icon="el-icon-plus" size="mini" class="_add_btn"></el-button>
          <!-- <div class="groups"> -->
          <domain-tag-group v-model="groupSelectedArr">
            <domain-tag
              @change="reviseGroup"
              v-for="(item, index) in top15Names"
              :key="index"
              :value="index"
              :label="item[`${groupAlia[safetyGroupType]}Name`]"
            ></domain-tag>
            <el-button
              v-show="names.length>15"
              @click="more"
              round
              icon="el-icon-more"
              size="mini"
              class="_add_btn"
            ></el-button>
          </domain-tag-group>

          <!-- </div> -->
        </div>
      </div>
      <div v-show="safetyGroupType!=='3'" class="security-group">
        <span class="_title">新增{{groupType[safetyGroupType]}}IP：</span>
        <div style="width:460px">
          <el-input
            :rows="5"
            placeholder="多个IP间用“，”分隔"
            type="textarea"
            autosize
            v-model="groupIpList"
          ></el-input>
        </div>
      </div>
      <div v-show="safetyGroupType=='3'" class="security-group">
        <span class="_title">放行国家：</span>
        <el-select multiple collapse-tags v-model="groupCountry" placeholder="请选择国家">
          <el-option
            v-for="cu of countryList"
            :key="`country_${cu.id}`"
            :label="cu.countryName"
            :value="cu.id"
          ></el-option>
        </el-select>
      </div>
    </div>

    <div class="switch_container">
      <div class="sp_left">
        <switch-item
          v-show="safetyGroupType==item.type"
          v-model="item.value"
          v-for="(item,index) in switchList"
          :key="item.id"
          :data="item"
        >
          <switch-item
            v-if="item.id==='countrySafe'&&(item.value===1)"
            v-model="item.child.value"
            :key="item.child.id"
            :data="item.child"
          ></switch-item>

          <div v-show="item.id=='logAnalysis'&&item.value==1">
            <div class="_in">
              <span>封禁时间:</span>
              <div class="put">
                <el-input @change="change($event,index,'banTime')" v-model.number="item.banTime"></el-input>
                <span>小时</span>
              </div>
            </div>
            <div class="_in">
              <span>封禁规则:</span>
              <div class="put">
                <el-input @change="change($event,index,'banRole')" v-model.number="item.banRole"></el-input>
                <span>次/分钟</span>
              </div>
            </div>
          </div>
        </switch-item>
      </div>
      <!-- <div class="sp_right">
        <switch-item v-model="item.value" v-for="item in listRight" :key="item.id" :data="item"></switch-item>
      </div>-->
    </div>

    <footer>
      <el-button @click="cancel" class="_cancel_btn">取消</el-button>
      <el-button type="primary" @click="save" class="_save_btn">保存</el-button>
    </footer>
  </div>
</template>
<script>
import DomainTag from "./domain-tag";
import DomainTagGroup from "./domain-tag-group";
import SwitchItem from "../traffic-strategy/switch-item";
import {
  getIsolationStrategy,
  saveWhiteGroup,
  getWhiteGroupListNew,
  delWhiteGroup,
  updateWhiteGroup,
  saveBlackGroup,
  delBlackGroup,
  updateBlackGroup,
  getBlackGroupListNew,
  getCountryGroupListNew,
  updateCountryGroup,
  delCountryGroup,
  saveCountryGroup,
  getCountryList,
  updateIsolationStrategy
} from "@/api/site";
export default {
  components: {
    DomainTag,
    SwitchItem,
    DomainTagGroup
  },
  data() {
    return {
      banTime: "",
      dialogVisible: false,
      moreDialogVisible: false,
      reviseDialogVisible: false,
      safetyType: "1", //安全组类型
      country: [], //放行国家
      groupSelectedList: [], //已选择的组
      groupCountry: [],
      countryList: [],
      groupSelectedArr: [],
      groupName: "",
      ipList: "",
      reviseId: "", //修改安全组的id
      safetyGroupType: "1",
      top15Names: [],
      names: [],
      groupIpList: "",
      groupType: {
        1: "白名单",
        2: "黑名单",
        3: "国家隔离"
      },
      groupAlia: {
        1: "whiteGroup",
        2: "blackGroup",
        3: "countryGroup"
      },
      whiteList: "",
      switchList: [
        {
          id: "whiteOnoff",
          title: "白名单",
          value: 0,
          type: "1",
          text:
            "域名白名单”管理制度是CNNIC基于现行政策所推出的便民制度。CN、TOP等域名的注册者只要通过了CNNIC的审核进入“白名单”,就可以简化域名注册、过户、交易出售等操作。"
        },
        {
          id: "countrySafe",
          title: "国家限制",
          value: 0,
          type: "3",
          text:
            "通过无法访问互联网的封闭网络保护重要资产，攻击者不能与隔离网络直接通过网络接触，传统攻击渗透手段都会失效。",
          child: {
            id: "paidVersionFree",
            title: "",
            value: 0,
            text: "是否使用收费版"
          }
        },
        {
          id: "blackOnoff",
          title: "黑名单",
          value: 0,
          type: "2",
          text:
            "黑名单是设置不能通过的用户，黑名单以外的用户都能通过。所以多数情况下白名单比黑名单限制的用户要更多一些。"
        },
        {
          id: "logAnalysis",
          title: "日志分析黑名单",
          type: "2",
          value: 0,
          banTime: 2,
          banRole: 20,
          text:
            "日志服务（Log Service，简称 SLS）是针对日志类数据的一站式服务，在佰讯云经历大量大数据场景锤炼而成。您无需开发就能快捷完成日志数据采集、消费、投递以及查询分析等功能。"
        }
      ]
    };
  },
  computed: {
    id() {
      return JSON.parse(this.$route.query.data).id;
    },
    queryData() {
      return JSON.parse(this.$route.query.data);
    }
  },
  created() {
    this.initData();
  },
  methods: {
    //初始化所有数据
    initData() {
      this.safetyType = this.safetyGroupType;

      this.groupTypeContext(this.safetyGroupType, "init");
      this.getAllGroupOperation();
      getCountryList().then(res => {
        if (res.code == 200) {
          this.countryList = res.data.rows;
        }
      });
    },
    getAllGroupOperation() {
      let type = {
        "1": "white",
        "2": "black",
        "3": "country"
      };
      getIsolationStrategy(this.id).then(res => {
        if (res.code == 200) {
          this.groupCountry = res.data.countrys;
          this.switchList[0].value = res.data.whiteOnoff || 0;
          this.switchList[1].value = res.data.countrySafe || 0;
          this.switchList[1].child.value = res.data.paidVersionFree || 0;
          this.switchList[2].value = res.data.blackOnoff || 0;
          this.switchList[3].value = res.data.logAnalysis || 0;
          this.switchList[3].banTime = res.data.banTime || 2;
          this.switchList[3].banRole = res.data.banRole || 20;
          this.groupSelectedList =
            res.data[`${this.groupAlia[this.safetyGroupType]}s`];
          this.groupIpList =
            res.data[`${type[this.safetyGroupType]}Lists`] || "";
        }
      });
    },
    //回选安全组
    groupSelected(arr) {
      this.groupSelectedArr = arr.reduce((acc, cur) => {
        let index = this.names.findIndex((item, index) => {
          return item[`${this.groupAlia[this.safetyGroupType]}Id`] == cur;
        });

        acc.push(index);
        return acc;
      }, []);
    },
    //获取选中安全组的id
    getGroupId(arr) {
      return arr.reduce((acc, cur) => {
        acc.push(this.names[cur][`${this.groupAlia[this.safetyGroupType]}Id`]);
        return acc;
      }, []);
    },
    addSafetyGroup() {
      this.groupName = "";
      this.ipList = "";
      this.country = [];
      this.dialogVisible = true;
    },
    add() {
      if (this.safetyGroupType !== "3") {
        if (!this.groupName || !this.ipList) {
          return void this.$message.error(
            `请输入${this.groupType[this.safetyGroupType]}安全组相关信息`
          );
        }
      } else {
        if (!this.groupName || !this.country.length) {
          return void this.$message.error(
            `请输入${this.groupType[this.safetyGroupType]}安全组相关信息`
          );
        }
      }

      this.groupTypeContext(this.safetyGroupType, "add");
    },
    //查看更多安全组
    more() {
      this.moreDialogVisible = true;
    },
    reset() {
      this.groupName = "";
      this.ipList = "";
      this.country = [];
    },
    //白名单安全组
    getWhiteGroupListNew() {
      getWhiteGroupListNew(this.id).then(res => {
        if (res.code == 200) {
          this.top15Names = res.data.slice(0, 15);
          this.names = res.data;
          this.groupSelected(this.groupSelectedList);
        }
      });
    },
    //黑名单安全组
    getBlackGroupListNew() {
      getBlackGroupListNew(this.id).then(res => {
        if (res.code == 200) {
          this.top15Names = res.data.slice(0, 15);
          this.names = res.data;
          this.groupSelected(this.groupSelectedList);
        }
      });
    },
    //国家安全组
    getCountryGroupListNew() {
      getCountryGroupListNew(this.id).then(res => {
        if (res.code == 200) {
          this.top15Names = res.data.slice(0, 15);
          this.names = res.data;
          this.groupSelected(this.groupSelectedList);
        }
      });
    },
    groupTypeContext(type, action) {
      let methods = {
        "1": {
          init: this.getWhiteGroupListNew,
          add: this.saveWhiteGroup,
          delete: this.delWhiteGroup,
          revise: this.updateWhiteGroup
        },
        "2": {
          init: this.getBlackGroupListNew,
          add: this.saveBlackGroup,
          delete: this.delBlackGroup,
          revise: this.updateBlackGroup
        },
        "3": {
          init: this.getCountryGroupListNew,
          add: this.saveCountryGroup,
          delete: this.delCountryGroup,
          revise: this.updateCountryGroup
        }
      };
      return Promise.resolve(
        methods[type] && methods[type][action] && methods[type][action]()
      );
    },
    //修改安全组
    reviseGroup(val) {
      this.reviseId = val;
      let alia = this.groupAlia[this.safetyGroupType];
      this.groupName = this.names[val][`${alia}Name`];
      this.ipList = this.names[val][`${alia}Ips`];
      this.country = this.names[val].countryIds
        ? this.names[val].countryIds.split(",")
        : [];
      this.safetyType = this.safetyGroupType;
      this.reviseDialogVisible = true;
    },
    change(num, index, type) {
      if (Number.isNaN(Number(num)) || !Number(num)) {
        if (type == "banTime") {
          this.switchList[index][type] = 2;
        } else if (type == "banRole") {
          this.switchList[index][type] = 20;
        }
      } else {
        this.switchList[index][type] = Number(num);
      }
    },
    saveWhiteGroup() {
      saveWhiteGroup({
        whiteGroupName: this.groupName,
        whiteGroupIps: this.ipList
      }).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.initData();
        }
      });
    },
    saveBlackGroup() {
      saveBlackGroup({
        blackGroupName: this.groupName,
        blackGroupIps: this.ipList
      }).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.initData();
        }
      });
    },
    saveCountryGroup() {
      saveCountryGroup({
        countryGroupName: this.groupName,
        countryIds: this.country
      }).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.initData();
        }
      });
    },

    delWhiteGroup() {
      delWhiteGroup({
        whiteGroupId: this.names[this.reviseId].whiteGroupId
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    delBlackGroup() {
      delBlackGroup({
        blackGroupId: this.names[this.reviseId].blackGroupId
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    delCountryGroup() {
      delCountryGroup({
        countryGroupId: this.names[this.reviseId].countryGroupId
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    updateWhiteGroup() {
      updateWhiteGroup({
        whiteGroupId: this.names[this.reviseId].whiteGroupId,
        whiteGroupIps: this.ipList,
        whiteGroupName: this.groupName
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    updateBlackGroup() {
      updateBlackGroup({
        blackGroupId: this.names[this.reviseId].blackGroupId,
        blackGroupIps: this.ipList,
        blackGroupName: this.groupName
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    updateCountryGroup() {
      updateCountryGroup({
        countryGroupId: this.names[this.reviseId].countryGroupId,
        countryGroupName: this.groupName,
        countryIds: this.country
      }).then(res => {
        if (res.code == 200) {
          this.reviseDialogVisible = false;
          this.initData();
        }
      });
    },
    //删除安全组
    deleteGroup() {
      this.$confirm("此操作将永久删除该安全组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupTypeContext(this.safetyGroupType, "delete");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //确认修改
    confirmRevise() {
      if (this.safetyGroupType !== "3") {
        if (!this.groupName || !this.ipList) {
          return void this.$message.error(
            `请输入${this.groupType[this.safetyType]}安全组相关信息`
          );
        }
      } else {
        if (!this.groupName || !this.country.length) {
          return void this.$message.error(
            `请输入${this.groupType[this.safetyType]}安全组相关信息`
          );
        }
      }

      if (this.safetyGroupType !== this.safetyType) {
        this.groupTypeContext(this.safetyGroupType, "delete").then(res => {
          this.groupTypeContext(this.safetyType, "add").then(res2 => {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            this.reviseDialogVisible = false;
          });
        });
      } else {
        this.groupTypeContext(this.safetyGroupType, "revise");
      }
    },

    //重置
    groupReset() {
      let alia = this.groupAlia[this.safetyGroupType];
      this.groupName = this.names[this.reviseId][`${alia}Name`];
      this.ipList = this.names[this.reviseId][`${alia}Ips`];
      this.country = this.names[this.reviseId].countryIds
        ? this.names[this.reviseId].countryIds.split(",")
        : [];
    },
    cancel() {
      this.$message.success({
        message: "已取消所有操作",
        duration: 1000,
        onClose: () => {
          this.initData();
        }
      });
    },
    save() {
      let type = {
        "1": "white",
        "2": "black",
        "3": "country"
      };
      if (this.safetyGroupType != "3") {
        updateIsolationStrategy({
          siteId: this.id,
          [`${type[this.safetyGroupType]}Groups`]: this.getGroupId(
            this.groupSelectedArr
          ),
          [`${type[this.safetyGroupType]}Lists`]: this.groupIpList,
          whiteOnoff:
            this.safetyGroupType == "1" ? this.switchList[0].value : undefined,
          blackOnoff:
            this.safetyGroupType == "2" ? this.switchList[2].value : undefined,
          logAnalysis:
            this.safetyGroupType == "2" ? this.switchList[3].value : undefined,
          safeSel: this.safetyGroupType / 1,
          banTime:
            this.safetyGroupType == "2"
              ? this.switchList[3].banTime
              : undefined,
          banRole:
            this.safetyGroupType == "2" ? this.switchList[3].banRole : undefined
        });
      } else {
        updateIsolationStrategy({
          siteId: this.id,
          [`${type[this.safetyGroupType]}Groups`]: this.getGroupId(
            this.groupSelectedArr
          ),
          [`${type[this.safetyGroupType]}s`]: this.groupCountry,
          countrySafe: this.switchList[1].value,
          paidVersionFree: this.switchList[1].value
            ? this.switchList[1].child.value
            : 0,
          safeSel: this.safetyGroupType / 1
        });
      }
    }
  },
  watch: {
    safetyGroupType(val) {
      this.groupSelectedArr = [];
      this.initData();
    },
    groupSelectedArr(val) {
    }
  }
};
</script>
<style lang="scss" scoped>
.isolation-strategy {
  padding: 24px 35px;
  width: 100%;
  font-size: 12px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(236, 238, 241, 1);
  box-sizing: border-box;
  margin: 12px 0px;
  ._title {
    display: flex;
    align-items: flex-start;
    min-width: 90px;
    flex-shrink: 0;
    margin-top: 5px;
  }
  .set-box {
    padding: 19px 12px;
    margin-top: 15px;
    margin-left: 50px;
    // height: 185px;
    background: rgba(249, 249, 249, 1);
    .unit {
      display: flex;
      margin-top: 20px;
      .textarea {
        width: 464px;
      }
    }
  }
  .switch_container {
    display: flex;
    justify-content: space-between;
    margin-top: 22px;
    .sp_left,
    .sp_right {
      background-color: #fff;
      flex: 1;
    }
    .sp_left {
      margin-right: 20px;
      ._in {
        display: flex;
        align-items: center;
        margin: 10px;
        .put {
          flex-basis: 250px;
          display: flex;
          align-items: center;
          span {
            flex-basis: 150px;
            flex-shrink: 0;
            margin-left: 10px;
            color: red;
          }
        }
        span {
          margin-right: 10px;
        }
      }
    }
  }
  .radio-box {
    display: flex;
    align-items: center;
    ._label {
      width: 50px;
    }
  }
  .groups {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 10px;
    & > div {
      margin-left: 0;
    }
  }
  .security-group {
    display: flex;
    margin-top: 15px;
  }
  .radio-box > span {
    color: #020202;
  }
  footer {
    margin-top: 30px;
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

  .dialog_container {
    padding: 0 50px;
    color: #272727;
    ._form {
      li {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        span {
          flex-shrink: 0;
          flex-basis: 90px;
        }
      }
    }
  }
  .revise_footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    .reset_btn {
      color: #5ec5f3;
      cursor: pointer;
    }
  }
  .more_container {
    height: 255px;
    padding: 10px 30px;
    margin: 0 10px;
    overflow-y: auto;
    border: 1px solid rgba(238, 238, 238, 1);
    .tag_container {
      justify-content: space-between;
    }
  }
}
</style>
<style lang="scss">
@import "@styles/theme.scss";
.isolation-strategy {
  .el-radio {
    .el-radio__input {
      display: none;
    }
  }
  .el-radio.is-bordered {
    margin-right: 10px;
  }
  .el-radio.is-bordered.is-checked {
    background-color: $theme-color;
    .el-radio__label {
      color: #ffffff;
    }
  }
  ._add_btn {
    padding: 7px 45px;
    .el-icon-plus {
      color: $theme-color;
      font-size: 12px;
      font-weight: bold;
    }
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
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-dialog .el-textarea__inner {
    width: 100%;
  }
}
</style>
