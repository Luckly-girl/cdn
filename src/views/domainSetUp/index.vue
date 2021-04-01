<template>
  <div class="domainSetUp">
    <div class="_top_main">
      <div class="_top_back">
        <span @click="$router.go(-1)">
          <span class="el-icon-arrow-left"></span>返回
        </span>
        域名操作管理
      </div>
      <top-nav @change="component = $event" :list="navList"></top-nav>
    </div>
    <!-- <router-view></router-view> -->
    <keep-alive>
      <component :is="component"></component>
    </keep-alive>
  </div>
</template>
<script>
import TopNav from "./components/top-nav";
import navList from "./components/navList";
import cacheConfig from "./cache-config";
import generalInformation from "./general-information";
import certificateManagement from "./certificate-management";
import isolationStrategy from "./isolation-strategy";
import securityPolicy from "./security-policy";
import trafficStrategy from "./traffic-strategy";
export default {
  components: {
    TopNav,
    generalInformation,
    cacheConfig,
    certificateManagement,
    isolationStrategy,
    securityPolicy,
    trafficStrategy,
  },
  data() {
    return {
      navList: navList,
      component: "general-information",
    };
  },
  methods: {
    // change(val) {
    //   if (val == "/domainSetUp/general-information") {
    //     this.component = this.navList[0].name;
    //   }
    //   console.log(this.component, 111);
    // },
  },
};
</script>
<style lang="scss" scoped>
.domainSetUp {
  //  width: calc(100vw - 266px);
  min-width: 900px;
  // padding: 21px;
  //  margin-left: 162px;
  ._top_main {
    position: relative;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 238, 241, 1);
    padding-left: 21px;
    padding-top: 11px;
    ._top_back > span {
      position: absolute;
      left: 21px;
      display: inline-block;
      width: 40px;
      height: 6px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 168, 150, 1);
      cursor: pointer;
    }
    ._top_back {
      width: 100%;
      height: 100%;
      line-height: 24px;
      height: 24px;
      text-align: center;
      font-size: 16px;
      color: #020202;
      font-weight: bold;
    }
  }
}
</style>
