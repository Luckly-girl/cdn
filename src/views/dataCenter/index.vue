<template>
  <div class="data-center">
    <div class="left">
      <div class="btn-wrap">
        <ul class="btn">
          <li
            class="pointer"
            :class="{ active: index === mark }"
            @click="btnClick(index)"
            v-for="(item, index) in btnList"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>

        <div
          class="selectBtn pointer"
          :class="{ active: btnSelected }"
          @click="btnSelectedClick"
        >
          筛选
        </div>
      </div>
      <div class="screen" v-show="btnSelected">
        <el-row class="group">
          <el-col :span="2">
            <div class="timedata">统计分组</div>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="groupId"
              placeholder="全部"
              @change="selectRealName"
              clearable
            >
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="realName">域名选择</el-col>
          <el-col :span="5">
            <el-input
              type="text"
              placeholder="请输入关键字"
              v-model="search"
            ></el-input>
            <div class="checkbox">
              <div>
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
              </div>
              <el-checkbox-group v-model="selectList" @change="selectChange">
                <el-checkbox v-for="item in items" :label="item" :key="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
          <el-col :span="4" class="selectName">
            <span>已选择（{{ selectSongersLen }}）</span>
            <!-- <span @click="clearAll">清除所有</span> -->
            <ul>
              <!-- 注意！注意！注意！这里循环遍历的是items，不再是data里的list数组 -->
              <li v-for="(item, index) in selectList" :key="index">
                <span>{{ item }}</span>
              </li>
            </ul>
          </el-col>
          <el-col :span="2" class="httpType">协议</el-col>
          <el-col :span="3">
            <el-select v-model="httpType" clearable placeholder="请选择">
              <el-option
                v-for="item in httpsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="confirmBtn">
            <div @click="searchAll">确定</div>
          </el-col>
        </el-row>
      </div>
      <div class="echarts-wrap">
        <ul>
          <li>
            <div class="name">
              <div>请求总数</div>
              Total Requests
            </div>
            <div class="echarts">
              <total-Req
                v-if="flowFlag"
                :domesticTotalRequestList="domesticTotalRequestList"
                :foreignTotalRequestList="foreignTotalRequestList"
                :timeList="timeList"
              ></total-Req>
            </div>
          </li>
          <li>
            <div class="name">
              <div>独立访客</div>
              UV
            </div>
            <div class="echarts">
              <uni-Que
                v-if="flowFlag"
                :domesticUniqueVisitorCountList="domesticUniqueVisitorCountList"
                :foreignUniqueVisitorCountList="foreignUniqueVisitorCountList"
                :timeList="timeList"
              ></uni-Que>
            </div>
          </li>
          <li>
            <div class="name">
              <div>带宽峰值</div>
              Peak Bandwidth
            </div>
            <div class="echarts">
              <peak-Band
                v-if="flowFlag"
                :domesticPeakBandwidthList="domesticPeakBandwidthList"
                :foreignPeakBandwidthList="foreignPeakBandwidthList"
                :timeList="timeList"
              ></peak-Band>
            </div>
          </li>
          <li>
            <div class="name">
              <div>已提供数据量(B)</div>
              Total Data Served
            </div>
            <div class="echarts">
              <flow-Val
                v-if="flowFlag"
                :domesticFlowValueList="domesticFlowValueList"
                :foreignFlowValueList="foreignFlowValueList"
                :timeList="timeList"
              ></flow-Val>
            </div>
          </li>
          <li>
            <div class="name">
              <div>已阻止的攻击数</div>
              Attack Blocked
            </div>
            <div class="echarts">
              <inter-Cept
                v-if="flowFlag"
                :domesticInterceptTotalList="domesticInterceptTotalList"
                :foreignInterceptTotalList="foreignInterceptTotalList"
                :timeList="timeList"
              ></inter-Cept>
            </div>
          </li>
          <li>
            <div class="name">
              <div>Web 流量请求（按国家/地区）</div>
              Top Traffic Countries / Regions
            </div>
            <div class="echarts">
              <count-Vos
                v-if="interFlag"
                :timeData="timeData"
                :domesticCountsList="domesticCountsList"
                :foreignCountryVosList="foreignCountryVosList"
                :foreignCountryList="foreignCountryList"
              ></count-Vos>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOverView,
  getOverViewCountryVo,
  getDomainNameByGroup,
} from "@/api/general.js";
import { splitArr } from "@/utils/filter";
import { queryGroupName } from "@/api/domain.js";
import totalReq from "./components/total-request";
import uniQue from "./components/uv";
import peakBand from "./components/peak-bandwidth";
import flowVal from "./components//total-data-served";
import interCept from "./components/attack-blocked";
import countVos from "./components/web-flow-requests";
export default {
  components: {
    totalReq,
    uniQue,
    peakBand,
    flowVal,
    interCept,
    countVos,
  },
  data() {
    return {
      btnList: ["24小时", "近7天", "近30天"],
      mark: 0,
      btnSelected: false,
      // value: 3,
      value2: [],
      dialogVisible: false,
      groupId: "",
      realNameStr: "",
      httpType: "",
      dep: 0,
      // safeValue: "本质上为关",
      search: "",
      checked: false,
      checkAll: false,
      isIndeterminate: true,
      // checkList:items,
      chooseAll: false,
      checkList: [],
      selectList: [],
      groupList: [],
      httpsList: [
        { id: 1, name: "http" },
        { id: 2, name: "https" },
      ],
      helpShow: false,
      // totalRequestVos: [], //请求总数
      domesticTotalRequestList: [],
      foreignTotalRequestList: [],
      timeList: [],
      timeData: [],
      flowFlag: false,
      //  uniqueVisitorTotalVos: [], //独立访客
      domesticUniqueVisitorCountList: [],
      foreignUniqueVisitorCountList: [],
      // peakBandwidthVos:[]  //宽带峰值
      domesticPeakBandwidthList: [],
      foreignPeakBandwidthList: [],
      // flowValueVos:[],   //已提供数据量
      domesticFlowValueList: [],
      foreignFlowValueList: [],
      // interceptTotalVos:[], //已阻止攻击数
      domesticInterceptTotalList: [],
      foreignInterceptTotalList: [],
      domesticCountsList: [], //web流量请求国内个数
      foreignCountryVosList: [], //国外数组
      foreignCountryList: [], //国外个数
      interFlag: false,
    };
  },
  computed: {
    items: function() {
      var _search = this.search;
      if (_search) {
        //不区分大小写处理
        var reg = new RegExp(_search, "ig");
        //  es6 filter过滤匹配，有则返回当前，无则返回所有
        return this.checkList.filter(function(e) {
          //匹配所有字段
          return Object.keys(e).some(function(key) {
            return e[key].match(reg);
          });
          //匹配某个字段
          return e.name.match(reg);
        });
      }
      return this.checkList;
    },
    selectSongersLen() {
      // return this.songList.filter(item => item.checked).length;
      let songer = this.selectList.filter((item) => item);
      return songer.length;
      // console.log(songer.length);
    },
  },
  created() {
    this.$nextTick(() => {
      this.fethdata();
      this.getOverViewCountryVo();
    });
  },
  mounted() {
    this.queryGroupName();
    this.selectRealName();
  },
  methods: {
    //折线图
    fethdata() {
      getOverView(
        this.mark,
        this.groupId,
        this.realNameStr,
        this.httpType
      ).then((res) => {
        (this.domesticTotalRequestList = res.data.totalRequestVos.map((obj) => {
          return obj.domesticTotalRequest;
        })),
          (this.foreignTotalRequestList = res.data.totalRequestVos.map(
            (obj) => {
              return obj.foreignTotalRequest;
            }
          )),
          (this.timeList = res.data.totalRequestVos.map((obj) => {
            return obj.time;
          })),
          (this.domesticUniqueVisitorCountList = res.data.uniqueVisitorTotalVos.map(
            (obj) => {
              return obj.domesticUniqueVisitorCount;
            }
          )),
          (this.foreignUniqueVisitorCountList = res.data.uniqueVisitorTotalVos.map(
            (obj) => {
              return obj.foreignUniqueVisitorCount;
            }
          )),
          (this.timeList = res.data.uniqueVisitorTotalVos.map((obj) => {
            return obj.time;
          })),
          (this.domesticPeakBandwidthList = res.data.peakBandwidthVos.map(
            (obj) => {
              return obj.domesticPeakBandwidth;
            }
          )),
          (this.foreignPeakBandwidthList = res.data.peakBandwidthVos.map(
            (obj) => {
              return obj.foreignPeakBandwidth;
            }
          )),
          (this.timeList = res.data.peakBandwidthVos.map((obj) => {
            return obj.time;
          })),
          (this.domesticFlowValueList = res.data.flowValueVos.map((obj) => {
            return obj.domesticFlowValue;
          })),
          (this.foreignFlowValueList = res.data.flowValueVos.map((obj) => {
            return obj.foreignFlowValue;
          })),
          (this.timeList = res.data.flowValueVos.map((obj) => {
            return obj.time;
          })),
          (this.domesticInterceptTotalList = res.data.interceptTotalVos.map(
            (obj) => {
              return obj.domesticInterceptTotal;
            }
          )),
          (this.foreignInterceptTotalList = res.data.interceptTotalVos.map(
            (obj) => {
              return obj.foreignInterceptTotal;
            }
          )),
          (this.timeList = res.data.interceptTotalVos.map((obj) => {
            return obj.time;
          }));
        this.flowFlag = true;
      });
    },
    //柱状图
    getOverViewCountryVo() {
      getOverViewCountryVo(
        this.mark,
        this.groupId,
        this.realNameStr,
        this.httpType
      ).then((res) => {
        (this.timeData = res.data.map((obj) => {
          return obj.time;
        })),
          (this.domesticCountsList = res.data.map((obj) => {
            return obj.domesticCounts;
          })),
          (this.foreignCountryVosList = res.data.map((obj) => {
            return obj.foreignCountryVos;
          })),
          (this.foreignCountryList = res.data.map((obj) => {
            return obj.foreignCounts;
          }));
        // console.log(this.domesticCountsList, this.foreignCountryVosList);
      });
      this.interFlag = true;
    },
    //获取分组列表
    queryGroupName() {
      queryGroupName().then((res) => {
        let groupList = [];
        res.data.rows.forEach((item) => {
          this.groupList.push({
            text: item.groupName,
            value: item.groupName,
            id: item.id,
          });
        });
      });
    },
    //获取域名
    async selectRealName() {
      const { data: res } = await getDomainNameByGroup(this.groupId);
      this.checkList = res;
      this.selectList = [];
      this.search = "";
      // console.log(value,1111);
    },
    //确定筛选
    searchAll() {
      getOverView(
        this.mark,
        this.groupId,
        this.realNameStr,
        this.httpType
      ).then((res) => {});
      this.fethdata();
      this.getOverViewCountryVo();
      this.btnSelected = false;
      this.groupId = "";
      this.httpType = "";
      this.realNameStr = "";
    },
    btnClick(ind) {
      // console.log(ind);
      this.mark = ind;
      this.fethdata();
      this.getOverViewCountryVo();
    },
    depClick(val) {
      this.dep = val;
    },
    btnSelectedClick() {
      this.selectRealName();
      this.btnSelected = !this.btnSelected;
    },
    attackDefenseModeChange(val) {
      this.dialogVisible = !val;
    },
    dialogClose() {
      this.helpShow = false;
    },
    //点击选中
    selectChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkList.length;
      let realNames = [];
      if (value != null && value.length != 0) {
        for (var i = 0; i < value.length; i++) {
          realNames.push(value[i]);
        }
      }
      this.realNameStr = realNames.toString();
      //  console.log(realNames, 1223122, this.realNameStr);
      // this.realNameStr = this.realNames;
    },
    //点击全选
    handleCheckAllChange(val) {
      this.selectList = val ? this.checkList : [];
      this.isIndeterminate = false;
      this.checked = true;
    },
  },
};
</script>

<style lang="scss">
.data-center {
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
  ._dia {
    .el-dialog__wrapper {
      bottom: auto;
    }
  }
}
.el-transfer-panel {
  width: 160px;
  display: inline-block;
}
.el-transfer__buttons {
  margin: 0;
  padding: 0;
  .el-button {
    width: 30px;
    background-color: #fff;
    margin: 5px;
    padding: 0;
    border: none;
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
@import "index.scss";
</style>
