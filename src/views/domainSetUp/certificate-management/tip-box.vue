<template>
  <div class="tip-box">
    <h3>温馨提示</h3>
    <p>
      1.SSL
      证书过期之后，将无法使用，需要在证书到期前重新购买。重新生成一张证书,然后在服务器上进行安装替换。
    </p>
    <p>
      2.SSL证书都是绑定域名的，服务器更换 IP
      地址没有任何关系，只要域名不变，重新解析到新的 IP 地址即可，原来的 SSL
      证书照样可以用，不需要更换新的证书。
    </p>
    <p>
      3.安装SSL证书设置HTTP转HTTPS前，请先安装SSL证书，安装详情可见：SSL证书安装指南
    </p>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.tip-box {
  padding:16px 38px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  h3 {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: rgba(2, 2, 2, 1);
    line-height: 34px;
  }
  p {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 19px;
  }
}
</style>
