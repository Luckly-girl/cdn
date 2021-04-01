<template>
  <div class="navbar">
    <div class="navbar-bg">
      <el-scrollbar
        class="default-scrollbar"
        wrap-class="default-scrollbar__wrap"
        view-class="default-scrollbar__view"
      >
        <div class="nav-background">
          <div class="accountHead">
            <section>
              <div
                class="pic"
                :style="{
                  backgroundImage: `url(${require('@/assets/images/ico_peo.png')})`,
                }"
              ></div>
              <div class="name">{{ userInfo.username }}</div>
            </section>
          </div>
          <el-menu
            :router="true"
            :default-active="
              $route.meta.activePath ? $route.meta.activePath : $route.path
            "
            :active-text-color="'#00A896'"
          >
            <template v-for="(navUl, titleIndex) in navList.list">
              <el-menu-item
                v-if="navUl.children.length == 0"
                :index="navUl.path"
                :key="titleIndex"
              >
                <i :class="['iconfont', navUl.icon]"></i>
                <span class="fontColor" slot="title">{{ navUl.name }}</span>
              </el-menu-item>

              <el-submenu v-else :key="titleIndex" :index="navUl.name">
                <template slot="title">
                  <i :class="['iconfont', navUl.icon]"></i>
                  <span class="fontColor">{{ navUl.name }}</span>
                </template>
                <el-menu-item
                  v-for="child of navUl.children"
                  :key="child.path"
                  :index="child.path"
                >
                  <i class="_icon"></i>
                  <span class="fontColor" slot="title">{{ child.name }}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { baseBus } from "@/utils/filter";
import navData from "@/mock/nav.json";
export default {
  data() {
    return {
      active: "tab0", // 默认路由
      bgColor: "#4d71ee", // 背景色
      textColor: "#fff", // 文字颜色
      activeTextColor: "#fff", // 点击后文字颜色
      ac_index: "1",
    };
  },
  created() {
    this.active = this.$route.path;
    // console.log(this.active)
  },
  mounted() {
    // console.log(this.navList.list,11111);
  },
  methods: {
    routeTo(item) {
      this.$router.push(item);
    },
    getVersionNum() {
      this.$store.dispatch("GetVersion");
    },
    versionUpdate() {
      versionUpdate().then((res) => {
        this.getVersionNum();
      });
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    navList() {
      return navData.filter(
        (item) => this.$route.path.indexOf(item.path) > -1
      )[0];
    },
    // eslint-disable-next-line vue/return-in-computed-property
    index() {
      for (let [index, item] of Object.entries(this.list)) {
        if (item.includes(this.$route.path)) {
          return index;
        }
      }
    },
    theme() {
      return this.$store.state.theme;
    },
    themeList() {
      return this.$store.state.themeList;
    },
    versionInfo() {
      return this.$store.getters.getVersion;
    },
    parentsList() {
      return this.$store.state.roles;
    },
  },
};
</script>

<style lang="scss">
.navbar {
  .el-menu {
    border-right: none;
    margin-left: 15px;
    .el-menu-item.is-active {
      border-right: 8px solid #00a896;
      i {
        color: rgb(0, 168, 150);
      }
    }
    .el-submenu .el-menu-item.is-active {
      border-right: 8px solid #00a896;
      i {
        color: rgb(0, 168, 150);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.nav-update-list p {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.navbar {
  height: 100%;

  /* background-color: #252a39; */
}
.nav-background {
  width: 190px;
  font-size: 14px;
}
.navbar-bg {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  color: #9a9b9c;
  box-shadow: 3px 0px 5px 3px rgba(2, 2, 2, 0.08);
}
.navbar .activeClass {
  width: 4px;
  height: 100%;
  /* background: #05ffd3; */
  position: absolute;
  left: 0;
}
.navbar-bg li > div {
  padding-left: 50px;
  box-sizing: border-box;
}
.navbar-bg .iconfont {
  /* color: #00a896; */
  font-size: 20px;
  margin-right: 14px;
}
.nav-home {
  cursor: pointer;
  line-height: 40px;
  margin-top: 30px;
}
.nav-title {
  line-height: 54px;
  color: #fff;
}
.nav-content {
  line-height: 38px;
  cursor: pointer;
}
.navbar {
  ._icon {
    display: inline-block;
    width: 12px;
  }
  .iconfont {
    color: #626262;
    font-size: 18px;
    display: inline-block;
    width: 20px;
  }
  .fontColor {
    // color: #020202;
    // font-weight:bold;
  }
  .accountHead {
    height: 156px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    section {
      .pic {
        width: 68px;
        height: 68px;
        border-radius: 34px;
        background: {
          size: 100% 100%;
          repeat: no-repeat;
        }
      }
      .name {
        text-align: center;
        font-size: 14px;
        color: #020202;
        margin-top: 17px;
        font-weight: bold;
      }
    }
  }
}
</style>
