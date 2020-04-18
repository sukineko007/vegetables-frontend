<template>
  <div>
  <el-dialog
      :title="goodChildTitle"
      :visible.sync="dialogFormAddSubjectVisible"
      :show-close="true"
      :close-on-click-modal="false"
      width="600px"
    >
    <div class="myaction">
      <div class="clearfix"></div>
    </div>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      @selection-change="handleSelectionChange"
      border
      stripe
      style="width: 100%"
      max-height="449"
      highlight-current-row
      :cell-style="styleFunc"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="goodsimage" label="蔬菜图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goodsimage" alt="蔬菜图片" style="width: 60px;height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsname" label="蔬菜名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsweight" label="蔬菜重量(克)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsprice" label="蔬菜价格(元)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodscount" label="数量" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsamount" label="蔬菜总价" align="center" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-header"
      mode="horizontal"
      @select="handleSelect"
      background-color="darkolivegreen"
      text-color="#fff"
      active-text-color="#ffd04b"
    ></el-menu>
  </el-dialog>
  </div>
</template>

<script>
import bus from "../BUS";
import ShopcarChild from "./ShopcarChild";

export default {
  data() {
    return {
      userInfo: {},
      showEnter: true,
      pageSize: 10,
      flag: true,
      userEntity: {},
      currentPage: 1,
      count: 0,
      currentLimit: 20,
      searchContent: "",
      multipleSelection: [],
      form: "",
      tableData: [],
      isSerach: false, //是否为提交搜索
      region: "0",
      isLast: false,
      loading: true,
      addressData: [],
      key: ""
    };
  },
  components: {
    ShopcarChild
  },
  methods: {
    handleSizeChange(val) {
      //更改每页的数量,重新发起请求
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      //更改当前页,重新发起请求
      this.currentPage = val;
    },
    styleFunc(row, rowIndex) {
      //更改样式
      return { padding: "5px 0", hieght: "23px", lineHeight: "23px" };
    }
  },
  mounted() {
    var userJsonStr = sessionStorage.getItem("userInfo");
    if (!userJsonStr) {
      this.$message.error("尚未登录，请先登录！");
      setTimeout(this.$router.push("/login"), 3000);
    }
    this.userInfo = JSON.parse(userJsonStr);
    if (this.userInfo.usertype != "2") {
      this.$message.error("请登录顾客账号！");
      setTimeout(this.$router.push("/login"), 3000);
    }
     bus.$on("openOrderDetail", data => {
      console.log("子组件监听" + data);
      //获取值
      this.dialogFormAddSubjectVisible = data.flag;
     this.tableData = data.shopcars;
    });
  },
  watch: {}
};
</script>

<style scoped>
a:link {
  text-decoration: none;
}
a {
  font-size: 20px;
  color: black;
}
.el-menu-header {
  left: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.myaction {
  margin-top: 15px;
}

.first {
  vertical-align: top;
}

.left {
  margin-left: 10px;
}

.left div {
  display: inline-block;
}

.left span,
.left div,
.left button {
  float: left;
  margin-left: 20px;
}

.left span {
  display: inline-block;
  height: 38px;
  line-height: 38px;
}

.right {
  float: right;
  margin-right: 25px;
}

.bottom {
  margin: 10px 20px;
  text-align: left;
  width: 100%;
}

.bottom button {
  margin-right: 10px;
}
.clearfix {
  clear: both;
}

.myelform {
  margin-bottom: 5px;
}

.block {
  margin: 10px;
}
.paixu {
  display: inline;
  margin-right: 50px;
  text-align: left;
  margin-left: 50px;
}
</style>

