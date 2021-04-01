<template>
  <el-tag
    :style="{ color: fontColor }"
    :color="color"
    :closable="closable"
    class="domain-tag"
    @close="$emit('close')"
    >{{ name }}</el-tag
  >
</template>
<script>
export default {
  props: {
    name: String,
    color: String,
    fontColor: String,
    closable: Boolean,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss">
.domain-tag {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 8px;
  color: #666666;
  position: relative;
  margin: 5px 10px;
  cursor: pointer;
  .el-icon-close {
    width: 12px;
    height: 12px;
    font-size: 8px;
    background: rgba(2, 2, 2, 1);
    border-radius: 50%;
    color: #ffffff;
    line-height: 12px;
    position: absolute;
  }
}
</style>
