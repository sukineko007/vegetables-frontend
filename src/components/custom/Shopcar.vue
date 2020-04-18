<template>
  <div style="margin: 0; width: 100%">
    <div class="myaction">
      <div class="first">
        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
      <div class="bottom">
        <div class="paixu">
          <el-button icon="el-icon-delete" type="danger" @click="clearShopcar">清空购物车</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
    </div>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      @selection-change="handleSelectionChange"
      border
      stripe
      style="width: 100%; margin: 0"
      max-height="600"
      highlight-current-row
      :cell-style="styleFunc"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" align="center" :reserve-selection="true"></el-table-column>
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
      <el-table-column label="操作" align="center" v-if="showEnter">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="数量-1" placement="bottom-end">
            <el-button size="mini" type="primary" @click="handleCut(scope.row)">
              <i class="el-icon-minus"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="数量+1" placement="bottom-end">
            <el-button size="mini" type="primary" @click="handleAdd(scope.row)">
              <i class="el-icon-plus"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="bottom-end">
            <el-button size="mini" type="danger" @click="handleDel(scope.row.id)">
              <i class="el-icon-delete"></i>
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
    <div class="bottom">
      <div class="paixu">
        <el-select v-model="key" placeholder="请选择地址...">
          <el-option
            v-for="item in addressData"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button icon="el-icon-check" type="primary" @click="confirm">结算</el-button>
      </div>
      <div class="chooseData">
        <ul>
          <li v-for="item in chooseData" :key="item.id">
            <p>{{item.goodsname}} 数量：{{item.goodscount}}份 金额：{{item.goodsamount}}元</p>
          </li>
        </ul>
        <h4>合计价格：{{totalPrice}}</h4>
      </div>
      <div class="clearfix"></div>
    </div>
    <ShopcarChild />
  </div>
</template>

<script>
import bus from "../BUS";
import ShopcarChild from "./ShopcarChild";

export default {
  data() {
    return {
      chooseData: [],
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
      key: "",
      totalPrice: 0
    };
  },
  components: {
    ShopcarChild
  },
  methods: {
    getRowKeys(row) {
      return row.id;
    },
    handleSizeChange(val) {
      //更改每页的数量,重新发起请求
      this.loading = true;
      this.pageSize = val;
      //平常页
      var param = new URLSearchParams();
      param.append("id", this.userInfo.id);
      this.axios
        .post("shopcar/view", param)
        .then(res => {
          this.tableData = res.data;
          this.count = res.data.length;
          this.currentPage = 1;
          this.pageSize = val;
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleCurrentChange(val) {
      //更改当前页,重新发起请求
      var param = new URLSearchParams();
      param.append("id", this.userInfo.id);
      this.axios
        .post("shopcar/view", param)
        .then(res => {
          this.tableData = res.data;
          this.count = res.data.length;
          this.currentPage = val;
        })
        .catch(err => {
          console.error(err);
        });
    },
    styleFunc(row, rowIndex) {
      //更改样式
      return { padding: "5px 0", hieght: "23px", lineHeight: "23px" };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.chooseData = this.multipleSelection;
      var items = this.chooseData;
      this.totalPrice = 0;
      console.log(items);
      var count = this.chooseData.length;
      for (var i = 0; i < count; i++) {
        this.totalPrice = this.totalPrice + items[i].goodsamount;
      }
    },
    confirm() {
      console.log(this.multipleSelection);
      if (this.key == "") {
        this.$message.error("请先选择地址");
        throw new Error();
      }
      var items = this.multipleSelection;
      if (items.length == 0) {
        this.$message.error("未选择任何商品");
        throw new Error();
      }
      var shopcars = [];
      for (var i = 0; i < items.length; i++) {
        shopcars.push(items[i].id);
      }
      var params = new URLSearchParams();
      params.append("userId", this.userInfo.id);
      params.append("addressId", this.key);
      params.append("shopcars", shopcars);
      this.axios
        .post("/order/add", params)
        .then(res => {
          this.$message.success(
            "结算成功！订单号：" +
              res.data.ordernum +
              " /n 请到确认订单界面查看！"
          );
          var params = new URLSearchParams();
          params.append("id", this.userInfo.id);
          this.axios
            .post("/address/view2", params)
            .then(res => {
              this.addressData = res.data;
            })
            .catch(err => {
              console.error(err);
              this.$message.error("获取地址列表失败！请检查服务器");
            });
        })
        .catch(err => {
          console.error(err);
        });
    },
    clearShopcar() {
      this.$confirm("确定要清空购物车吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var ids = [];
          tableData.forEach(item => {
            ids.push(item.id);
          });
          var params = new URLSearchParams();
          params.append("ids", ids);
          this.axios
            .post("/shopcar/batchDel", params)
            .then(res => {
              this.$message.success("清空成功！");
            })
            .catch(err => {
              this.$message.error("清空失败！");
            });
        })
        .catch(() => {});
    },
    handleAdd(item) {
      item.goodscount = item.goodscount + 1;
      item.goodsamount = item.goodsprice * item.goodscount;
      console.log(item);
    },
    handleCut(item) {
      item.goodscount = item.goodscount - 1;
      item.goodsamount = item.goodsprice * item.goodscount;
      console.log(item);
    },
    handleDel(id) {
      this.$confirm("确定要清空购物车吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var ids = [];
          ids.push(id);
          var params = new URLSearchParams();
          params.append("ids", ids);
          this.axios
            .post("/shopcar/batchDel", params)
            .then(res => {
              this.$message.success("删除成功！");
            })
            .catch(err => {
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {});
    },
    queding() {
      this.chooseData = this.multipleSelection;
      this.totalPrice = 0;
      for (var item in chooseData) {
        this.totalPrice = this.totalPrice + item.goodsamount;
      }
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
      .post("/address/view2", params)
      .then(res => {
        this.addressData = res.data;
      })
      .catch(err => {
        console.error(err);
        this.$message.error("获取地址列表失败！请检查服务器");
      });
    var param = new URLSearchParams();
    param.append("id", this.userInfo.id);
    this.axios
      .post("shopcar/view", param)
      .then(res => {
        this.tableData = res.data;
        this.count = res.data.length;
        this.currentPage = 1;
      })
      .catch(err => {
        console.error(err);
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
  width: 50%;
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

