<template>
  <div>
    <div class="myaction">
      <div class="first">
        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
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
      <el-table-column prop="ordernum" label="订单号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="收货地址" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalprice" label="订单总价(元)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paystate" label="订单状态" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paytime" label="支付时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="管理" align="center" v-if="showEnter">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
            <el-button size="mini" type="primary" @click="openOrderChild(scope.row)">
              <i class="el-icon-edit">操作</i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
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
    <orderChild />
  </div>
</template>

<script>
import orderChild from './OrderChild'
import bus from '../BUS'

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
      loading: true
    };
  },
  components:{
    orderChild
  },
  methods: {
    openOrderChild(param) {
      console.log(param);
      bus.$emit("openOrderChild", { flag: true, currentItem: param });
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id", id);
          this.axios
            .post("order/delete", params)
            .then(res => {
              this.$message.success("删除成功！");
              //删除成功后重新请求当前页
              this.axios
                .get("order/view")
                .then(res => {
                  this.loading = false;
                  this.tableData = [];
                  this.tableData = res.data;
                  this.count = res.data.length;
                  this.currentPage = 1;
                })
                .catch(res => {
                  this.loading = false;
                  console.log("error");
                  this.$message.error("删除失败！");
                });
            })
            .catch(res => {
              this.loading = false;
              
            });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      //更改每页的数量,重新发起请求
      this.loading = true;
      this.currentLimit = val;
      //平常页
      this.axios
        .get("order/view")
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.count = res.data.length;
          this.currentPage = 1;
        })
        .catch(res => {
          this.loading = false;
          console.log("error");
        });
    },
    handleCurrentChange(val) {
      //更改当前页,重新发起请求
      this.loading = true;
      this.currentPage = val;
      this.axios
        .get("order/view")
        .then(res => {
          this.tableData = res.data;
          this.count = res.data.length;
        })
        .catch(res => {
          console.log("error");
        });
    },
    styleFunc(row, rowIndex) {
      //更改样式
      return { padding: "5px 0", hieght: "23px", lineHeight: "23px" };
    },
    handleSelectionChange(val) {
      //处理多选框变化
      this.multipleSelection = val;
    }
  },
  mounted() {
    var userJsonStr = sessionStorage.getItem("userInfo");
    if (!userJsonStr) {
      this.$message.error("尚未登录，请先登录！");
      setTimeout(this.$router.push("/admin"), 3000);
    }
    this.userInfo = JSON.parse(userJsonStr);
    if (this.userInfo.usertype != "1") {
      this.$message.error("请登录管理员账号！");
      setTimeout(this.$router.push("/admin"), 3000);
    }
    this.axios
      .get("order/view")
      .then(res => {
        this.loading = false;
        this.tableData = res.data;
        this.count = res.data.length;
      })
      .catch(res => {
        this.loading = false;
        console.log("error");
      });
    bus.$on("afterEditOrder", data => {
      console.log("子组件监听" + data);
      this.axios
        .get("order/view")
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.count = res.data.length;
        })
        .catch(res => {
          this.loading = false;
          console.log("error");
        });
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
</style>

