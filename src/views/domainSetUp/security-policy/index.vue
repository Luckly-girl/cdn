<template>
  <div id="SP">
    <div class="sp_container">
      <div class="sp_left">
        <switch-item
          v-model="item.value"
          v-for="item in listLeft"
          :key="item.id"
          :data="item"
        >
          <el-radio-group
            v-show="item.id == 'ccSwitch' && item.value == 1"
            v-model="item.type"
          >
            <el-radio :label="1">等待进入</el-radio>
            <el-radio :label="2">验证码</el-radio>
          </el-radio-group>
          <span
            class="safe"
            @click="safeClick"
            v-show="item.id == 'safeSwitch' && item.value == 1"
            >查看</span
          >
        </switch-item>
      </div>
      <div class="sp_right">
        <switch-item
          v-model="item.value"
          v-for="(item, index) in listRight"
          :key="item.id"
          :data="item"
        >
          <div v-show="item.id == 'limits' && item.value == 1">
            <div class="_in">
              <span>单个IP最大连接数限制:</span>
              <div class="put">
                <el-input
                  @change="change($event, index, 'ipNum')"
                  v-model.number="item.ipNum"
                ></el-input>
                <span>个/s (不填写默认10个/s)</span>
              </div>
            </div>
            <div class="_in">
              <span>网站的最大连接数限制:</span>
              <div class="put">
                <el-input
                  @change="change($event, index, 'serverNum')"
                  v-model.number="item.serverNum"
                ></el-input>
                <span>个/s (不填写默认500个/s)</span>
              </div>
            </div>
          </div>
        </switch-item>
      </div>
    </div>

    <footer>
      <button @click="save" class="save">保存</button>
    </footer>
  </div>
</template>

<script>
import SwitchItem from "../traffic-strategy/switch-item";
import { updateSafeInfo } from "@/api/site";
export default {
  data() {
    return {
      listLeft: [
        {
          id: "ccSwitch",
          title: "CC防护",
          value: 0,
          type: 1,
          text:
            "可以根据用户访问源 IP 或者 SESSION 频率制定防护规则，对访问进行处置，处置措施包括告警 人机识别和阻断。可根据自生实际需要实时调整防御策略。",
        },
        {
          id: "antiProxyIp",
          title: "防撞库",
          value: 0,
          text:
            "撞库是黑客通过收集互联网已泄露的用户和密码信息，生成对应的字典表，尝试批量登陆其他网站后，得到一系列可以登录的用户。很多用户在不同网站使用的是相同的帐号密码，因此黑客可以通过获取用户在A网站的账户从而尝试登录B网址",
        },
        {
          id: "safeSwitch",
          title: "WAF防护",
          value: 0,
          text:
            "网站安全防护(WAF) 专门保护网站免受黑客攻击，能有效阻挡黑客拖库、恶意扫描等行为;同时在0 day漏洞爆发时，可以快速响应，拦截针对此类漏洞的攻击请求。",
        },
      ],
      listRight: [
        {
          id: "limits",
          title: "并发限制",
          value: 0,
          ipNum: 10,
          serverNum: 500,

          text:
            "并发控制的目的是保证一个用户的工作不会对另一个用户的工作产生不合理的影响。在某些情况下这些措施保证了当用户和其他用户一起操作时，所得的结果和她单独操作时的结果是一样的",
        },
        // {
        //   id: "6",
        //   title: "请求限制",
        //   text: "保证数据安全的方法之一"
        // }
      ],
    };
  },
  components: {
    SwitchItem,
  },
  created() {
    this.initData();
  },
  computed: {
    id() {
      return JSON.parse(this.$route.query.data).id;
    },
  },
  methods: {
    initData() {
      let data = JSON.parse(this.$route.query.data);
      let arr = this.listLeft.concat(this.listRight);
      for (let item of arr) {
        data[item.id] && (item.value = data[item.id]);
        if (item.id == "ccSwitch") {
          data["ccType"] && (item.type = data["ccType"]);
        }
        if (item.id == "limits") {
          data["ipNum"] && (item.ipNum = data["ipNum"]);
          data["serverNum"] && (item.serverNum = data["serverNum"]);
        }
      }

      this.listLeft = arr.slice(0, 3);
      this.listRight = arr.slice(3);
    },
    save() {
      if (this.listRight[0].value === 0) {
        this.listRight[0].ipNum = 10;
        this.listRight[0].serverNum = 500;
      }
      updateSafeInfo({
        id: this.id,
        ccSwitch: this.listLeft[0].value,
        ccType: this.listLeft[0].type,
        antiProxyIp: this.listLeft[1].value,
        safeSwitch: this.listLeft[2].value,
        limits: this.listRight[0].value,
        ipNum: this.listRight[0].ipNum,
        serverNum: this.listRight[0].serverNum,
      });
    },
    change(num, index, type) {
      // console.log(!num);
      if (Number.isNaN(Number(num)) || !Number(num)) {
        if (type == "ipNum") {
          this.listRight[index][type] = 10;
        } else if (type == "serverNum") {
          this.listRight[index][type] = 500;
        }
      } else {
        this.listRight[index][type] = Number(num);
      }
    },
    // 点击WAF防护查看跳转页面
    safeClick() {
      this.$router.push({
        path: "/cdn/wafSet",
        query: { data: this.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/mixins.scss";
#SP {
  margin-top: 16px;
  font-size: 12px;

  .sp_container {
    display: flex;
    justify-content: space-between;
    .sp_left,
    .sp_right {
      background-color: #fff;
      padding: 24px 37px;
      flex: 1;
      ._in {
        display: flex;
        align-items: center;
        margin: 10px;
        .put {
          flex-basis: 250px;
          display: flex;
          align-items: center;
          span {
            flex-basis: 150px;
            flex-shrink: 0;
            margin-left: 10px;
            color: red;
          }
        }
        span {
          margin-right: 10px;
        }
      }
    }
    .sp_left {
      margin-right: 18px;
      .safe {
        color: #00a896;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  footer {
    margin-top: 20px;
    .save {
      @include buttonType;
      float: right;
    }
  }
}
</style>
