<template>
  <el-menu
    active-text-color="#00A896"
    class="_top_nav"
    :default-active="'cookies'"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item
      :index="navItem.name"
      v-for="navItem in list"
      :key="navItem.name"
    >{{navItem.title}}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  data() {
    return {
      activeIndex: this.$route.name,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key,keyPath)
      this.$emit("change", key);
    },
  },
};
</script>
<style lang="scss" scoped>
._top_nav {
  .el-menu-item {
    font-size: 14px;
    font-weight: 400;
    color: #020202 !important;
    height: 50px;
    line-height: 50px;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}
</style>
