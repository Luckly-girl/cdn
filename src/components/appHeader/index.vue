<template>
  <div
    class="header"
    @click="
      allListShow = false;
      quickListShow = false;
    "
  >
    <h1>
      <img src="@/assets/images/v4.0/logo.png" @click="gotoShouye" alt="" />
    </h1>
    <div class="header-right dis sp-be">
      <div class="h-r-l dis">
        <div class="menu-btn">
          <i class="iconfont iconcaidan" @click.stop="menuListClick"></i>
          <transition name="el-fade-in">
            <div
              class="mengceng"
              v-if="quickListShow"
              @click="
                allListShow = false;
                quickListShow = false;
              "
            ></div>
          </transition>
          <div class="menu-content dis" v-show="quickListShow">
            <div class="quick-menu">
              <div
                class="quick-menu-header dis center"
                @click.stop="allListShow = !allListShow"
              >
                产品库
              </div>
              <ul class="quick-menu-list dis">
                <li>
                  <i class="iconfont iconyunfuwuqi"></i><span>云服务器</span>
                </li>
                <li>
                  <i class="iconfont iconcunchu"></i><span>对象存储</span>
                </li>
                <li><i class="iconfont iconshuju"></i><span>云数据库</span></li>
                <li>
                  <i class="iconfont iconfuzaijunheng"></i><span>负载均衡</span>
                </li>
                <li class="active-quick" @click="goToClick">
                  <i class="iconfont iconCDN"></i><span>CDN</span>
                </li>
                <li>
                  <i class="iconfont iconanquan"></i><span>网络安全</span>
                </li>
              </ul>
            </div>
            <div class="all-menu dis" v-show="allListShow">
              <dl
                v-for="(routerItem, index) in routerData"
                :key="index"
                class="dis"
              >
                <dt>{{ routerItem.meta.name }}</dt>
                <dd>
                  <ul class="dis">
                    <li v-for="(item, ind) in routerItem.children" :key="ind">
                      {{ item.meta.name }}
                    </li>
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <ul class="img-span">
          <li><i class="iconfont icongailan"></i><span>概览</span></li>
        </ul>
        <div class="header-input dis sp-be">
          <el-autocomplete
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入产品及服务关键字"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
          <i class="el-icon-search"></i>
        </div>
      </div>
      <div class="h-r-r dis sp-be">
        <ul class="img-span dis">
          <li><i class="iconfont iconbangzhu"></i><span>帮助</span></li>
          <li><i class="iconfont iconxiaoxi"></i><span>消息</span></li>
          <li><i class="iconfont iconbeian"></i><span>备案</span></li>
          <li><i class="iconfont icongongdan"></i><span>工单</span></li>
        </ul>
        <el-dropdown
          szie="medium"
          class="workorder-dropdown"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{ userInfo.username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="header_top">
              <span>账户余额 </span>
              <span @click="$router.push('/expenseCenter/recharge')"
                >立即充值</span
              >
            </div>
            <p class="money">{{ money}}元</p>
            <div class="header_banner">
              <span>卡券</span>
              <span>续费</span>
              <span @click="$router.push('/expenseCenter/invoice')">发票</span>
            </div>
            <el-dropdown-item command="sub">账号信息</el-dropdown-item>
            <el-dropdown-item command="expenseCenter" divided
              >费用</el-dropdown-item
            >
            <el-dropdown-item command="logout" divided
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- <div class="act-img-btn">
      <el-dropdown class="workorder-dropdown" @command="handleCommand">
        <span class="el-dropdown-link">
          意见反馈 
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="sub">提交反馈</el-dropdown-item>
          <el-dropdown-item command="his" divided>历史反馈</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="user">
      <img class="icons" src="@/assets/images/login/user.jpg" alt="">
      <span class="username">{{userInfo.username}}</span>
    </div>
    <div class="act-img-btn act-img-btn-other" @click="openMsg">
      <el-badge :value="num" :max="99" :hidden="!num">
        <i class="iconfont  iconbutton_message"></i>
      </el-badge>
    </div>
    <i class="iconfont logout iconbutton_exit act-img-btn" @click="handleLogout"></i> -->
  </div>
</template>

<script>
import { baseHost, baseWs } from "@/utils/env.js";
import { queryOpenCdn, queryAmount } from "@/api/cdn.js";
import Bus from "@/utils/bus";
import routerData from "@/mock/router.json";
export default {
  data() {
    return {
      quickListShow: false,
      allListShow: false,
      routerData: routerData,
      user: "",
      num: 0,
      money: {},
      disConnect: false,
      websock: null,
      tt: null,
      lockReconnect: false,
      timer: null,
      heartCheck: {
        _that: this,
        timeout: 60 * 1000 * 9.5, //每隔三秒发送心跳
        // timeout: 15000, //每隔三秒发送心跳
        severTimeout: 5000, //服务端超时时间
        num: 3, //3次心跳均未响应重连
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function() {
          //接收成功一次推送，就将心跳检测的倒计时重置为30秒
          clearTimeout(this.timeoutObj); //重置倒计时
          this.start();
        },
        // start: function() {
        //   var _this = this;
        //   this.timeoutObj && clearTimeout(this.timeoutObj);
        //   this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        //   this.timeoutObj = setTimeout(function() {
        //     //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //     //onmessage拿到返回的心跳就说明连接正常
        //     _this._that.websocketsend(); // 心跳包
        //     _this.serverTimeoutObj = setTimeout(function() {
        //       _this._that.websocketclose();
        //     }, _this.severTimeout);
        //   }, this.timeout);
        // },
      },
    };
  },
  created() {
    // this.webSocketTest();
    this.queryAmount();
    Bus.$off("getMsgNum");
  },
  mounted() {
    // let _this = this;
    // Bus.$on("getMsgNum", (data) => {
    //   if (data) {
    //     _this.websocketsend("发送数据" + new Date());
    //   }
    // });
    // Bus.$on("loginOut", (data) => {
    //   if (data) {
    //     _this.disConnect = true;
    //     _this.websock.onclose = _this.websocketclose;
    //     _this.websock.close();
    //   }
    // });
    // Bus.$on("loginIn", (data) => {
    //   if (data) {
    //     _this.websock.close();
    //     _this.reconnect(_this.wsuri);
    //   }
    // });
    window.addEventListener("online", this.updateOnlineStatus, false);
    window.addEventListener("offline", this.updateOnlineStatus, false);
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    // wsuri() {
    //   return baseWs + baseHost + "/api/websocket/" + this.userInfo.id;
    // },
  },
  watch: {
    $route(to, form) {
      if (to.path == "/expenseCenter") {
        this.queryAmount();
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus, false);
    window.removeEventListener("offline", this.updateOnlineStatus, false);
  },
  // watch: {
  //   websock: {
  //     handler (n, o) {
  //     },
  //     deep: true
  //   },
  // },
  methods: {
    //点击cdn
    async goToClick() {
      const { data: resCdn } = await queryOpenCdn();
      if (resCdn === true) {
        this.$router.push("/cdn/basicFacts");
      } else {
        this.$router.push("/cdn/cdn");
      }
      // console.log(resCdn);
    },
    //点击跳转首页
    gotoShouye() {
      this.$router.push("/cdn/home");
    },
    menuListClick() {
      this.quickListShow = !this.quickListShow;
      if (!this.quickListShow) {
        this.allListShow = false;
      }
    },
    queryAmount() {
      queryAmount().then((res) => {
        if (res.code === 200) {
          this.money = res.data;
        }
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      // console.log(item);
    },
    webSocketTest() {
      // const h = this.$createElement
      let _this = this;
      this.disConnect = false;
      if ("WebSocket" in window) {
        // console.log("您的浏览器支持 WebSocket!");
        // 打开一个 web socket
        this.websock = new WebSocket(_this.wsuri);
        this.websock.onmessage = _this.websocketonmessage;
        this.websock.onopen = _this.websocketonopen;
        this.websock.onerror = _this.websocketonerror;
        this.websock.onclose = _this.websocketclose;
      }
    },
    websocketonopen() {
      // this.websocketsend("发送数据"+new Date());
      this.heartCheck.start();
    },
    // websocketonmessage(evt) {
    //   let _that = this;
    //   let received_msg = JSON.parse(evt.data);
    //   console.log("数据已接收..." + new Date().toLocaleString());
    //   _that.num = received_msg.count;
    //   if (received_msg.msgPop) {
    //     _that.$notify({
    //       title: "您有新消息，请注意查收",
    //       duration: 2000,
    //       dangerouslyUseHTMLString: true,
    //       position: "bottom-right",
    //     });
    //     Bus.$emit("refushPage", received_msg.refushPage);
    //   }
    //   this.heartCheck.reset();
    // },
    // websocketsend(Data) {
    //   //数据发送
    //   console.log("数据发送..." + new Date().toLocaleString());
    //   this.websock.send(Data);
    // },
    // websocketclose(e) {
    //   // 关闭 websocket
    //   console.log("心跳已关闭..." + new Date().toLocaleString());
    //   // console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    //   this.websock.close();
    //   if (!this.disConnect) {
    //     this.reconnect(this.wsuri);
    //   }
    // },
    // websocketonerror() {
    //   // 关闭 websocket
    //   console.log("心跳错误..." + new Date().toLocaleString());
    //   let flag = true;
    //   this.reconnect(this.wsuri, flag);
    // },
    // reconnect(url, flag) {
    //   // 心跳重连
    //   console.log("心跳重连" + new Date().toLocaleString());
    //   let _that = this;
    //   if (this.lockReconnect || flag) {
    //     return;
    //   }
    //   this.lockReconnect = true;
    //   //没连接上会一直重连，设置延迟避免请求过多
    //   this.tt && clearTimeout(this.tt);
    //   this.tt = setTimeout(function() {
    //     if (!this.disConnect) {
    //       _that.createWebSocket(url);
    //       _that.lockReconnect = false;
    //     }
    //   }, 4000);
    // },
    // createWebSocket() {
    //   console.log("心跳重连" + new Date().toLocaleString());
    //   try {
    //     this.websock = new WebSocket(this.wsuri);
    //     this.webSocketTest();
    //   } catch (e) {
    //     if (!this.disConnect) this.reconnect(this.wsuri);
    //   }
    // },
    // updateOnlineStatus(e) {
    //   const { type } = e;
    //   this.onLine = type === "online";
    //   if (this.onLine) {
    //     this.lockReconnect = false;
    //     this.disConnect = false;
    //     this.reconnect(this.wsuri);
    //   } else {
    //     this.disConnect = true;
    //   }
    // },
    // openMsg() {
    //   Bus.$emit("openMsg", true);
    // },
    handleCommand(command) {
      if (command === "expenseCenter") {
        this.$router.push("/expenseCenter");
      } else if (command === "logout") {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style>
.header-input .el-input__inner {
  border: 0;
  padding: 0;
  background: transparent;
}
</style>

<style scoped lang="stylus">
.header-input{
  width:220px;
  height:35px;
  border:1px solid #eee;
  border-radius:23px;
  padding: 0 20px;
  .inline-input{
    width 80%
  }
  i{
    font-size 28px;
    color #00A896;
  }
}
.el-dropdown-menu__item{
  text-align:round
}
.workorder-dropdown{
  display flex;
  padding 10px;
  .el-dropdown-link{
    flex 1
    color #505050;
    font-size 16px;
    cursor pointer
    text-align right
    height 60px;
    line-height 60px
    margin-left 70px
    &:after{
      font-family 'iconfont'
      content "\e615";
      position absolute;
      right -18px
    }
  }
}
  .header_top{
    display:flex;
    width:200px
    height:20px
    margin:5px 10px;
    span{
      flex:1
      font-size :12px

    }
   span:nth-child(1){
     text-align :round
   }
    span:nth-child(2){
      color:#04A998
      cursor pointer
      text-align:end
    }
  }
  .money{
    height :30px
    margin:10px
    font-size:16px
    font-weight :700
  }
  .header_banner{
    display:flex
    height 40px
    span{
      flex:1
      height :25px;
      text-align:center
      line-height :25px
      font-size 12px
      color:#fff
      background-color:#04A998
      margin :0 7px
      cursor pointer
    }
  }
  .act-img-btn-other{
    margin 0 25px!important
  }
  .header{
    position: fixed;
    z-index 300;
    box-sizing border-box;
    height: 60px;
    top: 0;
    left: 0;
    min-width: 1400px;
    background #fff;
    right: 0px;
    display flex
    align-items center
    h1{
      background #00A896
      height 100%
      display flex
      align-items center
      justify-content center
      width 190px
      cursor pointer
    }
    .header-right{
      width calc(100vw - 190px)
      height 100%
      box-shadow 0px 6px 6px 0px rgba(2,2,2,0.08);
    }
    .h-r-l{
      height 100%
      align-items center
    }
  }
  .h-r-r{
    padding-right 60px
  }
  .menu-btn{
    width 60px
    height 100%
    border-right 1px solid #eee
    position relative
    .iconcaidan{
      cursor pointer
      display block
      text-align center
      line-height 60px
      width 100%
      height 100%
      font-size 45px
      color #00A896
    }
  }
  .menu-content{
    position absolute
    left 0
    z-index 200
  }
  .quick-menu-list{
    width 100%;
    background #fff
    display flex
    flex-wrap wrap
    padding-top 26px
    box-shadow 3px 5px 5px 0px rgba(0,168,150,0.1);
    li{
      width 50%
      height 30px
      margin-bottom 18px
      display flex
      padding-left 20px
      align-items center
      box-sizing border-box
      font-size 14px
      color #020202
      cursor pointer
    }
    i{
      font-size 16px
      margin-right 10px
      color #00A896
    }
    .active-quick{
      color #00A896
      border-left 6px solid #00A896
    }
  }
  .quick-menu{
    width 250px
    padding-top 8px
    background url('../../assets/images/v4.0/header/xsj.png') no-repeat 20px top;
    background-size 15px 8px;
    .quick-menu-header{
      height 60px;
      width 250px
      cursor pointer
      background url('../../assets/images/v4.0/header/ico_log.png') no-repeat center;
      background-size 100% 100%;
      color #000;
      font-size 18px;
    }
  }
  .all-menu{
    margin 8px
    background #fff
    color #020202
    padding 0 30px
    width 880px
    box-sizing border-box
    flex-wrap wrap
    box-shadow 3px 5px 5px 0px rgba(0,168,150,0.1);
    position relative
    &:before{
      content '';
      display block;
      position absolute
      background url('../../assets/images/v4.0/header/xsj02.png') no-repeat center;
      left -8px;
      top 22px;
      height 15px
      width 8px
      background-size 100% 100%;
    }
    dl{
      margin-top 10px
      flex-direction column
      &:nth-child(4),&:nth-child(6),&:nth-child(7){
        width 328px
      }
    }
    dt{
      font-size 14px
      font-weight bold
      margin-bottom 10px
    }
    dd{
      font-size 12px
      margin-inline-start 0;
    }
    .two{
      column-count 2;
    }
    ul{
      max-height 220px
      flex-wrap wrap
      flex-direction column
    }
    li{
      width 164px
      padding 7px 0
      cursor pointer
    }
  }
  .img-span{
    height 40px
    li{
      height 100%
      display flex
      align-items center
      padding 0 20px
      cursor pointer
      border-right 1px solid #efefef;
      &:last-child{
        border 0
      }
      span{
        font-size 14px
        color #666
      }
      i{
        font-size 21px
        color #00A896
        margin-right 10px
      }
    }

  }
</style>
