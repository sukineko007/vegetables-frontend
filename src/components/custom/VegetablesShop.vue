<template>
  <div>
    <div class="guolvqu">
      <div class="paixu">
        <el-button icon="el-icon-top" type="info" @click="SortByPriceAsc">按价格排序</el-button>
        <el-button icon="el-icon-bottom" type="info" @click="SortByPriceDesc">按价格排序</el-button>
      </div>
      <div class="guolvjiage">
        <h5>输入价格按价格过滤：</h5>
        <el-input placeholder="起始价格" type="number" v-model="startPrice"></el-input><h5>——</h5>
        <el-input placeholder="终止价格" type="number" v-model="endPrice"></el-input>
        <el-button type="info" @click="Shaixuan">筛选</el-button>
      </div>
    </div>
    <el-row>
        <el-col :span="3" :xs="12" v-for="item in tableData" :key="item.id">
          <div class="goodBox">
          <div class="goodsimage">
            <img  v-bind:src="item.goodsimage" :alt="item.goodsname" />
          </div>
            <div class="good">
              <div class="goodPart">
                <h3>
                  <p class="p1">名称：</p>
                  {{item.goodsname}}
                </h3>
                <h3>
                  <p class="p1">重量：</p>
                  {{item.goodsweight}} 克(g)
                </h3>
                <h3>
                  <p class="p1">价格：</p>
                  ￥{{item.goodsprice}} 元(g)
                </h3>
                <p class="p2">描述：{{item.goodsinfo}}</p>
              </div>
              <el-button
                size="small"
                icon="el-icon-shopping-cart-2"
                type="text"
                round="true"
                @click="addCar(item)"
              >加入购物车</el-button>
            </div>
          </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
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
      loading: true,
      key: "",
      startPrice: '',
      endPrice: '',
      isLogin: false
    };
  },
  components: {},
  methods: {
    addCar(item) {
      if(!this.isLogin){
        this.$message.warning('尚未登录！请点击右上角登录');
        throw new Error('未登录');
      }
      var params = new URLSearchParams();
      params.append("goodsid",item.id);
      params.append("userid", this.userInfo.id);
      params.append("goodscount",1);
      params.append("goodsamount", item.goodsprice);
      this.axios.post("/shopcar/add",params)
      .then(res => {
        this.$message.success('已加入');
      })
      .catch(err => {
        this.$message.error('加入失败');
        console.error(err); 
      })
    },
    Shaixuan() {
      if(this.startPrice == '' || this.endPrice == '') {
        this.$message.error('请输入起始、终止价格');
        throw new Error();
      }
      if(this.startPrice > this.endPrice) {
        this.$message.error('终止价格必须大于起始价格');
        throw new Error();
      }
      var params = new URLSearchParams();
      params.append("price1", this.startPrice);
      params.append("price2", this.endPrice);
      this.axios.post("/goods/shaixuan",params)
      .then(res => {
       this.tableData = res.data;
        this.count = res.data.length;
        this.currentPage = 1;
      })
      .catch(err => {
        console.error(err); 
      })
    },
    SortByPriceAsc() {
      this.axios.get("/goods/sortAsc")
      .then(res => {
        this.tableData = res.data;
        this.count = res.data.length;
        this.currentPage = 1;
      })
      .catch(err => {
        console.error(err); 
      })
    },
    SortByPriceDesc() {
      this.axios.get("/goods/sortDesc")
      .then(res => {
        this.tableData = res.data;
        this.count = res.data.length;
        this.currentPage = 1;
      })
      .catch(err => {
        console.error(err); 
      })
    }
  },
  mounted() {
    var userJsonStr = sessionStorage.getItem("userInfo");
    this.userInfo = JSON.parse(userJsonStr);
    if(this.userInfo && this.userInfo.id && this.userInfo.id != '') {
      this.isLogin = true;
    }
    this.axios
      .get("goods/views")
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
.el-row {
  margin-bottom: 20px;
}
:last-child {
  margin-bottom: 0;
}
.goodBox {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 25px;
   border: 1px solid burlywood;
   padding: 1px;
   border-radius: 5px;
}
img {
  width: 100%;
  height: 100%;
}
.goodsimage {
  text-align: center;
  width: 100%;
  height: 200px;
}

.goodPart {
  text-align: left;
}
h3 {
  margin: 0 0;
  font-family: "宋体";
  font-size: 16px;
  font-weight: 100;
}
.p1 {
  display: inline;
  margin: 0;
  text-align: left;
  font-family: "宋体";
  font-size: 12px;
  font-weight: 100;
}
.p2 {
  display: block;
  width: 100%;
  margin: 0;
  text-align: left;
  font-family: "宋体";
  font-size: 12px;
  font-weight: 100;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.guolvqu {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 15px;
  width: 100%;
}
.paixu {
  display: inline;
  margin-right: 50px;
  text-align: left;
    margin-left: 50px;
}
.guolvjiage {
  display: inline;
  text-align: left;
}
.el-input {
  width: 100px;
  margin-left: 10px;
  margin-right: 10px;
}
h5 {
  display: inline;
}
</style>

