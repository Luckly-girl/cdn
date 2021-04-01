<template>
  <div class="_main">
    <app-header></app-header>
    <div class="container">
      <app-navbar v-if="$route.meta.showNav"></app-navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import AppHeader from "./appHeader";
import AppNavbar from "./appNavbar";
import AppMain from "./appMain";

export default {
  name: "Layout",
  components: {
    AppHeader,
    AppNavbar,
    AppMain,
  },
};
</script>

<style scoped>
._main {
  height: 100%;
}

.container {
  padding-top: 60px;
  min-width: 1400px;
  height: calc(100% - 60px);
  overflow: auto;
  position: relative;
  display: flex;
  display: -webkit-flex;
}
</style>
