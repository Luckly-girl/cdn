<template>
  <div class="basic-facts">
    <div>
      <div class="left">
        <div class="notice-wrap">
          <div class="notice">
            <div class="notice-title">
              <div class="title-left">通知</div>
            </div>
            <div class="notice-container">
              <ul>
                <li>
                  <div>6.18年中大促，低至0,.001</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>海外节点新上线，免费体验</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>【运营商通知】北京机房将于6月19日凌晨进行割接</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>6.18年中大促，低至0,.001</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>海外节点新上线，免费体验</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>【运营商通知】北京机房将于6月19日凌晨进行割接</div>
                  <span class="time">2020-06-20</span>
                </li>
                <li>
                  <div>【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会</div>
                  <span class="time">2020-06-20</span>
                </li>
              </ul>
            </div>
          </div>
          <pagination ref="pagination" :total="total"></pagination>
        </div>
      </div>
      <div class="right">
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">安全</div>
          </div>
          <div class="notice-container">
            <ul>
              <li>6.18年中大促，低至0,.001</li>
              <li>海外节点新上线，免费体验</li>
              <li>【运营商通知】北京机房将于6月19日凌晨进行割接</li>
              <li>【新闻】佰讯云组织承办的世界云计算大会,【新闻】佰讯云组织承办的世界云计算大会</li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">性能</div>
          </div>
          <div class="notice-container performance">
            <ul>
              <li>提高网站使用性能提高网站使用性能</li>
              <li>进入缓存设置</li>
              <li>优化流量策略</li>
              <li>进入流量策略设置</li>
            </ul>
          </div>
        </div>
        <div class="notice">
          <div class="notice-title">
            <div class="title-left">模式</div>
          </div>
          <div class="notice-container mode">
            <ul>
              <li>
                <div>攻击防御模式</div>
                <el-switch
                  v-model="value"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  @change="attackDefenseModeChange(value)"
                ></el-switch>
              </li>
              <li>
                <div>开发模式</div>
                <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ccc"></el-switch>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="_dia">
      <el-dialog title="提示" :visible.sync="dialogVisible" width="500px" center @close="dialogClose">
        <div class="notice">
          <div class="text">
            <div class="notice-title">禁用攻击防御模式</div>
            <div class="notice-text">为您的网站选择新的安全级别，以禁用该模式</div>
          </div>
          <div class="text">
            <div class="notice-title">安全级别</div>
            <div class="notice-text">调整您网站的安全级别，确定哪些访问者将接受管控。</div>
            <el-select v-model="safeValue" placeholder="请选择">
              <el-option
                v-for="item in safeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div class="help-wrap">
            <ul>
              <li>API</li>
              <li @click="helpShow = !helpShow">帮助</li>
            </ul>
          </div>
        </div>
        <div class="help-text" v-show="helpShow">
          <div>我应该选择哪个安全级别？</div>
          <div>您选择的安全级别将决定向哪些访问者显示质询页面。我们建议从“中”安全级别开始。</div>
          <div>本质上为关：仅管控最严重的违法者</div>
          <div>低：仅管控威胁最大的访问者</div>
          <div>中：管控威胁程度中等的访问者和威胁最大的访问者</div>
          <div>高：控制过去 14 天内表现出威胁行为的所有访问者</div>
          <div>攻击防御模式： 仅应在您的网站受到 DDoS攻击时使用</div>
          <div>当我们分析访问者的流量和行为以确保他们是尝试访问您网站的合法人类</div>
          <div>访问者时，访问者将收到一个插页式页面</div>
          <div class="mark">注意：本模式可能会影响您的域上的某些操作。例如，可能会阻止访问您的 API。您可以使用页面规则为域的任意部分设置自定义安全级别。</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


    
<script>
export default {
  data() {
    return {
      total: 100,
      mark: 0,
      value: true,
      value2: true,
      dialogVisible: false,
      safeValue: "本质上为关",
      safeOptions: [
        {
          label: "本质上为关",
          value: "本质上为关"
        },
        {
          label: "低",
          value: "低"
        },
        {
          label: "中",
          value: "中"
        },
        {
          label: "高",
          value: "高"
        }
      ],
      helpShow: false
    };
  },
  methods: {
    // btnClick(ind) {
    //   console.log(ind);
    //   this.mark = ind;
    // },
    attackDefenseModeChange(val) {
      this.dialogVisible = !val;
    },
    dialogClose() {
      this.helpShow = false;
    }
  }
};
</script>

<style lang="scss">
.basic-facts {
  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
  ._dia {
    .el-dialog__wrapper {
      bottom: auto;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "index.scss";
</style>