<template>
  <div class="cache-config">
    <cache-tabel></cache-tabel>
  </div>
</template>
<script>
import CacheTabel from "./cache-tabel";

export default {
  components: {
    CacheTabel,
  }
};
</script>
<style lang="scss" scoped>
.cache-config {
  padding: 20px;
  width: 100%;
  font-size: 12px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(236, 238, 241, 1);
  box-sizing: border-box;
  margin: 12px 0px;
}
</style>
