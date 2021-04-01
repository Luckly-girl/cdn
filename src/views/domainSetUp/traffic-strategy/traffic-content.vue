<template>
  <div class="traffic-content">
    <h4>{{ title }}</h4>
    <switch-item
      v-for="item in list"
      :key="item.id"
      :data="item"
    ></switch-item>
  </div>
</template>
<script>
import SwitchItem from "./switch-item";
export default {
  components: {
    SwitchItem,
  },
  props: {
    list: Array,
    title: String,
  },
};
</script>
<style lang="scss" scoped>
.traffic-content {
  padding: 20px;
  width: 49.5%;
  font-size: 12px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(236, 238, 241, 1);
  box-sizing: border-box;
  margin: 12px 0px;
  h4{
      font-family:Microsoft YaHei;
font-weight:600;
color:rgba(2,2,2,1);
  }
}
</style>
