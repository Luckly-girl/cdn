<template>
  <div class="traffic-strategy">
    <traffic-content title="文件大小优化" :list="list1"></traffic-content>
    <traffic-content title="传输优化" :list="list2"></traffic-content>
  </div>
</template>
<script>
import TrafficContent from "./traffic-content";
const list1 = [
  {
    id: "1",
    title: "图像重设大小",
    text:
      "您可以根据需要重设大小、调整质量，并可以将图像转换为 WebP 格式。我们在边缘缓存每个派生图像，因此，您只存储原始图像。这样，您无需维护服务器端图像处理管道，即可快速轻松地使图像适应站点的布局和访问者的屏幕尺寸。",
  },
  {
    id: "2",
    title: "智能优化",
    text:
      "通过优化域中托管的图像，缩短图像加载时间。（可选）可以将 WebP 图像编解码器与受支持的客户端一起使用，来实现更多性能优势。",
  },
  {
    id: "3",
    title: "自动瘦身",
    text: "请减小网站上源代码的文件大小。",
  },
  {
    id: "4",
    title: "Brotli",
    text: "应用 Brotli 压缩，加快访问者的 HTTPS 流量的页面 加载时间",
  },
];
const list2 = [
  {
    id: "5",
    title: "增强的 HTTP/2 优先化",
    text:
      "独立于浏览器优化资源的传递顺序。使用部分浏览器的访问者将体验到最明显的改进。",
  },
  {
    id: "6",
    title: "TCP 加速",
    text: "利用自定义调整的 TCP 优化减少延迟和吞吐量。",
  },
  {
    id: "7",
    title: "动态加速",
    text: "加快动态内容的传递。",
  },
];
export default {
  components: {
    TrafficContent,
  },
  data() {
    return {
      list1,
      list2,
    };
  },
};
</script>
<style lang="scss" scoped>
.traffic-strategy {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  box-sizing: border-box;
  margin: 12px 0px;
}
</style>
