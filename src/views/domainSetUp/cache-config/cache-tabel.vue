<template>
  <div class="cache-table">
    <!-- 新增缓存配置 -->
    <el-dialog title="新增缓存配置" @close="close('addForm')" :visible.sync="addCache" width="600px">
      <div class="add_container">
        <el-form ref="addForm" @click.prevent label-width="80px" :model="cacheUnit">
          <el-form-item label="类型">
            <el-radio v-model="type" label="2">文件后缀名</el-radio>
          </el-form-item>

          <el-form-item
            prop="cacheTypes"
            :rules="[{ required: true, message: '文件后缀名不能为空',trigger: 'blur' },{}]"
            label="后缀类型"
          >
            <el-input ref="_input" v-model="cacheUnit.cacheTypes"></el-input>
            <p class="_tip">多个文件后缀用;隔开</p>
          </el-form-item>

          <el-form-item
            prop="cacheTime"
            :rules="[{ required: true, message: '过期时间不能为空'},{ type: 'number', message: '时间必须为数字值'}]"
            label="过期时间"
          >
            <div class="dateConfig">
              <div style="margin-right:20px;flex:1">
                <el-input v-model.number="cacheUnit.cacheTime"></el-input>
              </div>
              <div style="flex-basis:100px">
                <el-select v-model="cacheUnit.cacheTimeType">
                  <el-option
                    v-for="item of timeTypes"
                    :key="item.value"
                    :value="item.value"
                    :label="item.type"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <button @click.prevent="addCache=false" class="_cancel_btn">取消</button>
            <!-- <el-button size="mini" class="_cancel_btn">取消</el-button> -->
            <!-- <el-button size="mini" class="_save_btn">确定</el-button> -->
            <button @click.prevent="confirm" class="_save_btn">确定</button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改" @close="close('changeForm')" :visible.sync="reviseCache" width="400px">
      <div class="reviseCache">
        <el-form ref="changeForm" @click.prevent label-width="80px" :model="cacheUnit">
          <el-form-item
            prop="cacheTime"
            :rules="[{ required: true, message: '过期时间不能为空'},{ type: 'number', message: '时间必须为数字值'}]"
            label="过期时间"
          >
            <div class="dateConfig">
              <div style="margin-right:20px;flex:1">
                <el-input v-model.number="cacheUnit.cacheTime"></el-input>
              </div>
              <div style="flex-basis:100px">
                <el-select v-model="cacheUnit.cacheTimeType">
                  <el-option
                    v-for="item of timeTypes"
                    :key="item.value"
                    :value="item.value"
                    :label="item.type"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>

          <button @click.prevent="reviseCache=false" class="_cancel_btn">取消</button>
          <!-- <el-button size="mini" class="_cancel_btn">取消</el-button> -->
          <!-- <el-button size="mini" class="_save_btn">确定</el-button> -->
          <button @click.prevent="reviseConfirm" class="_save_btn">确定</button>
        </el-form>
      </div>
    </el-dialog>

    <h2>
      缓存过期配置
      <el-button
        :style="{opacity:btnShow?1:.3,marginLeft:'10px'}"
        :disabled="!btnShow"
        @click.native="save"
        size="mini"
      >保存</el-button>
    </h2>

    <div class="dis">
      <span>缓存配置开启：</span>
      <el-switch :active-value="1" :inactive-value="0" v-model="flag"></el-switch>
    </div>
    <div v-show="flag===1">
      <div>
        <el-button size="mini" type="primary" @click="addRow">新增缓存配置</el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column align="center" width="180" label="类型">
          <template>文件类型</template>
        </el-table-column>
        <el-table-column align="center" prop="cacheTypes" label="内容" width="180"></el-table-column>
        <el-table-column align="center" prop="cacheTime" label="刷新时间">
          <template slot-scope="scope">
            <span>{{`${scope.row.cacheTime}${dateType[scope.row.cacheTimeType]}`}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="操作">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index,scope.row)" class="_edit">修改</span>
            <span @click="handleDelete(scope.$index)" class="_delete">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { cacheConfData, updateCacheConfData } from "@/api/site";
import { timeFormate, deepCopy } from "@/utils";
export default {
  data() {
    return {
      flag: 0,
      tableData: [],
      addCache: false,
      reviseCache: false,
      type: "2",
      timeTypes: [
        {
          value: 1,
          type: "天"
        },
        {
          value: 2,
          type: "小时"
        },
        {
          value: 3,
          type: "分钟"
        },
        {
          value: 4,
          type: "秒"
        }
      ],
      dateType: {
        1: "天",
        2: "小时",
        3: "分钟",
        4: "秒"
      },
      cacheUnit: {
        cacheTypes: "",
        cacheTime: "",
        cacheTimeType: 4
      },
      $index: 0,
      copyData: {},
      btnShow: false
    };
  },
  computed: {
    id() {
      return JSON.parse(this.$route.query.data).id;
    },
  },
  created() {
    this.cache=JSON.parse(this.$route.query.data).cache;
    this.flag=this.cache;
    this.initData();
  },
  methods: {
    initData() {
    
      cacheConfData(this.id).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows;
          this.copyData = deepCopy(this.tableData);
        }
      });
    },
    addRow() {
      this.cacheUnit = {
        cacheTypes: "",
        cacheTime: "",
        cacheTimeType: 4
      };
      this.addCache = true;
    },
    close(form) {
      this.$refs[form].clearValidate();
    },
    //删除
    handleDelete(index) {
      this.btnShow = true;
      this.tableData.splice(index, 1);
    },
    handleEdit(index, obj) {
      this.reviseCache = true;
      this.cacheUnit.cacheTimeType = obj.cacheTimeType;
      this.cacheUnit.cacheTime = obj.cacheTime / 1;
      this.$index = index;
    },
    //修改确认
    reviseConfirm() {
      this.tableData[this.$index].cacheTimeType = this.cacheUnit.cacheTimeType;
      this.tableData[this.$index].cacheTime = this.cacheUnit.cacheTime + "";
      this.tableData[this.$index].lastTime = timeFormate(Date.now());
      // console.log(this.tableData);
      this.reviseCache = false;
      this.btnShow = true;
    },

    //新增确认
    confirm() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let reg=/^[a-zA-Z0-9]{3,6}$/;

          for(let u of this.cacheUnit.cacheTypes.split(';')){
            if(!reg.test(u)){
               this.$refs._input.focus();
              return this.$message.error('后缀类型不对')
            }
          }


          


          this.btnShow = true;
          let lastTime = timeFormate(Date.now());
          this.tableData.push({
            cacheTypes: this.cacheUnit.cacheTypes,
            cacheTime: this.cacheUnit.cacheTime + "",
            cacheTimeType: this.cacheUnit.cacheTimeType,
            lastTime
          });
          this.addCache = false;
        }
      });
    },
    save() {
      updateCacheConfData({
        siteCacheTimeConfs: this.tableData,
        cache: this.flag,
        nginxId: this.id
      }).then(res => {
        if (res.code == 200) {
          this.$message.success({
            duration:1500,
            message: "缓存配置成功",
            onClose: () => {
              this.cache=this.flag;
              this.btnShow = false;
              this.addCache = false;
              this.initData();
            }
          });
        }
      });
    }
  },
  watch: {
    flag(val){
      if(val!==this.cache){
        this.btnShow=true
      }else{
         this.btnShow=false
      }
    }
  }
};
</script>

<style lang="scss">
.cache-table {
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    .el-dialog__headerbtn {
      width: auto;
      height: auto;
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-form-item__label {
    padding-right: 20px !important;
  }
}
</style>


<style lang="scss" scoped>
@import "@styles/theme.scss";
@import "@styles/mixins.scss";
.cache-table {
  h2 {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: rgba(2, 2, 2, 1);
    line-height: 34px;
    margin-bottom:20px;
  }
  .dis {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  ._edit,
  ._delete {
    margin: 5px;
    color: $theme-color;
    cursor: pointer;
  }
  .el-table {
    margin-top: 20px;
  }
  .el-button--default {
    color: $theme-color;
    border-color: $theme-color;
  }
  .el-button--primary {
    background-color: $theme-color;
  }
  .add_container,
  .reviseCache {
    padding: 0 30px;
    .dateConfig {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    ._cancel_btn {
      margin: {
        right: 20px;
      }
      @include buttonType("cancel");
    }

    ._save_btn {
      @include buttonType;
    }
    ._tip {
      font-size: 12px;
    }
  }
}
</style>
