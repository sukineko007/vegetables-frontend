import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {  //用户信息
      id: '',
      username: '',
      password: '',
      usertype: '',
      sex: '',
      age: '',
      mobilephone: '',
      image: '',
      registerdate: ''
    },
    goodsInfo: {
      id: '',
      goodscode: '',
      goodsname: '',
      goodsweight: '',
      goodsprice: '',
      goodsinfo: '',
      goodsstate: '',
    },
    dialogFormAddGood: false, //添加商品弹窗是否显示
    goodChildTitle: '',  //添加或编辑商品标题
    goodChildIsAdd: true, //商品 添加？
    goodCurrentPage: 1,
    count: 10
  },
  mutations: {
    userLogin(state, userInfo) {
      console.log('用户:' + userInfo);
      state.userInfo = JSON.parse(userInfo);
    },
    addGoodsInfo(state,item) {
      state.goodsInfo = item;
    },
    reGoodPage(state) {
      state.goodCurrentPage = 1;
    },
    openGoodsChild(state, title, isAdd, page) {
      console.log('打开弹窗');
      state.dialogFormAddGood = true;
      state.goodChildTitle = title;
      state.goodChildIsAdd = isAdd;
      state.goodCurrentPage = page;
    },
    closeGoodsChild(state) {
      state.dialogFormAddGood = false;
    }
  },
  actions: {
  },
  modules: {
  }
})
