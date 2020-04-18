<template>
  <div>
    <div v-if="login">
      <el-form
        :model="userData"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <h3 class="title">蔬菜商城登录</h3>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="userData.username"
            auto-complete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userData.password"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%; ">
          <div class="button1">
            <el-button type="primary" style="width:30%;" @click="Login" :loading="logining">登录</el-button>
          </div>
          <div class="button2">
            <el-button type="primary" style="width:30%;" @click="goRegister" :loading="logining">去注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="register">
      <el-form
        :model="userData"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <h3 class="title">蔬菜商城注册</h3>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="userData.username"
            auto-complete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userData.password"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
           <div class="button1">
            <el-button type="primary" style="width:30%;" @click="goLogin" :loading="logining">去登录</el-button>
          </div>
          <div class="button2">
            <el-button type="primary" style="width:30%;" @click="register" :loading="logining">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import NProgress from "nprogress";
export default {
  name: "AdminLogin",
  data() {
    return {
      state: this.$store.state,
      userData: {
        username: "",
        password: "",
        usertype: "2"
      },
      logining: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true,
      login: true,
      register: false
    };
  },
  methods: {
    Login() {
      console.log('custom login');
      if (!this.userData.username) {
        this.$message.error("用户名不能为空");
        throw new Error("用户名不能为空");
      }
      if (!this.userData.password) {
        this.$message.error("密码不能为空！");
        throw new Error("密码不能为空！");
      }
      var params = new URLSearchParams();
      params.append("username", this.userData.username);
      params.append("password", this.userData.password);
      params.append("usertype", this.userData.usertype);
      this.logining = true;
      this.axios
        .post("login/login", params)
        .then(res => {
          console.log(res.data);
          if (res.data.state == "error") {
            this.$message.error(res.data.data);
            this.logining = false;
            throw new Error(res.data.data);
          }
          if (res.data.state == "success") {
            this.$message.success("登录成功！");
            NProgress.start();
            setTimeout(() => {
              sessionStorage.clear();
              sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
              this.logining = false;
              this.$store.commit("userLogin", JSON.stringify(res.data.data));
              this.$router.push({ path: "/" });
            }, 1500);
          }
        })
        .catch(err => {
          console.error(err);
          this.$message.error("服务器错误！");
          this.logining = false;
        });
    },
    goRegister() {
      this.login = false;
      this.register = true;
    },
    goLogin() {
      this.login = true;
      this.register = false;
    },
    register() {
      if (!this.userData.username) {
        this.$message.error("用户名不能为空");
        throw new Error("用户名不能为空");
      }
      if (!this.userData.password) {
        this.$message.error("密码不能为空！");
        throw new Error("密码不能为空！");
      }
      var params = new URLSearchParams();
      params.append("username", this.userData.username);
      params.append("password", this.userData.password);
      params.append("usertype", this.userData.usertype);
      this.logining = true;
      this.axios
        .post("userInfo/add", params)
        .then(res => {
          console.log(res.data);
          if (res.data.state == "error") {
            this.$message.error(res.data.data);
            this.logining = false;
            throw new Error(res.data.data);
          }
          if (res.data.state == "success") {
            this.$message.success("注册成功！");
            NProgress.start();
            setTimeout(() => {
              this.logining = false;
              this.goLogin();
            }, 1500);
          }
        })
        .catch(err => {
          console.error(err);
          this.$message.error("服务器错误！");
          this.logining = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  .button1 {
    display: inline;
    margin-right: 10%;
  }
  .button2 {
    display: inline;
    margin-left: 10%;
  }
}
</style>
