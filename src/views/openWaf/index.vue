<template>
  <div class="open-waf">
    <div class="waf-title">WAF</div>
    <div class="wafButton">
      <span class="btn1" @click="btnForm" ref="btnForm">域名表单</span>
      <span class="btn2" @click="btnStatus" ref="btnStatus">防护状态</span>
    </div>
    <div class="table" v-show="flag">
      <el-table :data="searchMap" border stripe style="width: 100%">
        <el-table-column label="域名" prop="realmName"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == '0'"
              @click="statusClick(scope.row, 0, 1)"
              >关闭</span
            >
            <span
              v-if="scope.row.status == '1'"
              @click="statusClick(scope.row, 1, 1)"
              >开启</span
            >
          </template>
        </el-table-column>
        <el-table-column label="WEB应用防护" prop="webStatus">
          <template slot-scope="scope">
            <span
              v-if="scope.row.webStatus == 0"
              @click="statusClick(scope.row, 0, 1, 2)"
              >关闭</span
            >
            <span
              v-if="scope.row.webStatus == 1"
              @click="statusClick(scope.row, 1, 2)"
              >开启</span
            >
          </template>
        </el-table-column>
        <el-table-column label="DDOS防护" prop="ddosStatus">
          <template slot-scope="scope">
            <span
              v-if="scope.row.ddosStatus == 0"
              @click="statusClick(scope.row, 0, 3)"
              >关闭</span
            >
            <span
              v-if="scope.row.ddosStatus == 1"
              @click="statusClick(scope.row, 1, 3)"
              >开启</span
            >
          </template>
        </el-table-column>
        <el-table-column label="CC防护" prop="ccStatus">
          <template slot-scope="scope">
            <span
              v-if="scope.row.ccStatus == 0"
              @click="statusClick(scope.row, 0, 4)"
              >关闭</span
            >
            <span
              v-if="scope.row.ccStatus == 1"
              @click="statusClick(scope.row, 1, 4)"
              >开启</span
            >
          </template>
        </el-table-column>
        <el-table-column label="ACI防护" prop="aciStatus">
          <template slot-scope="scope">
            <span
              v-if="scope.row.aciStatus == 0"
              @click="statusClick(scope.row, 0, 5)"
              >关闭</span
            >
            <span
              v-if="scope.row.aciStatus == 1"
              @click="statusClick(scope.row, 1, 5)"
              >开启</span
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination ref="pagination" :total="total"></pagination> -->
      <el-dialog title="服务状态" :visible.sync="asyncDisable">
        <div class="serveStatus">
          <label style="margin-right: 15px">服务状态:</label>
          <el-switch
            v-model="switchOpen"
            active-color="#00A896"
            inactive-color="#B0B0B0"
          >
          </el-switch>
        </div>
        <p>（剩余域名：{{ realNameStatus.total }}）</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">取 消</el-button>
          <el-button type="primary" @click="successBook">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="table" v-show="flagTag">
      <div class="detialInfo">
        <p>已购买：基础版</p>
        <div class="midd">
          <span>剩余用量：200 </span>
          <span> 一级域名：3 </span>
          <span>二级域名：20</span>
          <span> 最近到期时间：2021年2月13日 14:35:00</span>
        </div>
        <span class="oneMore" @click="oneMoreClick">再次购买</span>
      </div>
      <div class="selectName">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="attack">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="攻击详情" name="first">
            <el-form>
              <el-form-item class="attackType">
                <label>攻击类型</label>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="attackIp">
                <label>攻击IP</label>
                <el-input></el-input>
              </el-form-item>
              <el-form-item class="timeMore">
                <ul>
                  <label>搜索时间</label>
                  <li
                    v-for="(item, index) in searchTime"
                    :key="index"
                    :class="{
                      active: index === mark,
                    }"
                    @click="searchClick(index)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </el-form-item>
              <el-form-item class="dataSelect">
                <el-date-picker
                  v-model="dateSearch"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <div class="searchText">搜索</div>
            </el-form>
            <div>
              <el-table :data="list" border stripe style="width: 100%">
                <el-table-column
                  label="攻击IP"
                  prop="realName"
                ></el-table-column>
                <el-table-column label="所属区域" prop="status">
                </el-table-column>
                <el-table-column label="攻击时间" prop="webProtection">
                </el-table-column>
                <el-table-column
                  label="攻击类型"
                  prop="fileName"
                ></el-table-column>
                <el-table-column label="攻击URL" prop="ccPro">
                </el-table-column>
                <el-table-column label="请求方法" prop="aciPro">
                </el-table-column>
                <el-table-column label="请求参数" prop="aciPro">
                </el-table-column>
                <el-table-column label="规则动作" prop="aciPro">
                </el-table-column>
                <el-table-column label="规则ID" prop="aciPro">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="攻击统计" name="second">
            <div class="attackStatis">
              <ul>
                <li
                  v-for="(item, index) in searchTime"
                  :key="index"
                  :class="{
                    active: index === mark,
                  }"
                  @click="searchClick(index)"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
            <div class="statement">
              <div class="safeSpread">
                <p>安全攻击类型分布</p>
                <img src="../../assets/images/cdn/noss.png" alt="" />
                <div>暂无数据</div>
              </div>
              <div class="attackSouce">
                <p>攻击来源IP TOP5</p>
                <img src="../../assets/images/cdn/noss.png" alt="" />
                <div>暂无数据</div>
              </div>
              <div class="attackArea">
                <p>攻击来源区域 TOP5</p>
                <img src="../../assets/images/cdn/noss.png" alt="" />
                <div>暂无数据</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import {
  queryRealmStatus,
  queryRealmNum,
  updateRealmStatus,
} from "@/api/waf.js";
export default {
  data() {
    return {
      total: 0,
      flag: true,
      flagTag: false,
      disableVisible: false,
      asyncDisable: false,
      switchOpen: false,
      dateSearch: "",
      searchMap: [],
      realNameStatus: {},
      index: null,
      name: "",
      sst: false,
      list: [
        {
          realName: "www.coco.com",
          status: "已开通",
          webProtection: "未开通",
          fileName: "未开通",
          ccPro: "未开通",
          aciPro: "已开通",
        },
        {
          realName: "www.soco.com",
          status: "已开通",
          webProtection: "未开通",
          fileName: "未开通",
          ccPro: "未开通",
          aciPro: "已开通",
        },
      ],
      options: [
        {
          value: 0,
          label: "域名1",
        },
        {
          value: 1,
          label: "域名2",
        },
        {
          value: 2,
          label: "全部",
        },
      ],
      value: "",
      activeName: "first",
      searchTime: [
        //搜索时间
        "昨天",
        "今天",
        "7天",
        "30天",
      ],
      mark: 0, // 默认下标
    };
  },
  created() {
    this.queryRealmStatus();
  },
  methods: {
    //获取列表
    queryRealmStatus() {
      queryRealmStatus().then((res) => {
        this.searchMap = res.data.rows;
      });
    },
    btnForm() {
      this.flag = true;
      this.flagTag = false;
      this.$refs.btnForm.style.backgroundColor = "#00A896";
      this.$refs.btnForm.style.color = "#fff";
      this.$refs.btnStatus.style.backgroundColor = "#fff";
      this.$refs.btnStatus.style.color = "#000";
    },
    btnStatus() {
      this.flagTag = true;
      this.flag = false;
      this.$refs.btnStatus.style.backgroundColor = "#00A896";
      this.$refs.btnForm.style.color = "#000";
      this.$refs.btnForm.style.backgroundColor = "#fff";
      this.$refs.btnStatus.style.color = "#fff";
    },
    //点击服务设置弹框出现
    serveSetHandle() {
      this.disableVisible = true;
    },
    //确定修改服务状态
    successBook() {
      updateRealmStatus(this.name, this.index, this.sst).then((res) => {
        this.asyncDisable = false;
        this.queryRealmStatus();
      });
    },
    //弹框取消
    resetForm() {
      this.disableVisible = false;
      this.asyncDisable = false;
    },
    //tabs点击切换
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //点击搜索时间
    searchClick(index) {
      this.mark = index;
    },
    //点击服务状态
    statusClick(row, val, index) {
      console.log(row);
      this.index = index;
      this.name = row.realmName;
      if (val == 0) {
        this.switchOpen = false;
        this.sst = 1;
      } else {
        this.switchOpen = true;
        this.sst = 0;
      }
      this.asyncDisable = true;

      queryRealmNum(row.realmName).then((res) => {
        this.realNameStatus = res.data.rows;
      });
    },
    //点击再次购买
    oneMoreClick() {
      this.$router.push("/cdn/openFirewall");
    },
  },
};
</script>

<style lang="scss">
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
      padding: 10px 0 30px 35%;
      color: #6e6e6e;
    }
  }
  .sshContent .el-input__inner,
  .bookContent .el-input__inner {
    height: 80px;
  }
  .serveStatus {
    padding-top: 35px;
    margin-left: 180px;
  }
  .dialog-footer {
    el-button:nth-child(1) {
      margin-left: 15px;
      margin-top: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.open-waf {
  padding: 0 30px 30px;
  background-color: #fff;
  .waf-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .wafButton {
    display: flex;
    width: 220px;
    .btn1,
    .btn2 {
      flex: 1;
      width: 95px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid #eeeeee;
      border-radius: 4px 4px;
    }
    .btn1 {
      color: #fff;
      background: rgba(0, 168, 150, 1);
    }
    span:nth-child(2) {
      margin-left: 30px;
    }
  }
  .table {
    .detialInfo {
      padding: 20px 30px;
      background-color: #f7f7f7;
      margin-bottom: 20px;
      p {
        font-weight: 700;
        font-size: 14px;
      }
      .midd {
        padding: 15px 0;
        font-size: 12px;
        color: #272727;
        span {
          padding-right: 70px;
        }
      }
      .oneMore {
        font-size: 14px;
        color: #00a896;
        cursor: pointer;
      }
    }
    .setSer,
    .proSet {
      color: #01a997;
      cursor: pointer;
    }
    .statusSwitch {
      margin-left: 50px;
    }
    .rowStyle {
      height: 60px;
      line-height: 60px;
      .el-switch {
        margin-left: 15px;
      }
    }
    .dialog-footer {
      .el-button:nth-child(1) {
        margin-right: 20px;
        background-color: #eeeeee;
        border: 1px solid #f4f4f4;
        color: #000;
      }
      .el-button:nth-child(2) {
        margin-left: 20px;
        background-color: #00a896;
      }
    }
    .attackType {
      display: inline-block;
      width: 230px;
      height: 50px;
      .el-select {
        width: 160px;
        margin-left: 10px;
      }
    }
    .attackIp {
      display: inline-block;
      width: 230px;
      height: 50px;
      margin-left: 30px;
      .el-input {
        width: 160px;
        margin-left: 10px;
      }
    }
    .timeMore {
      width: 400px;
      height: 50px;
      display: inline-block;
      margin-left: 30px;
    }
    ul {
      display: flex;
      align-items: center;
      label {
        margin-right: 10px;
      }
      li {
        height: 30px;
        line-height: 30px;
        padding: 0px 18px;
        border: 1px solid #bfbfbf;
        border-radius: 2px;
        font-size: 14px;
        color: #666666;
        margin-right: 16px;
        cursor: pointer;
      }
      li.active {
        border: 1px solid rgba(0, 168, 150, 1);
        color: rgba(0, 168, 150, 1);
      }
    }
    .dataSelect {
      width: 300px;
      height: 50px;
      display: inline-block;
      margin-left: 20px;
    }
    .searchText {
      width: 75px;
      height: 35px;
      background-color: #00a896;
      color: #fff;
      display: inline-block;
      font-size: 14px;
      text-align: center;
      margin-left: 75px;
      line-height: 35px;
      border-radius: 4px 4px;
      cursor: pointer;
    }
    .el-form-item {
      margin-top: 15px;
    }
    .attackStatis {
      margin: 20px 0;
    }
    .statement {
      display: flex;
      .safeSpread,
      .attackSouce,
      .attackArea {
        flex: 1;
        height: 260px;
        border: 1px solid #e5e5e5;
        margin-right: 25px;
        font-size: 15px;
        p {
          margin: 15px 0 0 20px;
        }
        img {
          width: 90px;
          height: 70px;
          display: block;
          margin: 0 auto;
          margin-top: 60px;
        }
        div {
          font-size: 13px;
          padding: 10px 0;
          text-align: center;
        }
      }
    }
  }
}
</style>
