<template>
  <div class="home">
    <div class="home">
      <!--  v-if="$route.path=='/dashboard'" -->
      <div class="left">
        <div class="cost">
          <div class="title">费用</div>
          <div id="cost_echarts">
            <cdn-Svn :dayData="dayData" :numData="numData"></cdn-Svn>
          </div>
        </div>
        <div class="event_safe">
          <div class="event">
            <div class="title">事件提醒</div>
            <div class="event_content">
              <ul>
                <li>
                  <img src="@/assets/images/home/43@2x.png" alt />
                  <span class="text">需立即处理事件</span>
                  <span class="count">1</span>
                </li>
                <li>
                  <img src="@/assets/images/home/ico_sjcl@2x.png" alt />
                  <span class="text">需尽快处理事件</span>
                  <span class="count">15</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="safe">
            <div class="title">安全测评</div>
            <div class="safe_content">
              <div>
                <img src="@/assets/images/home/weixian@2x.png" alt />
                <span class="text">危险</span>
              </div>
            </div>
            <div class="content_foot pointer">
              <span class="know_more">了解更多</span>
              <i class="iconfont iconxiala1"></i>
            </div>
          </div>
        </div>
        <div class="recent_use">
          <div class="title">最近使用</div>
          <ul>
            <li>专有网络VPC</li>
            <li>云服务器</li>
            <li>SSL证书</li>
            <li>CDN</li>
            <li>负载均衡</li>
          </ul>
        </div>
        <div class="in_use">
          <div class="title">正在使用</div>
          <ul>
            <li>CDN</li>
            <li>云服务器</li>
            <li>负载均衡</li>
            <li>云数据库MySQL</li>
            <li>云监控</li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="pending">
          <ul>
            <li>
              <i class="iconfont icondaixufei"></i>
              <div>待续</div>
              <span>1</span>
            </li>
            <li>
              <i class="iconfont icondaizhifu"></i>
              <div>待支付</div>
              <span>3</span>
            </li>
            <li>
              <i class="iconfont icongongdan1"></i>
              <div>待处理工单</div>
              <span>12</span>
            </li>
          </ul>
        </div>
        <div class="latest_notice">
          <div class="title">
            <div>
              <i class="iconfont iconremen"></i>
              <span>最新公告</span>
            </div>
            <div class="pointer">
              <span class="more">更多</span>
              <i class="iconfont iconxiala1"></i>
            </div>
          </div>
          <div class="content">
            <ul>
              <li>
                <div class="content_text">
                  【新闻】佰讯科技荣登世界500强榜单，位列
                </div>
                <div class="content_time">2020-06-20</div>
              </li>
              <li>
                <div class="content_text">
                  【新闻】佰讯科技荣登世界500强榜单，位列
                </div>
                <div class="content_time">2020-06-20</div>
              </li>
              <li>
                <div class="content_text">
                  【新闻】佰讯科技荣登世界500强榜单，位列
                </div>
                <div class="content_time">2020-06-18</div>
              </li>
              <li>
                <div class="content_text">
                  【新闻】佰讯科技荣登世界500强榜单，位列
                </div>
                <div class="content_time">2020-06-18</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="latest_notice">
          <div class="title">
            <div>
              <i class="iconfont iconzuixin"></i>
              <span>最新产品</span>
            </div>
            <div class="pointer">
              <span class="more">更多</span>
              <i class="iconfont iconxiala1"></i>
            </div>
          </div>
          <div class="content">
            <div class="content_product">
              <div class="content_title">智能校园安防解决方案3.0版本上线</div>
              <div class="content_text">
                校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。
              </div>
            </div>
            <div class="content_product">
              <div class="content_title">智能校园安防解决方案3.0版本上线</div>
              <div class="content_text">
                校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。
              </div>
            </div>
            <div class="content_product">
              <div class="content_title">智能校园安防解决方案3.0版本上线</div>
              <div class="content_text">
                校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。
              </div>
            </div>
          </div>
        </div>
        <div class="img">
          <img src="../../assets/images/home/bg_news2@2x.png" alt />
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// import { getHomeInfo } from "@/api/login";
import { getDailyBill } from "@/api/dashboard.js";
import cdnSvn from "./components/cdn-vpc-echarts";

export default {
  components: {
    cdnSvn,
  },
  data() {
    return {
      // homeInfo: {
      //   abNormalNodeCount: 0,
      //   abNormalSiteCount: 0,
      //   balance: 0,
      //   banIpCount: 0,
      //   blackGroupCount: 0,
      //   countryGroupCount: 0,
      //   nickName: "",
      //   nodeTotal: 0,
      //   normalNodeCount: 0,
      //   preSiteCount: 0,
      //   normalSiteCount: 0,
      //   siteTotal: 0,
      //   sslTotal: 0,
      //   sslExpiredCount: 0,
      //   sslExpiredSoonCount: 0,
      //   whiteGroupCount: 0,
      // },
      dayData: [],
      numData: [],
    };
  },
  created() {
    // this.getHomeInfo();
    this.getDailyBill();
  },
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    },
    // getHomeInfo() {
    //   getHomeInfo().then((res) => {
    //     this.homeInfo = res.data;
    //   });
    // },
    getDailyBill() {
      getDailyBill().then((res) => {
        (this.dayData = res.data.map((obj) => {
          return obj.dayTime;
        })),
          (this.numData = res.data.map((obj) => {
            return obj.amount;
          }));
        // console.log(this.dayData, this.numData);
      });
    },
    routerTo(role, path, query) {
      if (!this.homeAuthority(role)) return false;
      if (query) {
        this.$router.push({ path: path, query: query });
      } else {
        this.$router.push({ path: path });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "./index.scss";

.home {
  width: 100%;

  .left {
    display: inline-block;
    width: 70%;
    margin-right: 20px;
    vertical-align: top;

    .cost {
      margin-bottom: 24px;
      background-color: #fff;

      .cost_echarts {
        padding: 36px 85px 20px;
      }
    }

    .event_safe {
      margin-bottom: 24px;
      display: flex;

      .event {
        flex: 1;
        margin-right: 10px;
        background-color: #fff;

        .event_content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 175px;

          ul {
            width: 292px;
            height: 93px;

            li {
              display: flex;
              align-items: center;
              height: 46px;

              .text {
                margin-left: 20px;
                margin-right: auto;
              }

              .count {
                color: red;
                font-weight: 700;
              }
            }
          }
        }
      }

      .safe {
        flex: 1;
        margin-left: 10px;
        background-color: #fff;

        .safe_content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 146px;

          > div {
            display: flex;
            align-items: center;

            .text {
              margin-left: 26px;
            }
          }
        }

        .content_foot {
          position: relative;
          right: 21px;
          bottom: 12px;
          text-align: right;
        }
      }
    }

    .recent_use,
    .in_use {
      margin-bottom: 24px;
      background-color: #fff;

      ul {
        padding: 20px 30px 27px;
        display: flex;

        li {
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: rgba(1, 1, 1, 1);
          margin-right: 30px;
          cursor: pointer;
          &:hover {
            color: #45a2fa;
          }
        }
      }
    }
  }

  .right {
    display: inline-block;
    width: 28%;
    vertical-align: top;

    .pending {
      background-color: #fff;
      margin-bottom: 24px;

      ul {
        display: flex;
        justify-content: space-around;

        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 240px;

          > div {
            color: rgba(102, 102, 102, 1);
            line-height: 24px;
            margin-top: 10px;
            margin-bottom: 20px;
          }

          > span {
            font-size: 22px;
            font-family: Impact;
            font-weight: 400;
            color: rgba(2, 2, 2, 1);
            line-height: 20px;
          }
        }
      }
    }

    .latest_notice {
      background-color: #fff;
      margin-bottom: 24px;

      .title {
        display: flex;
        justify-content: space-between;

        > div {
          display: flex;
          align-items: center;
        }
      }

      .content {
        padding: 20px 25px;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 30px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #45a2fa;
          }
          .content_text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .content_time {
            margin-left: 10px;
            flex: 80px 0 0;
          }
        }

        .content_product {
          margin-bottom: 16px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0px;
          }
          &:hover {
            color: #45a2fa;
          }

          .content_title {
            margin-bottom: 6px;
            font-size: 14px;
            color: rgba(101, 101, 101, 1);
            line-height: 18px;
            // &:hover {
            //   color: #45a2fa;
            // }
          }

          .content_text {
            font-size: 12px;
            color: rgba(153, 153, 155, 1);
            line-height: 20px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden; // 超出的文本隐藏
            text-overflow: ellipsis; // 溢出用省略号显示
            display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
            -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
            line-clamp: 2;
            -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）

            // &:hover {
            //   color: #45a2fa;
            // }
          }
        }
      }
    }

    img {
      width: 100%;
    }
  }

  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(1, 1, 1, 1);
    margin: 0px 30px;
    padding: 10px 0;
    height: 40px;
    line-height: 45px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  .text {
    font-size: 16px;
    color: rgba(1, 1, 1, 1);
  }
}

.know_more,
.iconxiala1 {
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
}

.iconxiala1 {
  margin-left: 4px;
}

.icondaixufei,
.icondaizhifu,
.icongongdan1 {
  font-size: 30px;
  color: #45a2fa;
}

.icongongdan1 {
  font-size: 28px;
}

.iconremen,
.iconzuixin {
  font-size: 30px;
  color: #fcbc43;
  margin-right: 8px;
}

.more {
  font-size: 14px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
}
</style>
