<template>
  <div class="latest-product">
    <div class="left">
      <div class="latest_notice">
        <div class="title">
          <div>
            <i class="iconfont iconzuixin"></i>
            <span>最新产品</span>
          </div>
        </div>
        <div class="content">
          <div class="content_product">
            <div class="content_title">智能校园安防解决方案3.0版本上线</div>
            <div
              class="content_text"
            >校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。</div>
          </div>
          <div class="content_product">
            <div class="content_title">智能校园安防解决方案3.0版本上线</div>
            <div class="content_text">校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。</div>
          </div>
          <div class="content_product">
            <div class="content_title">智能校园安防解决方案3.0版本上线</div>
            <div class="content_text">校园安防机器人及监控联动系统，助力校园安全防范校园霸凌，为使用者提供贴心服务。</div>
          </div>
        </div>
        <pagination ref="pagination" :total="total"></pagination>
      </div>
    </div>
    <div class="right">
      <div class="pending">
        <ul>
          <li>
            <i class="iconfont icondaixufei"></i>
            <div>待续费</div>
            <span>0</span>
          </li>
          <li>
            <i class="iconfont icondaizhifu"></i>
            <div>待支付</div>
            <span>3</span>
          </li>
          <li>
            <i class="iconfont icongongdan1"></i>
            <div>待处理工单</div>
            <span>12</span>
          </li>
        </ul>
      </div>

      <div class="latest_notice">
        <div class="title">
          <div>
            <i class="iconfont iconremen"></i>
            <span>最新公告</span>
          </div>
          <div class="pointer">
            <span class="more">更多</span>
            <i class="iconfont iconxiala1"></i>
          </div>
        </div>
        <div class="content">
          <ul>
            <li>
              <div
                class="content_text"
              >【新闻】佰讯科技荣登世界500强榜单，位列,【新闻】佰讯科技荣登世界500强榜单，位列,【新闻】佰讯科技荣登世界500强榜单，位列,【新闻】佰讯科技荣登世界500强榜单，位列</div>
              <div class="content_time">2020-06-20</div>
            </li>
            <li>
              <div class="content_text">【新闻】佰讯科技荣登世界500强榜单，位列</div>
              <div class="content_time">2020-06-20</div>
            </li>
            <li>
              <div class="content_text">【新闻】佰讯科技荣登世界500强榜单，位列</div>
              <div class="content_time">2020-06-18</div>
            </li>
            <li>
              <div class="content_text">【新闻】佰讯科技荣登世界500强榜单，位列</div>
              <div class="content_time">2020-06-18</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="img">
        <img src="@/assets/images/home/bg_news2@2x.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
// import { getHomeInfo } from "@/api/login";

export default {
  data() {
    return {
      total: 30
    };
  }
};
</script>

<style lang="scss">
.latest-product {
  .el-pagination {
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.latest-product {
  width: 100%;
  // border: 1px solid red;

  .latest_notice {
    background-color: #fff;
    padding-bottom: 24px;

    .title {
      display: flex;
      justify-content: space-between;

      > div {
        display: flex;
        align-items: center;
      }
    }

    .content {
      padding: 34px 50px;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #45a2fa;
        }

        .content_text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content_time {
          margin-left: 30px;
          flex: 80px 0 0;
        }
      }

      .content_product {
        padding-bottom: 12px;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(236, 238, 241, 1);
        cursor: pointer;

        &:last-child {
          margin-bottom: 0px;
          border-bottom: none;
        }

        .content_title {
          margin-bottom: 6px;
          font-size: 14px;
          color: rgba(101, 101, 101, 1);
          line-height: 18px;
        }

        .content_text {
          font-size: 12px;
          color: rgba(153, 153, 155, 1);
          line-height: 20px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; // 超出的文本隐藏
          text-overflow: ellipsis; // 溢出用省略号显示
          display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
          -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
          line-clamp: 2;
          -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        }
      }
    }
  }

  .left {
    width: 70%;
    display: inline-block;
    margin-right: 20px;
    vertical-align: top;
  }

  .right {
    display: inline-block;
    width: 28%;
    vertical-align: top;

    .pending {
      background-color: #fff;
      margin-bottom: 24px;

      ul {
        display: flex;
        justify-content: space-around;

        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 240px;

          > div {
            color: rgba(102, 102, 102, 1);
            line-height: 24px;
            margin-top: 10px;
            margin-bottom: 20px;
          }

          > span {
            font-size: 22px;
            font-family: Impact;
            font-weight: 400;
            color: rgba(2, 2, 2, 1);
            line-height: 20px;
          }
        }
      }
    }

    .content {
      padding: 20px 25px;
      
    }

    img {
      width: 100%;
    }
  }

  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(1, 1, 1, 1);
    margin: 0px 30px;
    padding: 10px 0;
    height: 40px;
    line-height: 45px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  .text {
    font-size: 16px;
    color: rgba(1, 1, 1, 1);
  }
}

.iconxiala1 {
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
}

.iconxiala1 {
  margin-left: 4px;
}

.icondaixufei,
.icondaizhifu,
.icongongdan1 {
  font-size: 30px;
  color: #45a2fa;
}

.icongongdan1 {
  font-size: 28px;
}

.iconremen,
.iconzuixin {
  font-size: 30px;
  color: #fcbc43;
  margin-right: 8px;
}

.more {
  font-size: 14px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
}
</style>
