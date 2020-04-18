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
      <el-table-colum label="商品明细" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="查看明细" placement="bottom-end">
            <el-button type="text" @click="viewDetail(scope.row.shoporders)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-colum>
      <el-table-column prop="username" label="收货人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="收货地址" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalprice" label="订单总价(元)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paystate" label="订单状态" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paytime" label="支付时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" v-if="showEnter">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="确认支付" placement="bottom-end">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" :disabled="scope.row.paystate =='已支付'">
              <i class="el-icon-check">确认</i>
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

    <ConfirmOrderDetail />
  </div>
</template>

<script>
//   import recruitAdd from './recruitAdd'
//   import recruitEdit from './recruitEdit'
import ConfirmOrderDetail from "./ConfirmOrderDetail";
import bus from "../BUS";

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
  components: {
    ConfirmOrderDetail
  },
  methods: {
    viewDetail(detail) {
      bus.$emit("openOrderDetail", { flag: true, shopcars: detail });
    },
    handleEdit(item) {
      this.$confirm("确认支付订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id", item.id);
          this.axios
            .post("order/confirm", params)
            .then(res => {
              this.$message.success("支付成功！");
              //删除成功后重新请求当前页
              var params = new URLSearchParams();
              params.append("id", this.userInfo.id);
              this.axios
                .post("order/customView", params)
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
                });
            })
            .catch(res => {
              this.loading = false;
              this.$message.error("支付失败！");
            });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      //更改每页的数量,重新发起请求
      this.loading = true;
      this.currentLimit = val;
      //平常页
      var params = new URLSearchParams();
      params.append("id", this.userInfo.id);
      this.axios
        .post("order/customView", params)
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.count = res.data.length;
          this.currentPage = 1;
          this.pageSize = val;
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
      var params = new URLSearchParams();
      params.append("id", this.userInfo.id);
      this.axios
        .post("order/customView", params)
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
      setTimeout(this.$router.push("/login"), 3000);
    }
    this.userInfo = JSON.parse(userJsonStr);
    if (this.userInfo.usertype != "2") {
      this.$message.error("请登录顾客账号！");
      setTimeout(this.$router.push("/login"), 3000);
    }
    var params = new URLSearchParams();
    params.append("id", this.userInfo.id);
    this.axios
      .post("order/customView", params)
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
        .get("order/customView")
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

