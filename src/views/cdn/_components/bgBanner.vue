<template>
  <div>
    <div class="banner">
      <img src="@/assets/images/cdn1/bg_cdn.png" alt />
      <div class="banner-contaner">
        <div class="banner-title">欢迎开通CDN</div>
        <div
          class="banner-text"
        >内容分发网络（Content Delivery Network，简称 CDN），是佰讯云提供的网页和图片、文件下载、视频点播等类型的加速服务。通过将源站内容同步到全国各边缘节点，配合精准的调度系统，将用户的请求分配最佳节点，使用户快速获取内容</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  width: 100%;
  .banner-contaner {
    position: absolute;
    top: 20%;
    left: 15%;
    width: 500px;
    color: #fff;
    z-index: 99;
    .banner-title {
      font-size: 24px;
      font-family: FZZhunYuan-M02S;
    }
    .banner-text {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 300;
      margin-top: 16px;
      line-height: 22px;
    }
  }
}
</style>
