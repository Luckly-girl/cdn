<template>
  <div class="agreement">
    <div class="order-title">
      <span @click="$router.push('/expenseCenter/agreement')">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      合同管理
    </div>

    <div class="daoqi">
      <el-form ref="form">
        <el-form-item class="search">
          <i class="el-icon-search pointer" @click="searchData"></i>
          <el-input
            v-model="searchMap.orderNumber"
            placeholder="请输入订单号"
            icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item label="起止时间选择" label-width="110px">
          <el-date-picker
            v-model="dateSearch"
            type="datetimerange"
            range-separator="-"
            :default-time="['12:00:00']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="orderNum" label="选择" width="120">
          <template slot-scope="scope">
            <div
              class="table-circle"
              :class="{ 'table-active': scope.row.check }"
              @click="selectedClick(scope.row.id)"
            >
              <div class="outer">
                <div class="inner"></div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号"></el-table-column>
        <el-table-column prop="productName" label="产品"></el-table-column>
        <el-table-column prop="orderQuantity" label="数量"></el-table-column>
        <el-table-column
          prop="orderDetails"
          label="具体详情"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="购买方式"
          :filters="purchList"
          column-key="type"
          :filter-multiple="false"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            {{ scope.row.type | purchListFilter }}
          </template></el-table-column
        >
        <el-table-column prop="orderAmount" label="价格"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.insertTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="支付/开通时间">
          <template slot-scope="scope">
            {{ scope.row.paymentTime | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>

    <el-button
      class="order-footer"
      @click="dataSetClick"
      :disabled="managements.length < 1"
      >申请合同</el-button
    >
  </div>
</template>

<script>
import { getTobeContractList, getTobeContract } from "@/api/contract.js";
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      searchMap: {
        orderNumber: "",
        startTime: "",
        endTime: "",
      },
      contractInfo: {
        contactNumber: "",
        contacts: "",
        contactsAddress: "",
        contactsSubjectName: "",
      },

      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      dialogVisible: false,
      list: [],
      total: 0,
      dateSearch: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.searchMap.startTime = dateFilter(val[0].getTime());
        this.searchMap.endTime = dateFilter(val[1].getTime());
      } else {
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
    },
  },
  computed: {
    managements() {
      return this.list.filter((item) => item.check).map((item) => item.id);
    },
    // purchText() {
    //   if (this.list.type === "") {
    //     return "购买方式";
    //   } else {
    //     return this.$store.state.purchList[this.list.type];
    //   }
    // },
    purchList() {
      return this.$store.state.purchList;
    },
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },

    fetchData() {
      getTobeContractList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.orderNumber,
        this.searchMap.startTime,
        this.searchMap.endTime
      ).then((res) => {
        this.list = res.data.rows.map((item) => {
          return { ...item, check: false };
        });
        // console.log(this.list, 111111);
        this.total = res.data.total;
      });
    },

    selectedClick(id) {
      this.list.forEach((item) => {
        if (item.id === id) {
          item.check = !item.check;
        }
      });
    },
    dataSetClick() {
      getTobeContract(this.managements.join(",")).then((res) => {
        // console.log(res.data);
        this.$router.push({
          path: "/expenseCenter/agreementComplate",
          query: { data: res.data },
        });
      });

      // this.dialogVisible = true;
    },
    changeClick() {
    },
    filterTag(value, row) {
      return true;
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
    },
  },
  created() {
    this.getCityData();
  },
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
}
</style>

<style lang="scss" scoped>
.agreement {
  padding: 0 30px 30px;
  background-color: #fff;
  .order-title {
    position: relative;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
    span {
      position: absolute;
      left: -15px;
      display: inline-block;
      width: 40px;
      height: 20px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 168, 150, 1);
      cursor: pointer;
    }
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
      cursor: pointer;
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
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #00a896;
    border-radius: 2px;
  }
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
