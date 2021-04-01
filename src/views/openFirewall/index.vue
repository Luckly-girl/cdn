<template>
  <div class="openFireWall">
    <div class="open-title">购买WEB应用防火墙</div>
    <el-form>
      <el-form-item label="使用区域" class="useArea">
        <el-radio-group v-model="searchMap.area" @change="changeRadio">
          <el-radio :label="0">国内</el-radio>
          <el-radio :label="1">海外</el-radio>
          <el-radio :label="2">全球</el-radio>
        </el-radio-group></el-form-item
      >
      <el-form-item label="版本" class="editionSelect">
        <ul>
          <li
            :style="{
              border: index === mark ? themeOpen.border : '1px solid #606266',
              color: index === mark ? themeOpen.color : '#606266',
            }"
            @click="handlerBtn(index)"
            v-for="(item, index) of btnList"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div class="edition" v-if="mark == 0">
          适用于中小非业务网站的标准防护，基于AI + 规则引擎；<br />
          支持常见的Web攻击防护，包括SQL注入、XSS、Webshell上传、目录遍历等；<br />
          云端自动更新Web 0day漏洞的防护规则；<br />
          支持HTTP(80、8080端口)、HTTPS(443、8443端口)的业务防护；<br />
          支持高级CC攻击防护，过滤垃圾访问；<br />
          支持网页防篡改，敏感数据防泄漏；<br />
          支持按地域细粒度封禁；<br />
          正常业务请求QPS：2500；<br />
          CC防护峰值QPS：30000；<br />
          支持一级域名个数：2；<br />
          支持二级域名个数：20；<br />
        </div>
        <div class="edition" v-if="mark == 1">
          适用于中小型普通业务站点及中大型官网站点定制化防护服务，基于AI +
          规则引擎；<br />
          包含高级版所有功能；<br />
          支持链路劫持检测（5个）；<br />
          支持高级BOT行为管理；<br />
          支持非标准端口（不限于80,8080,443，8443）定制（10个）；<br />
          支持HTTP协议级别自定义规则；<br />
          独享IP防护；<br />
          支持防御规则优化专家服务；<br />
          支持1对1售前售后支持；<br />
          正常业务请求QPS：5000；<br />
          CC防护峰值QPS：50000；<br />
          支持一级域名个数：3；<br />
        </div>
        <div class="edition" v-if="mark == 2">
          适用于大型及超大型业务网站及复杂业务站点的定制化防护服务，基于AI +
          规则引擎；<br />
          包含企业版所有功能；<br />
          支持链路劫持检测（10个）；<br />
          支持高级BOT行为管理；<br />
          支持非标准端口（不限于80,8080,443，8443）定制（20个）；<br />
          支持泛域名定制；<br />
          独享IP防护；<br />
          支持1对1售前售后支持；<br />
          正常业务请求QPS：10000；<br />
          CC防护峰值QPS：100000；<br />
          支持一级域名个数：4；<br />
          支持二级域名个数：40；<br />
        </div>
      </el-form-item>
      <div class="tip">
        说明：已购买版本后，只能向上增加版本，不可降低版本例如现使用基础版只可购买增强版或旗舰版，增强版用户只可购买
        &emsp;&emsp;&emsp;旗舰版另外如未升级只允许购买扩展域名包和qps扩展包。
      </div>
      <el-form-item label="扩展域名包" class="expendArea">
        <el-input-number
          v-model="searchMap.extDomainNum"
          @change="changeDomain"
          :min="0"
          :max="10"
        ></el-input-number>
        <p>一个域名包包含10个域名防护，限制仅支持一个一级域名防护</p>
      </el-form-item>
      <el-form-item label="QPS扩展包" class="expendArea">
        <el-input-number
          v-model="searchMap.extQPSNum"
          @change="changeQps"
          :min="0"
          :max="10"
        ></el-input-number>
        <p>1个QPS扩展包包含：1000QPS（套餐有效期内，一次最多可购买500个</p>
      </el-form-item>
      <el-form-item label="安全日志服务包" class="safeLog">
        <el-checkbox v-model="searchMap.checked" @change="changeCheck"
          >开通日志服务包</el-checkbox
        >
        <div class="block">
          <el-slider
            v-model="searchMap.logNum"
            show-input
            :disabled="searchMap.checked == false"
            @change="changeLogNunm"
            show-stops
            :step="50"
            :min="0"
            :max="500"
          >
          </el-slider>
        </div>
        <p>
          1个日志服务包包含：1T日志服务存储容量（套餐有效期内，日志存储时长为180天，一次最多可购买500个）
        </p>
      </el-form-item>
      <el-form-item label="购买时长" class="purchTime">
        <span>1个月</span>

        <p>
          购买时长默认为30天；1个QPS扩展包包含：1000QPS（套餐有效期内，一次最多可购买500个）
        </p>
        <el-checkbox v-model="searchMap.autoRenewal" @change="changeAutoRen"
          >账户余额足够时，到期后按月自动续费</el-checkbox
        >
      </el-form-item>
      <div class="payMoney">
        <label>费用：￥{{ formData.totalMoney }}</label>
        <el-button @click="submit">立即付款</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { saveOrCalcWafMoney } from "@/api/waf.js";
export default {
  data() {
    return {
      btnList: ["基础版", "增强版", "旗舰版"],
      mark: 0,
      searchMap: {
        area: 0,
        wafType: 1,
        extDomainNum: 0,
        extQPSNum: 0,
        checked: false,
        autoRenewal: false,
        logNum: 0,
      },
      formData: {},
    };
  },
  created() {
    this.saveOrCalcWafMoney();
  },
  computed: {
    themeOpen() {
      return this.$store.state.themeOpen;
    },
  },
  methods: {
    //获取费用
    saveOrCalcWafMoney() {
      if (this.searchMap.autoRenewal == false) {
        this.searchMap.autoRenewal = 0;
      } else {
        this.searchMap.autoRenewal = 1;
      }
      let info = {
        area: this.searchMap.area,
        wafType: this.searchMap.wafType,
        extDomainNum: this.searchMap.extDomainNum,
        extQPSNum: this.searchMap.extQPSNum,
        logNum: this.searchMap.logNum,
        autoRenewal: this.searchMap.autoRenewal,
        isSave: 0,
      };
      saveOrCalcWafMoney(info).then((res) => {
        if (res.code == 200) {
          this.formData = res.data;
        }
      });
    },
    //使用区域
    changeRadio(val) {
      this.searchMap.area = val;
      // console.log(val);
    },
    //版本选择
    handlerBtn(index) {
      this.mark = index;
      this.searchMap.wafType = index + 1;
      this.saveOrCalcWafMoney();
    },
    //域名扩展包
    changeDomain(val) {
      this.searchMap.extDomainNum = val;
      this.saveOrCalcWafMoney();
    },
    //QPS扩展包
    changeQps(val) {
      this.searchMap.extQPSNum = val;
      this.saveOrCalcWafMoney();
    },
    //是否开通安全日志
    changeCheck(val) {
      if (val == false) {
        this.searchMap.logNum = 0;
      }
    },
    //安全日志服务包
    changeLogNunm(val) {
      this.searchMap.logNum = val;
      this.saveOrCalcWafMoney();
    },
    //是否自动续费
    changeAutoRen(val) {
      this.searchMap.autoRenewal = val;
    },
    //立即付款
    submit() {
      setTimeout(() => {
        this.$router.push("/cdn/openWaf");
      }, 2000);
    },
  },
};
</script>

<style lang="scss">
.item {
  margin-top: 10px;
}
.el-badge__content.is-fixed {
  position: absolute;
  top: 5px;
  right: 42px;
}
.el-button--small {
  border-radius: 0;
}
.el-badge__content {
  background-color: #fc941d;
  border-radius: 0;
  font-size: 10px;
  height: 15px;
  line-height: 15px;
}
</style>

<style lang="scss" scoped>
.openFireWall {
  padding: 0 30px 30px;
  background-color: #fff;
  .open-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  ul {
    display: flex;
    align-items: center;
    li {
      height: 30px;
      line-height: 30px;
      padding: 0px 18px;
      border: 1px solid #b0b0b0;
      font-size: 14px;
      color: #666666;
      margin-right: 16px;
      cursor: pointer;
      border-radius: 8px 8px;
    }
    li.active {
      border: 1px solid #00a896;
      color: rgba(0, 168, 150, 1);
    }
  }
  .useArea {
    margin-left: 60px;
  }
  .editionSelect {
    margin-left: 90px;
    .edition {
      width: 750px;
      border: 1px solid #eeeeee;
      background-color: #eceef1;
      margin-top: 20px;
      margin-left: 50px;
      padding: 5px 10px;
    }
  }
  .tip {
    width: 720px;
    font-size: 13px;
    color: #93c7c1;
    margin-left: 140px;
    height: 50px;
  }
  .expendArea {
    margin-left: 40px;
    p {
      margin-left: 100px;
    }
  }
  .safeLog {
    .block,
    p {
      width: 800px;
      margin-left: 140px;
    }
  }
  .purchTime {
    margin-left: 60px;
    span {
      border: 1px solid #00a896;
      color: #00a896;
      padding: 5px 10px;
    }
    p,
    .el-checkbox {
      margin-left: 80px;
    }
  }
  .payMoney {
    margin-left: 140px;
    color: #00a896;
    font-weight: 700;
    font-size: 16px;
    .el-button {
      width: 100px;
      height: 35px;
      margin-left: 20px;
      background-color: #00a896;
      color: #fff;
    }
  }
}
</style>
