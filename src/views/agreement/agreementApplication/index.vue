<template>
  <div class="agreement">
    <div class="order-title">合同管理</div>

    <div class="daoqi">
      <el-form ref="form">
        <el-form-item class="search">
          <i class="el-icon-search pointer" @click="fetchData"></i>
          <el-input v-model="input" placeholder="请输入内容" icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="起止时间选择" label-width="110px">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="选择" width="120">
          <template slot-scope="scope">
            <div
              class="table-circle"
              :class="{ 'table-active' : scope.row.bool }"
              @click="selectedClick(scope.row.id)"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="订单号"></el-table-column>
        <el-table-column prop="createdTime" label="产品"></el-table-column>
        <el-table-column prop="payTime" label="创建时间"></el-table-column>
        <el-table-column prop="payTime" label="支付/开通时间"></el-table-column>
      </el-table>
    </div>

    <div class="order-footer pointer" @click="dataSetClick">申请合同</div>

    <el-dialog title="确认信息" :visible.sync="dialogVisible" width="500px" center>
      <div class="dialog-select">
        <div class="input-wrap">
          <div class="mark">
            提示：
            <br />请补充收件信息。我们提供邮寄选项，金额以下用户承担邮寄费用。
          </div>
        </div>
        <div class="input-wrap">
          <ul>
            <li>
              订单号：
              <span>20036990540559</span>
            </li>
            <li>
              产品：
              <span>CDN基础版</span>
            </li>
            <li>
              <div class="addr">收货地址：</div>
              <div class="linkage-wraper">
                <div class="linkage">
                  <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区">
                    <el-option
                      v-for="item in province"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select v-model="shi" @change="choseCity" placeholder="市级地区">
                    <el-option
                      v-for="item in shi1"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select v-model="qu" @change="choseBlock" placeholder="区级地区">
                    <el-option
                      v-for="item in qu1"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <el-input v-model="input" placeholder="**街道**号"></el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // mapJson: "../../../mock/map.json",
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      dialogVisible: false,
      input: "",
      value1: "",
      textarea: "",
      tableData: [
        {
          id: 0,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "新购",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "取消",
          money: "256.00",
          bool: false
        },
        {
          id: 1,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "续费",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "处理中",
          money: "256.00",
          bool: false
        },
        {
          id: 3,
          orderNum: "2020010217582",
          productName: "CDN基础版",
          type: "升级",
          createdTime: "2020-01-02 12:25:30",
          payTime: "2020-01-02 12:25:30",
          status: "待支付",
          money: "256.00",
          bool: false
        }
      ]
    };
  },
  methods: {
    fetchData() {
    },
    selectedClick(id) {
      this.tableData.forEach(item => {
        if (item.id === id) {
          item.bool = !item.bool;
        }
      });
    },
    dataSetClick() {
      this.dialogVisible = true;
    },
    changeClick() {
    },
    // 加载china地点数据，三级
    getCityData() {
      var that = this;
      // axios
      //   .get(`/static/json/map.json`)
      //   .then(response => {
      //     // console.log(response);
      //     if (response.status == 200) {
      //       var data = response.data;
      //       that.province = [];
      //       that.city = [];
      //       that.block = [];
      //       // 省市区数据分类
      //       for (var item in data) {
      //         if (item.match(/0000$/)) {
      //           //省
      //           that.province.push({
      //             id: item,
      //             value: data[item],
      //             children: []
      //           });
      //         } else if (item.match(/00$/)) {
      //           //市
      //           that.city.push({ id: item, value: data[item], children: [] });
      //         } else {
      //           //区
      //           that.block.push({ id: item, value: data[item] });
      //         }
      //       }
      //       // 分类市级
      //       for (var index in that.province) {
      //         for (var index1 in that.city) {
      //           if (
      //             that.province[index].id.slice(0, 2) ===
      //             that.city[index1].id.slice(0, 2)
      //           ) {
      //             that.province[index].children.push(that.city[index1]);
      //           }
      //         }
      //       }
      //       // 分类区级
      //       for (var item1 in that.city) {
      //         for (var item2 in that.block) {
      //           if (
      //             that.block[item2].id.slice(0, 4) ===
      //             that.city[item1].id.slice(0, 4)
      //           ) {
      //             that.city[item1].children.push(that.block[item2]);
      //           }
      //         }
      //       }
      //     } else {
      //       console.log(response.status);
      //     }
      //   })
      //   .catch(error => {
      //     console.log(typeof +error);
      //   });
    },
    // 选省
    choseProvince(e) {
      console.log(e);
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
        }
      }
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          // console.log(this.E)
        }
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      // console.log(this.E)
    }
  },
  created() {
    this.getCityData();
  }
};
</script>

<style lang="scss">
.agreement {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }

  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }

  .el-dialog__header {
    height: 60px;
    line-height: 60px;
    background-color: rgba(249, 249, 249, 1);
  }
  .el-dialog__footer {
    padding-bottom: 50px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }

  .el-dialog .el-textarea__inner {
    width: 100%;
  }
}
</style>


<style lang="scss" scoped>
.agreement {
  padding: 0 30px 30px;
  background-color: #fff;
  .order-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .daoqi {
    display: flex;
    padding: 0 20px 20px;
    .search {
      position: relative;
      i {
        position: absolute;
        right: 14px;
        top: 8px;
        z-index: 99;
        font-size: 24px;
        color: rgba(0, 168, 150, 1);
      }
      .el-input {
        width: 260px;
      }
    }
  }
  .table {
    padding: 20px 0 30px;
    .table-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: bottom;
      .outer {
        width: 22px;
        height: 22px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(229, 229, 229, 1);
        border-radius: 50%;
      }
    }
    .table-active {
      .outer {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(0, 168, 150, 1);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgba(0, 168, 150, 1);
        }
      }
    }
  }
  .order-footer {
    width: 135px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin: 25px auto 10px;
    font-size: 14px;
    color: #00a896;
    border: 1px solid #00a896;
    border-radius: 2px;
  }
}

.dialog-select {
  padding: 0px 40px 20px;
  .input-wrap {
    margin-bottom: 0;
    padding: 30px 0px 0;
    .mark {
      text-align: left;
      padding: 13px 16px;
      background-color: #e5f6f4;
    }
    ul {
      text-align: left;
      li {
        display: flex;
        font-size: 14px;
        font-weight: 700;
        color: rgba(39, 39, 39, 1);
        line-height: 36px;
        .addr {
          padding: 10px 10px 0 0;
        }
        .linkage-wraper {
          width: 80%;
          .linkage {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 10px 0 16px;
            .el-select {
              width: 104px;
            }
          }
        }
        span {
          font-size: 12px;
          font-weight: 400;
          margin-left: 16px;
        }
      }
    }
  }
}
.el-button {
  color: #fff;
  width: 174px;
  height: 39px;
  background: rgba(0, 174, 120, 1);
  border-radius: 3px;
}
.el-form {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .el-form-item {
    margin-bottom: 0;
    .el-select {
      width: 120px;
    }
  }
}
</style>
