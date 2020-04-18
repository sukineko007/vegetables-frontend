<template>
  <div>
    <div class="myaction">
      <div class="first">
        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
      <div class="bottom" v-if="showEnter">
        <div class="left">
          <el-button icon="el-icon-plus" type="primary" @click="addGoods">添加蔬菜</el-button>
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
      style="width: 100%"
      max-height="449"
      highlight-current-row
      :cell-style="styleFunc"
    >
      <el-table-column
        prop="goodscode"
        label="蔬菜编号"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="goodsimage" label="蔬菜图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goodsimage" alt="蔬菜图片" style="width: 60px;height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsname" label="蔬菜名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsweight" label="蔬菜重量(克)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsprice" label="蔬菜价格(元)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsinfo" label="蔬菜简介" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsstate" label="蔬菜状态" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="管理" align="center" v-if="showEnter">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑" placement="bottom-end">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">
              <i class="el-icon-edit"></i>
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
    <goodChild />
  </div>
</template>

<script>
import bus from "../BUS";
import goodChild from "./GoodChild";

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
    goodChild
  },
  methods: {
    handleEdit(param) {
      console.log(param);
      bus.$emit("openGoodChild", {
        flag: true,
        currentItem: param,
        formTitle: "编辑蔬菜信息",
        IsAdd: false
      });
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          var params = new URLSearchParams();
          params.append("id", id);
          this.axios
            .post("goods/delete", params)
            .then(res => {
              this.$message.success("删除成功！");
              //删除成功后重新请求当前页
              this.axios
                .get("goods/view")
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
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {});
    },
    addGoods() {
      console.log("新增蔬菜");
      bus.$emit("openGoodChild", {
        flag: true,
        formTitle: "新增蔬菜信息",
        IsAdd: true
      });
    },
    handleSizeChange(val) {
      //更改每页的数量,重新发起请求
      this.loading = true;
      this.currentLimit = val;
      //平常页
      this.axios
        .get("goods/view")
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
        .get("goods/view")
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
      .get("goods/view")
      .then(res => {
        this.tableData = res.data;
        this.count = res.data.length;
        this.currentPage = 1;
      })
      .catch(err => {
        console.error(err);
      });
    bus.$on("afterAddGood", data => {
      console.log("子组件监听" + data);
      if (data.IsAdd == true) {
        this.axios
          .get("goods/view")
          .then(res => {
            this.tableData = res.data;
            this.count = res.data.length;
            this.currentPage = Math.ceil(this.count / this.pageSize);
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.axios
          .get("goods/view")
          .then(res => {
            this.tableData = res.data;
            this.count = res.data.length;
          })
          .catch(err => {
            console.error(err);
          });
      }
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

