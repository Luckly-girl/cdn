<template>
  <div class="groups">
    <slot></slot>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "select"
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      childrenValue: []
    };
  },
  mounted() {
    this.childrenValue = this.value;
    // console.log(this.childrenValue)
  },
  methods: {},
  watch: {
    value(val) {

      this.childrenValue = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.groups {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px;
  & > div {
    margin-left: 0;
  }
}
</style>
