<template>
  <div class="domain-tag" :class="{ selected: selected }">
    <div class="button-new-tag" @click="onSelect">{{ label }}</div>

    <i class="el-icon-edit" @click="click"></i>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    groupValue() {
      return this.$parent.$props.value;
    }
  },
  data() {
    return {
      selected: false
    };
  },
  mounted() {
    if (this.groupValue.includes(this.value)) {
      this.selected = true;
    }
  },
  methods: {
    onSelect() {
      this.selected = !this.selected;
      let arr = this.$parent.$data.childrenValue;
      // console.log(this.$parent.$data);
      // console.log(arr);
      if (this.selected) {
        arr.push(this.value);
      } else {
        let index = arr.findIndex(val => {
          return this.value === val;
        });
        arr.splice(index, 1);
      }
      this.$parent.$emit("select", [...new Set(arr)]);
    },
    click() {
      this.$emit("change", this.value);
    }
  },
  watch: {
    groupValue(val) {
      if (val.includes(this.value)) {
        this.selected = true;
      }else{
        this.selected = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@styles/theme.scss";
.domain-tag {
  width: 160px;
  display: flex;
  align-items: center;
  margin: 5px;
  border: none;
  margin-right: 10px;
  background-color: transparent;
  font-size: 12px;
  .button-new-tag {
    width: 125px;
    // width: 100px;
    height: 24px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 8px;
    line-height: 24px;
    text-align: center;
    span {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 20px;
    }
  }
  .el-icon-edit {
    padding: 0 7px;
    font-size: 14px;
    color: $theme-color;
  }
}
.domain-tag.selected {
  .button-new-tag {
    background: rgba(0, 168, 150, 1);
    color: #ffffff;
  }
}
</style>
