<template>
  <el-menu
    mode="horizontal"
    :default-active="activeMenu"
    class="el-menu-vertical"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
    background-color="darkolivegreen"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1" style="width: 14%">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="2" style="width: 14%">
      <i class="el-icon-s-grid"></i>
      <span slot="title">商品列表</span>
    </el-menu-item>
    <el-menu-item index="3" style="width: 14%">
      <i class="el-icon-shopping-cart-full"></i>
      <span slot="title">购物车</span>
    </el-menu-item>
    <el-menu-item index="4" style="width: 14%">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">确认订单</span>
    </el-menu-item>
    <el-menu-item index="5" style="width: 14%">
      <i class="el-icon-s-order"></i>
      <span slot="title">我的订单</span>
    </el-menu-item>
    <el-menu-item index="6" style="width: 14%">
      <i class="el-icon-s-custom"></i>
      <span slot="title">个人中心</span>
    </el-menu-item>
    <el-menu-item index="7" style="width: 14%">
      <i class="el-icon-place"></i>
      <span slot="title">收货地址</span>
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
  height: 10%;
  overflow-x: auto;
  overflow-y: hidden;
}
el-menu-item {
    width: 20%;
}
</style>
