<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-header"
    mode="horizontal"
    @select="handleSelect"
    background-color="darkolivegreen"
    text-color="#fff"
    active-text-color="#99ffcc"
  >
    <div id="title">欢迎光临蔬菜商城</div>
    <div class="div2" v-if="isLogin">
      <h4>欢迎您，{{userInfo.username}}
      <el-button type="text" @click="tuichu">退出</el-button>
      </h4>
    </div>
    <div class="div2" v-if="!isLogin">
      <el-button type="text" @click="goLogin">去登陆</el-button>
    </div>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      activeIndex: "1",
      activeIndex2: "1",
      username: '',
      isLogin: false
    };
  },
  methods: {
    tuichu() {
      sessionStorage.clear();
      window.location = "/login";
    },
    goLogin() {
      window.location = "/login";
    }
  },
  mounted() {
    var userJsonStr = sessionStorage.getItem("userInfo");
    this.userInfo = JSON.parse(userJsonStr);
    if(this.userInfo && this.userInfo.id && this.userInfo.id != '') {
      this.isLogin = true;
    }
  }
};
</script>

<style scoped>
.div2 {
  float: right;
  margin-right: 30px;
  margin-top: 5px;
}
a:link {
  text-decoration: none;
}
a {
  font-size: 20px;
  color: black;
}
.el-menu-header {
  width: 100%;
  height: 4%;
  float: right;
}

img {
  height: 40px;
  width: 40px;
  border-radius: 50px;
}
#title {
  height: 40px;
  line-height: 60px;
  font-size: 28px;
  float: left;
  color: aqua;
  margin-left: 30px;
}
#title2 {
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  float: left;
  color: aqua;
  margin-left: 30px;
}

#notice {
  float: right;
  margin-right: 60px;
  margin-top: 10px;
}
</style>

