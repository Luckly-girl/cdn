<template>
  <div class="login" id="loginSubmitBtn">
    <div class="login-header-bg">
      <div class="login-header dis sp-be">
        <h1 class="login-logo">
          <img src="../../assets/images/v4.0/login/logo.png" alt>
        </h1>
        <span>欢迎注册！</span>
      </div>
    </div>
    <div class="login-container">
      <div class="login-user">
        <div class="login-user-title">忘记密码</div>

        <el-form :model="userInfo" :rules="registRules" ref="userInfo">
          <!-- 输入框 -->
          <input type="password" class="hide" id="password">
          <input type="text" class="hide" id="username">
          <!-- <el-form-item prop="userName" class="input-bg">
            <el-input autocomplete="off" v-model="userInfo.userName" placeholder="用户名"></el-input>
          </el-form-item>-->
          <el-form-item prop="email" class="input-bg">
            <el-input v-model="userInfo.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="phoneNumber" class="input-bg">
            <el-input v-model="userInfo.phoneNumber" placeholder="手机号" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item prop="mcode" class="input-bg phoneNumberItem">
            <el-input v-model="userInfo.mcode" placeholder="验证码" maxlength="6"></el-input>
            <el-button
              type="text"
              @click.prevent="getCode()"
              class="code-btn"
              :disabled="!codeShow"
            >
              <span v-show="codeShow">获取验证码</span>
              <span v-show="!codeShow" class="count">重新获取（{{ count }} s）</span>
            </el-button>
          </el-form-item>
          <el-form-item prop="passWord" class="input-bg">
            <el-input
              show-password
              autocomplete="off"
              v-model="userInfo.passWord"
              placeholder="设置密码"
            ></el-input>
          </el-form-item>

          <el-form-item prop="isPassWord" class="input-bg">
            <el-input
              show-password
              autocomplete="off"
              v-model="userInfo.isPassWord"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>

          <el-form-item class="btn loginBtn">
            <el-button class="submitBtn dis center" @click="handlerSubmitBtn">确定</el-button>
          </el-form-item>
          <el-form-item>
            <div class="registerBtn">
              已有账号？
              <span @click="$router.push('login')">立即登录</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-bottom-bg dis center">
      ©2018 武汉佰讯科技有限公司.All Rights Reserved 鄂ICP备20000871号-1
      鄂公网安备 42018502004475号
      <br>增值电信业务经营许可证号: 鄂B2-20190165
    </div>
  </div>
</template>

<script>
import { forgetPassword, checkMcode, sendMsgByForget } from "@/api/login";
import CryptoJS from "crypto-js";
export default {
  data() {
    let pwd = (rule, value, callback) => {
      if (value === "" && this.userInfo.isisPassWordPwd !== "") {
        callback(new Error("请输入新密码"));
      } else if (value === "" && this.userInfo.isPassWord === "") {
        callback();
      } else {
        if (value.length < 6) {
          callback(new Error("请输入6位以上的密码"));
        } else {
          if (this.userInfo.isPassWord !== "") {
            this.$refs.userInfo.validateField("isPassWord");
          }
          callback();
        }
      }
    };
    let isPwd = (rule, value, callback) => {
      if (value === "" && this.userInfo.passWord !== "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.userInfo.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let mobile = (rule, value, callback) => {
      if (value.length < 11) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的手机号"));
        } else {
          callback();
        }
      }
    };
    let email = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确格式的邮箱"));
      } else {
        callback();
      }
    };
    let mcode = (rule, value, callback) => {
      const reg = /^\d{6}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的短信验证码"));
      } else {
        callback();
      }
    };
    return {
      codeShow: true,
      userInfo: {
        passWord: "",
        isPassWord: "",
        email: "",
        phoneNumber: "",
        mcode: ""
      },
      timer: null,
      count: 60,
      registRules: {
        // userName: [
        //   { required: true, validator: userName, trigger: "blur" }
        // ],
        passWord: [{ required: true, validator: pwd, trigger: "blur" }],
        isPassWord: [{ required: true, validator: isPwd, trigger: "blur" }],
        email: [{ required: true, validator: email, trigger: "blur" }],
        phoneNumber: [{ required: true, validator: mobile, trigger: "blur" }],
        mcode: [{ required: true, validator: mcode, trigger: "blur" }]
      }
    };
  },
  created() {
    // if (localStorage.getItem("codeTime")) {
    //   this.count = 120 - parseInt((new Date().getTime() - localStorage.getItem("codeTime")) / 1000);
    //   this.codeShow = false;
    //   this.timer = setInterval(() => {
    //     if (this.count > 0 && this.count <= 120) {
    //       this.count--;
    //     } else {
    //       localStorage.removeItem("codeTime")
    //       this.codeShow = true;
    //       clearInterval(this.timer);
    //       this.timer = null;
    //     }
    //   }, 1000)
    // }
  },
  methods: {
    getCode() {
      this.$refs.userInfo.validateField("phoneNumber", err => {
        if (err) {
        } else {
          sendMsgByForget(this.userInfo.phoneNumber).then(res => {
            if (!this.timer) {
              localStorage.setItem("codeTime", new Date().getTime());
              this.count = 48;
              this.codeShow = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= 48) {
                  this.count--;
                } else {
                  localStorage.removeItem("codeTime");
                  this.codeShow = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          });
        }
      });
      //axios请求
    },
    // isRemember() {
    //   this.isActive = !this.isActive;
    // },
    handlerSubmitBtn() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          //   checkMcode(this.userInfo.phoneNumber, this.userInfo.mcode).then(res => {
          let _userInfo = {
            passWord: CryptoJS.MD5(this.userInfo.passWord).toString(),
            isPassWord: CryptoJS.MD5(this.userInfo.isPassWord).toString(),
            email: this.userInfo.email,
            phoneNumber: this.userInfo.phoneNumber,
            mcode: this.userInfo.mcode
          };
          forgetPassword(_userInfo).then(res => {
            localStorage.setItem(
              "registUserInfo",
              JSON.stringify({
                passWord: this.userInfo.passWord
              })
            );
            this.$router.push({
              path: "/login"
            });
          });
          //   })
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.hide {
  width: 0;
  position: absolute;
  border: 0;
}

.login {
  width: 100%;
  height: 100%;
  min-width: 1400px;
  background: #F5F5F6 url('../../assets/images/v4.0/login/section-img.png') no-repeat 21% center;
  background-size: 565px 375px;
  position: relative;
}

.login-container {
  position: absolute;
  box-sizing: border-box;
  width: 380px;
  top: 50%;
  transform: translateY(-50%);
  right: 15%;
  box-shadow: 0px 10px 9px 1px rgba(34, 24, 21, 0.1);
  overflow: hidden;
}

.login-container .login-manager-title {
  text-align: center;
  padding: 50px;
  height: 30px;
}

.code-btn {
  padding: 0;
  border: 0;
  display: flex;
  width: 35%;
  height: 100%;
  cursor: pointer;
  color: #00A795;
  font-size: 14px;
  background: transparent;
  justify-content: flex-end;

  .count {
    color: #999;
  }
}

.login-container .login-user {
  background: #fff;
  padding-bottom: 20px;
}

.login-user .login-user-title {
  text-align: center;
  padding: 56px 0 42px;
  height: 36px;
  color: #020202;
  font-size: 26px;
}

.el-from {
  padding: 20px 0;
}

.el-form-item {
  margin-bottom: 0;
}

.input-bg {
  height: 30px;
  margin: 0 40px 22px;
  border-bottom: 1px solid #BDBDBD;
}

.el-input {
  width: 300px;
  box-sizing: border-box;
  border: none;
  color: #fff;
  background: transparent;
  font-size: 20px;
  line-height: 30px;
}

.remember-me {
  overflow: hidden;
  padding: 8px 40px;
}

.remember-me > input {
  display: none;
}

.remember-me > label {
  display: flex;
  height: 16px;
  align-items: center;
  padding-left: 26px;
  font-family: 'Microsoft YaHei';
  color: #00A795;
  font-size: 12px;
  position: relative;
  cursor: pointer;
}

.remember-me > label::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  width: 14px;
  height: 14px;
  border: 1px solid #ddd;
}

.remember-me > label.right::before {
  content: '\e617';
  font-family: 'iconfont';
  color: #fff;
  border: 1px solid #00A795;
  background: #00A795;
  font-size: 14px;
}

.el-button {
  border-radius: 0;
}

.btn {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 40px;
}

.btn.loginBtn {
  padding-top: 16px;
}

.registerBtn {
  color: #666;
  width: 100%;
  font-size: 12px;
  padding-left: 40px;

  span {
    color: #00A795;
    cursor: pointer;
  }
}

.submitBtn {
  border: none;
  width: 100%;
  padding: 0;
  height: 39px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: normal;
  color: #fff;
  line-height: 30px;
  background: #00A795;
}

.login-header-bg {
  background: #fff;
  box-shadow: 0px 6px 6px 0px rgba(34, 24, 21, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.login-header {
  height: 80px;
  width: 1200px;
  margin: 0 auto;

  span {
    font-size: 14px;
    color: #666;
  }
}

.login-bottom-bg {
  height: 122px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  border-top: 1px solid #dbdbdc;
  font-size: 14px;
}
</style>
<style lang='scss'>
.loginSubmitBtn {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #ededed !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }

  .input-bg .el-input__inner {
    background: transparent !important;
    border: none;
    color: #333;
    font-size: 14px;
  }

  .input-bg .el-input__inner:focus::-webkit-input-placeholder {
    color: #a5a5a5;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .phoneNumberItem .el-input {
    width: 65%;
  }
}
</style>
