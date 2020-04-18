<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
    background-color="darkolivegreen"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1">
      <i class="el-icon-upload"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-upload"></i>
      <span slot="title">商品管理</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-star-on"></i>
      <span slot="title">订单状态管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "1",
      userInfo: {}
    };
  },
  mounted() {
    if (sessionStorage.getItem("curRouter"))
      this.activeMenu = "" + sessionStorage.getItem("curRouter");
    this.$router.push(sessionStorage.getItem("curRouter") || this.activeMenu);
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeMenu = "" + key;
      sessionStorage.setItem("curRouter", this.activeMenu);
      this.$router.push(this.activeMenu);
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  }
};
</script>

<style scoped>
.el-menu-vertical {
  width: 100%;
  height: 1000px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
