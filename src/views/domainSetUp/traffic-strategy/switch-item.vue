<template>
  <div class="traffic-item">
    <h4>{{ data.title }}</h4>
    <div class="_main">
      <div class="_content" v-text="data.text"></div>
      <el-switch @change="$emit('change',$event)" :active-value="1" :inactive-value="0" v-model="flag" v-if="data.id !== '3'"></el-switch>
      <el-radio-group v-model="radio" v-else>
        <el-radio :label="1">JavaScript</el-radio>
        <el-radio :label="2">css</el-radio>
        <el-radio :label="3">html</el-radio>
      </el-radio-group>
    </div>
    <div class="expand">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "switch"
  },
  props: {
    data: Object,
    value: [String, Boolean, Number]
  },
  data() {
    return {
      radio: 1,
      flag: 0
    };
  },
  mounted() {
    this.flag = this.value;
  },
  watch: {
    flag: {
      handler(val) {
        this.$emit("switch", val);
      }
      // immediate:true
    },
    value(val) {
      this.flag = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.traffic-item {
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(238, 238, 238, 1);
  h4 {
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: rgba(2, 2, 2, 1);
  }
  ._main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    ._content {
      padding: 10px 0px;
      margin-right: 10px;
    }
    ._set {
      width: 100px;
    }
  }
  .expand {
    padding: 10px;
  }
}
</style>
