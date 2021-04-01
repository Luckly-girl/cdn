<template>
  <div class="export-record">
    <div class="order-title">导出记录</div>

    <div class="search">
      <span>文件类型</span>
      <el-select
        v-model="fileType"
        placeholder="请选择"
        clearable
        @change="searchData"
      >
        <el-option
          v-for="(item, index) in fileTypeList"
          :key="index"
          :label="item"
          :value="index"
        ></el-option>
      </el-select>
    </div>

    <div class="mark">注意：导出的文件将暂存在佰讯云7天，超时删除。</div>

    <div class="table">
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column label="文件格式">
          <template slot-scope="scope">
            {{ scope.row.fileType | fileTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="fileStatus" label="状态">
          <template slot-scope="scope">
            {{ scope.row.fileStatus | fileStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="文件生成时间">
          <template slot-scope="scope">
            {{ scope.row.insertTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="最近下载时间">
          <template slot-scope="scope">
            {{ scope.row.downloadTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="pointer"
              @click="handleDownLoad(scope.row.id, scope.row.fileUrl)"
              v-if="scope.row.fileStatus == 1"
              >下载</span
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import { getExportList, updateDownloadTime } from "@/api/expense.js";
export default {
  data() {
    return {
      value: "",
      options: [
        {
          label: "全部文件类型",
          value: "全部文件类型",
        },
        {
          label: "pdf",
          value: "pdf",
        },
        {
          label: "txt",
          value: "txt",
        },
      ],
      list: [],
      total: 0,
      fileType: "",
    };
  },
  computed: {
    fileTypeList() {
      return this.$store.state.fileTypeList;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      getExportList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.fileType
      ).then((res) => {
        this.list = res.data.rows;
        // console.log(this.list);
        this.total = res.data.total;
      });
    },
    handleDownLoad(val, url) {
      window.open(url, "_blank");
      updateDownloadTime(val)
        .then((res) => {
          if (res.code === 200) {
            location.reload();
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss">
.export-record {
  .el-table th > .cell,
  .el-table td > .cell {
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.export-record {
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
  .search {
    span {
      font-size: 14px;
      color: rgba(39, 39, 39, 1);
      margin-right: 20px;
    }
    .el-select {
      width: 160px;
    }
  }
  .mark {
    text-align: right;
    margin-top: 20px;
    padding-right: 30px;
    font-size: 12px;
    color: rgba(255, 0, 0, 1);
  }
  .table {
    padding: 20px 0 30px;
    span {
      cursor: pointer;
      padding: 8px 16px;
      color: rgba(0, 168, 150, 1);
    }
  }
}
</style>
