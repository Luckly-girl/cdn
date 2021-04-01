<template>
  <div class="recordServe">
    <div class="record-title">日志服务</div>
    <div class="record-search">
      <el-form ref="form" label-width="110px">
        <el-form-item label="起止时间选择" class="dataSelect">
          <el-date-picker
            v-model="dateSearch"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0" class="searchInfo">
          <i class="icon-search pointer" @click="searchData"></i>
          <el-input v-model="searchMap.fileName"></el-input>
          <el-button>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="searchMap" border stripe style="width: 100%">
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column label="开始时间" prop="startTime"> </el-table-column>
        <el-table-column label="结束时间" prop="endTime"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <span class="download" @click="downLoad()">下载</span>
            <span class="delete" @click="deleteInfo()">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import { dateFilter } from "@/filters";
export default {
  data() {
    return {
      total: 0,
      dateSearch: [],
      searchMap: [
        {
          fileName: "luckly",
          startTime: "2019.3.6",
          endTime: "2020.6.9",
        },
        {
          fileName: "janney",
          startTime: "2020.3.16",
          endTime: "2020.7.20",
        },
      ],
      list: [],
    };
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.searchMap.startTime = dateFilter(val[0].getTime());
        this.searchMap.endTime = dateFilter(val[1].getTime());
      } else {
        this.searchMap.startTime = "";
        this.searchMap.startTime = "";
      }
      this.searchData();
    },
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss">
.recordServe {
  .el-form-item__label {
    font-size: 14px;
    color: rgba(39, 39, 39, 1);
  }

  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
  .el-table--enable-row-transition .el-table__body td {
    height: 55px;
  }
  // .searchInfo{
  //   display: inline-block;
  //   .el-input{
  //   }
  // }
}
</style>

<style lang="scss" scoped>
.recordServe {
  background-color: #fff;
  .record-title {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 50px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(2, 2, 2, 1);
  }
  .record-search {
    display: flex;
    padding: 0 30px;
  }
  .searchInfo,
  .dataSelect {
    display: inline-block;
  }
  .searchInfo {
    margin-left: 30px;
    .el-input {
      width: 300px;
    }
    .el-button {
      width: 95px;
      height: 40px;
      margin-left: 20px;
      background: rgba(0, 168, 150, 1);
      border-radius: 4px 4px;
      color: #fff;
    }
    .icon-search {
      margin-right: 115px;
      color: rgba(0, 168, 150, 1);
    }
    img {
      position: absolute;
      top: 5px;
      right: 60px;
    }
  }
  .table {
    padding: 30px;
    .download,.delete {
      width: 50px;
      margin: 0 20px;
      color: #01A997;
      cursor: pointer;
    }
  }
}
</style>
