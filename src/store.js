import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";
import {
  getUserPerms,
  getUserInfo,
  logout,
  getVersionNum
} from "@/api/login";
import {
  constantRouterMap,
  asyncRouterMap,
  parentRouterMap,
  errorRouter
} from "./router";
import commonRouter from "./mock/commonRouter.json";
import {
  reject,
  resolve
} from "core-js/fn/promise";
Vue.use(Vuex);

// function recursionRouter(userRouter = [], allRouter = []) {
//   let realRoutes = []
//   // let parents = userRouter.filter(value => value.pId == '0')
//   let children = userRouter.filter(value => value.pId != '0' && value.open == true)
//   allRouter.forEach((v, i) => {
//     children.forEach((item, index) => {
//       if (item.name === v.meta.title) {
//         // if (item.children && item.children.length > 0) {
//         //   v.children = recursionRouter(item.children, v.children)
//         // }
//         realRoutes.push(v)
//       }
//     })
//   })
//   return realRoutes
// }

export default new Vuex.Store({
  state: {
    // 初始化状态
    // 版本号信息
    bxUid: "bxyunUid",
    bxIv: "baixunyun0000000",
    versionInfo: {
      updateFlag: "", // 0->不可升级，1->可升级
      updateStatus: "", // 1、4->升级中，2->升级成功，3->升级失败
      versionNum: ""
    },

    // 开票类型
    billingTypeList: ["个人", "企业"],
    // 发票类型
    invoiceTypeList: ["增值税普通发票"],
    // 发票状态
    billingStateList: [
      "开票中",
      "已开票",
      "退票中",
      "已红冲",
      "作废中",
      "已作废"
    ],
    // 合同状态
    contractStatusList: ["草稿", "正式", "作废"],
    // 导出状态
    fileStatusList: ["导出中", "导出成功", "导出失败", "文件过期"],
    // 导出类型
    fileTypeList: ["EXCEL", "CSV", "PDF"],
    // 交易类型
    transactionTypeList: [
      "充值",
      "退款",
      "提现",
      "冻结",
      "解冻",
      "扣费",
      "资金转入",
      "资金转出"
    ],
    // 交易渠道
    tradingChannelsList: [{
        text: "余额",
        value: 0
      },
      {
        text: "银行转账",
        value: 1
      },
      {
        text: "支付宝",
        value: 2
      },
      {
        text: "微信",
        value: 3
      },
      {
        text: "信用卡",
        value: 4
      }
    ],
    // 明细类型
    amountTypeList: ["收入", "支出"],
    // 订单类型
    orderTypeList: [{
        text: "新购",
        value: 0
      },
      {
        text: "续费",
        value: 1
      },
      {
        text: "升级",
        value: 2
      },
      {
        text: "降级",
        value: 3
      },
      {
        text: "退货",
        value: 4
      },
      {
        text: "调整",
        value: 5
      }
    ],
    // 订单状态
    orderStatusList: [{
        text: "待支付",
        value: 0
      },
      {
        text: "已支付",
        value: 1
      },
      {
        text: "处理中",
        value: 2
      },
      {
        text: "已取消",
        value: 3
      },
      {
        text: "已过期",
        value: 4
      },
      {
        text: "已退款",
        value: 5
      }
    ],
    // 购买方式
    purchaseMethodList: ["按量", "套餐"],
    //证书状态
    applyStatusList: [
      "未申请",
      "正在申请",
      "已经申请",
      "行程申请中",
      "申请失败",
      "取消申请"
    ],
    //费用中心提现状态
    withdrawalStateList: ["待提现", "提现成功", "提现失败"],
    //流量包状态
    flowPacketStateList: [{
        text: "使用中",
        value: 0
      },
      {
        text: "已抵扣",
        value: 1
      },
      {
        text: "已过期",
        value: 2
      }
    ],
    //域名管理状态
    nginxStateList: [{
        text: "未部署",
        value: 0
      },
      {
        text: "部署中",
        value: 1
      },
      {
        text: "部署成功",
        value: 2
      },
      {
        text: "部署失败",
        value: 3
      }
    ],
    //业务类型
    businessTypeList: [{
        text: "网站加速",
        value: 0
      },
      {
        text: "直播",
        value: 1
      }
    ],
    //HTTPS配置
    httpsSetList: [{
        text: '未配置',
        value: 0
      },
      {
        text: '已配置',
        value: 1
      }
    ],
    //回源协议
    sourceList: [{
        text: '',
        value: 0
      }, {
        text: 'HTTP',
        value: 1
      },
      {
        text: "HTTPS",
        value: 2
      }
    ],
    // 服务地域
    serveLocalList: [{
        text: "国内",
        value: 0
      },
      {
        text: "海外",
        value: 1
      },
      {
        text: "全球",
        value: 2
      }
    ],
    // 直播部署状态
    liveDeployStatusList: [{
        text: "未部署",
        value: 0
      },
      {
        text: "部署中",
        value: 1
      },
      {
        text: "部署成功",
        value: 2
      },
      {
        text: "部署失败",
        value: 3
      }
    ],
    // 证书申请状态
    sslStatusList: [{
        text: "未申请",
        value: 0
      },
      {
        text: "正在申请",
        value: 1
      },
      {
        text: "申请成功",
        value: 2
      },
      {
        text: "申请中",
        value: 3
      },
      {
        text: "申请失败",
        value: 4
      },
      {
        text: "取消申请",
        value: 5
      }
    ],
    //申请合同购买方式
    purchList: [{
      text: '包月',
      value: 0
    }, {
      text: "按量",
      value: 1
    }],
    // dns解析状态
    parseStatusList: [{
        text: "未解析",
        value: 0
      },
      {
        text: "解析中",
        value: 1
      },
      {
        text: "解析成功",
        value: 2
      },
      {
        text: "解析失败",
        value: 3
      }
    ],
    // 节点状态
    searchStatusList: [{
        text: "异常",
        value: 0
      },
      {
        text: "正常",
        value: 1
      }
    ],
    // 封禁类型
    banTypeList: [{
        text: "限时封禁",
        value: 0
      },
      {
        text: "永久封禁",
        value: 1
      }
    ],
    // 封禁状态
    banStatusList: [{
        text: "封禁中",
        value: 0
      },
      {
        text: "已解封",
        value: 1
      }
    ],
    // 节点类型
    productType: [{
        type: "普通节点",
        code: 1
      },
      {
        type: "备用节点",
        code: 2
      }
    ],
    // 主题颜色列表
    themeList: [{
        backgroundColor: "#4d71ee",
        color: "#fff"
      },
      {
        backgroundColor: "#304156",
        color: "#fff"
      }
    ],
    // 工单问题类型列表
    workTypeList: ["节点异常", "产品异常", "站点异常", "其他问题"],
    // 工单问题状态
    workStatusList: ["未处理", "已关闭"],
    themeWaf: {
      backgroundColor: "#00A896",
      color: "#fff"
    },
    themeOpen: {
      border: "1px solid #00A896",
      color: "#00A896"
    },
    theme: {
      backgroundColor: "#4d71ee",
      color: "#fff"
    },
    count: 0,
    token: "",
    navRouters: [],
    btnType: ["add", "update", "del", "alloc"],
    userInfo: {},
    roles: [],
    routers: constantRouterMap,
    addRouters: [],
    tilingRouters: [],
    btnList: [],
    // 线路类型
    recordLineList: [
      "默认",
      "境内",
      "境外"
      // ,
      // '电信',
      // '联通',
      // '移动'
    ],
    siteTypeList: ["后端IP", "源站域名"],
    // IP类型
    ipTypeList: ["web", "phone"],
    // 协议类型
    agreementList: [{
        agreement: "HTTP",
        code: 1
      },
      {
        agreement: "HTTPS",
        code: 2
      }
    ],
    parseTypeList: ["新增", "删除"],
    gzipTypeList: [{
        label: "html",
        name: "HTML"
      },
      {
        label: "css",
        name: "CSS"
      },
      {
        label: "js",
        name: "JS"
      },
      {
        label: "json",
        name: "JSON"
      }
    ],
    cacheTypeList: [{
        label: "html",
        name: "HTML"
      },
      {
        label: "css",
        name: "CSS"
      },
      {
        label: "js",
        name: "JS"
      },
      {
        label: "png",
        name: "PNG"
      },
      {
        label: "img",
        name: "IMG"
      },
      {
        label: "gif",
        name: "GIF"
      },
      {
        label: "flv",
        name: "FLV"
      },
      {
        label: "ico",
        name: "ICO"
      },
      {
        label: "swf",
        name: "SWF"
      }
    ],
    cacheTimeList: [{
        type: 1,
        label: "天"
      },
      {
        type: 2,
        label: "小时"
      },
      {
        type: 3,
        label: "分钟"
      }
    ],
    swichType: [0, 1],
    iconfontList: [
      "iconDNSguanli2",
      "iconyonghuguanli2",
      "iconanquanguanli2",
      "iconfengjinjilu2",
      "iconzhandianguanli2",
      "iconzhandianjiance2",
      "iconxitongguanli1",
      "iconquanxianguanli2",
      "iconzhanghaoguanli1",
      "iconzhuanyijilu1",
      "iconjiaoseguanli1",
      "iconjiedianguanli1",
      "iconchanpinguanli1",
      "icongerenxiangqing1",
      "iconcdnguanli",
      "iconcaozuorizhi1",
      "iconjiexijilu",
      "iconDNSguanli",
      "iconcaozuorizhi",
      "iconjiedianguanli",
      "iconchanpinguanli",
      "iconjiaoseguanli",
      "iconzhandianguanli",
      "iconquanxianguanli",
      "iconfengjinjilu",
      "iconjiexijilu1",
      "iconanquanguanli",
      "icongerenxiangqing",
      "iconzhuanyijilu",
      "iconyonghuguanli",
      "iconicon_accounts",
      "iconicon_system",
      "iconicon_cdn"
    ]
  },
  mutations: {
    // 处理状态
    increment(state, payload) {
      state.count += payload.step;
    },
    SET_USERINFO: (state, data) => {
      state.userInfo = data;
      state.userInfo.id = data.id;
      // console.log(data)
    },
    SET_ROLES(state, data) {
      state.roles = data;
      // console.log(data,999);
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.tilingRouters = routers.length ? routers[0].children : [];
      state.routers = constantRouterMap;
    },
    SET_BTNLIST: (state, btnList) => {
      state.btnList = btnList;
    },
    SET_NAV: (state, data) => {
      state.navRouters = data;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_VERSIONINFO(state, version) {
      state.versionInfo = version;
      localStorage.setItem("versionInfo", JSON.stringify(version));
    }
  },
  getters: {
    roles: state => state.roles,
    addRouters: state => state.addRouters,
    btnList: state => state.btnList,
    btnType: state => state.btnType,
    userInfo: state => state.userInfo,
    getToken: state => {
      // if (!state.token) {
      //   state.token = localStorage.getItem('token')
      // }
      state.token = localStorage.getItem("token");
      return state.token;
    },
    getVersion: state => {
      if (state.versionInfo.versionNum === "") {
        state.versionInfo = JSON.parse(localStorage.getItem("versionInfo"));
      }
      return state.versionInfo;
    }
  },
  actions: {
    // 提交改变后的状态
    increment(context) {
      context.commit("increment");
    },
    SET_USERINFO(context) {
      context.commit("SET_USERINFO");
    },
    GetUserPerms({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit("SET_ROLES", commonRouter);
        resolve(commonRouter);
      });
    },
    GetVersion({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getVersionNum()
          .then(response => {
            commit("SET_VERSIONINFO", response.data);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(response => {
            commit("SET_USERINFO", response.data);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    CleenAllState({
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit("SET_NAV", []);
        commit("SET_ROUTERS", []);
        commit("SET_BTNLIST", []);
        commit("SET_ROLES", []);
        resolve();
      });
    },
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROUTERS", []);
            commit("SET_BTNLIST", []);
            commit("SET_ROLES", []);
            localStorage.removeItem("token");
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GenerateRoutes({
      commit,
      state
    }) {
      return new Promise(resolve => {
        let _routers = state.roles;
        let _arr = [];
        let Tiling = function (arr) {
          let _asyRouter = [];
          if (arr != undefined && arr.length > 0) {
            _asyRouter = arr.map(item => {
              // let _path = '/' + item
              item.component = () => import(`./views${item.path}`);
              // console.log(item.path)
              // let _itemPath = JSON.parse(JSON.stringify(item.path)).split('/').pop()
              // item.path = _itemPath
              if (item.children != undefined && item.children.length > 0) {
                // _path = '/' + _path
                Tiling(item.children);
              }
              return item;
              // return {...item,
              //   component: () => import(`./views${item.path}`)
              //   // meta: { title: item.name , navTitle: item.parentName, navId: item.id }
              // }
            });
          }
          return _asyRouter;
        };
        _arr = Tiling(_routers);
        parentRouterMap.splice(1, parentRouterMap.length - 1);
        let MainContainer = parentRouterMap[0];
        let children = MainContainer.children;
        // children.splice(3, children.length - 3)
        parentRouterMap.push(errorRouter);
        children.push(..._arr);
        commit("SET_ROUTERS", parentRouterMap);
        resolve(_arr);
      });
    }
  }
});