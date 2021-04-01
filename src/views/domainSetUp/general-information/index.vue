<template>
  <div class="general-information">
    <div class="d-flex contain-flex p-d-10-20">
      <div class="host-name flex-1">
        <div class="d-flex">
          <span>域名：</span>
          <el-input
            size="mini"
            :disabled="true"
            :value="data.realmName[0]"
            v-if="isOne"
          ></el-input>
          <el-input
            v-else
            v-model="data.host"
            size="mini"
            placeholder="请输入对应的单个域名"
          ></el-input>
          <span class="_add" @click="addHost" v-if="!isOne">添加域名</span>
        </div>
      </div>
      <div class="c-name flex-1">
        <div class="d-flex">
          <span>CNAME：</span>
          <span>{{ data.allDomin }}</span>
        </div>
      </div>

      <div class="c-name flex-1">
        <div class="d-flex select">
          <span style="flex-shrink: 0">分组：</span>
          <el-select size="mini" v-model="data.groupName">
            <el-option
              v-for="name of groupNameList"
              :key="name.id"
              :value="name.groupName"
              >{{ name.groupName }}</el-option
            >
            <el-option value="新建分组">新建分组</el-option>
          </el-select>
        </div>
        <div class="newGroupName">
          <el-input
            v-show="data.groupName === '新建分组'"
            size="mini"
            v-model="data.newGroupName"
          ></el-input>
        </div>
      </div>

      <div class="c-name flex-1">
        <div class="d-flex">
          <span>加速区域：</span>
          <span>{{ status[data.quickenArea + ""] }}</span>
        </div>
      </div>
    </div>
    <div class="tags p-d-10-20" v-if="!isOne && data.realmName.length > 0">
      <div class="tag-group">
        <domain-tag
          v-for="(name, index) in data.realmName"
          :name="name"
          :key="index"
          @close="delHost(index)"
          :color="index === mark ? '#00A896' : '#fff'"
          :fontColor="index === mark ? '#fff' : '#666'"
          :closable="index === mark ? true : false"
          @click.native="mark = index"
        ></domain-tag>
      </div>
    </div>
    <div v-if="data.ipTypes.length > 0" class="set-host-box">
      <div class="set-host-list">
        <div
          class="set-list-item d-flex flex-1"
          v-for="(item, index) in data.ipTypes"
          :key="index"
        >
          <div class="host-name flex-1">
            <div class="d-flex">
              <span>源站信息：</span>
              <el-radio-group v-model="data.ipTypes[index].ipType">
                <el-radio :label="0">IP</el-radio>
                <el-radio :label="1">域名</el-radio>
              </el-radio-group>
              <el-input size="mini" v-model="data.ipTypes[index].ip"></el-input>
              <span
                v-if="index === data.ipTypes.length - 1"
                class="_add"
                @click="addIp"
                >添加</span
              >
              <span class="_del" @click="delIp(index)" v-if="index !== 0"
                >删除</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="p-d-10-20">
      <p>地址：101.112.222.333</p>
    </div>-->
    <div class="p-d-10-20">
      <el-button @click.native="cancel" size="mini" class="_cancel_btn"
        >取消</el-button
      >
      <el-button @click.native="submit" size="mini" class="_save_btn"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import DomainTag from "./domain-tag";
import { getNginxInfo, updateNginxInfo } from "@/api/site";
import { queryGroupName, addGroupName } from "@/api/domain";
const defaultIpTypes = {
  ip: "", // 后端ip地址 用,隔开
  type: "web", // IP类型
  ipType: 0, // ip或者域名
  ableStatus: 1, // 是否暂停
};

export default {
  components: {
    DomainTag,
  },
  data() {
    return {
      data: {
        allDomin: "",
        host: "",
        groupName: "",
        newGroupName: "",
        realmName: [], // 域名
        ipTypes: [],
        quickenArea: "",

        //   redirectType: 1, // 重定向类型
        //   redirectUrl: "", // 重定向域名
        //   productName: "", // 产品名称
        //   redirect: 0, // 重定向开关
        //   // recordLine: 0,
        //   type: "", // 协议类型 1.http 2.https

        //   portNum: "", // 端口
        //   remark: "", // 备注

        //   localNames: {
        //     localUrl: "", // 反向代理路径
        //     localName: "", // 路径
        //     lips: "", // 路径对应IP
        //     gzipStatus: 0, // gzip开启状态 0.关闭 1开启
        //     longLink: 0 // 长链接开关 0.为关 1.为开
        //   },
        //   originPrivkey: "",
        //   originFullchain: ""
      },
      host: "",
      radio: 3,
      mark: "",
      status: {
        0: "国内",
        1: "海外",
        2: "全球",
      },
      groupNameList: [],
      dataCopy: {},
    };
  },
  created() {
    this.initData();
  },
  computed: {
    isOne() {
      return this.data.realmName.length <= 1;
    },
    //总数据
    dataList() {
      return JSON.parse(this.$route.query.data);
    },
    id() {
      return this.dataList.id;
    },
  },
  methods: {
    initData() {
      let id = this.dataList.id;
      getNginxInfo(id).then((res) => {
        if (res.code == 200) {
          this.data.allDomin = this.dataList.allDomin;
          this.data.groupName = res.data.groupName;
          this.data.realmName = res.data.realmName;
          this.data.ipTypes = res.data.ipTypes;
          this.data.quickenArea = res.data.quickenArea;
          this.dataCopy = this.deepCopy(this.data);
        }
      });
      queryGroupName().then((res) => {
        if (res.code == 200) {
          this.groupNameList = res.data.rows;
        }
      });
    },
    addHost() {
      if (!this.data.host) return this.$message.error("域名不能为空");
      this.data.realmName.push(this.data.host);
      this.data.host = "";
    },
    delHost(index) {
      this.data.realmName.splice(index, 1);
    },
    //添加host修改项
    addIp() {
      this.data.ipTypes.push({ ...defaultIpTypes });
    },
    //删除host修改项
    delIp(index) {
      this.data.ipTypes.splice(index, 1);
    },
    cancel() {
      this.data = this.deepCopy(this.dataCopy);
      this.mark = "";
      this.$message.success("已取消所有操作");
    },
    async submit() {
      // let ipTypes = this.delResidueIp();
      let params = {
        id: this.id,
        ipTypes: this.data.ipTypes,
        realmName: this.data.realmName,
        groupName: this.data.groupName,
      };
      if (this.data.groupName == "新建分组") {
        params["groupName"] = this.data.newGroupName;
        let res = await addGroupName(this.data.newGroupName);
        if (res.code !== 200) {
          return;
        }
      }
      await updateNginxInfo(params).then((res) => {
        if (res.code == 200) {
          this.$router.go(-1);
        }
      });
    },
    // delResidueIp() {
    //   let arr = this.data.ipTypes.reduce((acc, cur) => {
    //     if (cur.ip) acc.push(cur);
    //     return acc;
    //   }, []);
    //   return arr;
    // },
    //深拷贝
    deepCopy(obj) {
      let arr = Array.isArray(obj) ? [] : {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] == "object" && typeof obj[key] != null) {
            arr[key] = this.deepCopy(obj[key]);
          } else {
            arr[key] = obj[key];
          }
        }
      }

      return arr;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "@styles/theme.scss";
.general-information {
  width: 100%;
  font-size: 12px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(236, 238, 241, 1);
  box-sizing: border-box;
  margin: 12px 0px;
  padding: 27px;
  .d-flex {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .contain-flex {
    flex-wrap: wrap;
  }
  .p-d-10-20 {
    padding: 10px 30px;
  }
  .host-name {
    height: 30px;
    color: #020202;
    ._add,
    ._del {
      margin-right: 10px;
      color: $theme-color;
      cursor: pointer;
    }
    .el-input {
      margin-right: 10px;
      width: 150px;
    }
  }
  .c-name {
    color: #020202;
    display: flex;
    .d-flex {
      height: 30px;
    }
    .select {
      width: 176px;
      span {
        width: 60px;
        display: block;
      }
    }
    .newGroupName {
      flex-basis: 100px;
      margin: 0 10px;
    }
  }
  .tag-group {
    padding: 10px;
    background: rgba(249, 249, 249, 1);
    display: flex;
    flex-wrap: wrap;
  }
  .set-host-box {
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    .set-host-list {
      padding: 10px;
      background: rgba(249, 249, 249, 1);
      .set-list-item {
        display: inline-block;
        width: 50%;
        margin: 10px 0px;
      }
    }
  }

  .flex-1 {
    height: 30px;
    align-items: center;
    flex: 1;
  }
}
</style>
<style lang="scss">
.general-information {
  .set-host-list {
    .el-radio {
      margin-right: 20px;
      .el-radio__label {
        font-size: 12px !important;
      }
    }
    .el-radio:last-child {
      margin-right: 10px;
    }
  }
  ._cancel_btn {
    background: rgba(244, 244, 244, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    border-radius: 2px 2px 2px 2px;
    padding: 7px 40px;
    margin-right: 20px;
  }
  ._save_btn {
    background: rgba(0, 168, 150, 1);
    border-radius: 2px 2px 2px 2px;
    padding: 7px 40px;
    span {
      color: #ffffff;
    }
  }
}
</style>
