<template>
  <div id="mainCon">
    <el-dialog
      :title="goodChildTitle"
      :visible.sync="dialogFormAddSubjectVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="el-form"
        label-position="right"
      >
        <el-form-item class="el-form-item" label="省（自治区、直辖市）:" prop="province">
          <el-input class="el-input" v-model="form.province"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="市:" prop="city">
          <el-input class="el-input" v-model="form.city"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="区（县）:" prop="county">
          <el-input class="el-input" v-model="form.county"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="详细地址:" prop="specific">
          <el-input class="el-input" type="textarea" v-model="form.detail"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="收货人:" prop="consignee">
          <el-input class="el-input" v-model="form.consignee"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="联系电话:" prop="telphone">
          <el-input class="el-input" v-model="form.telphone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleAddClose">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../BUS";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      form: {
        id: "",
        userid: "",
        province: "",
        city: "",
        county: "",
        detail: "",
        consignee: "",
        telphone: ""
      },
      goodChildTitle: "",
      dialogFormAddSubjectVisible: false,
      IsAdd: false,
      rules: {
        province: [{ required: true, message: "请输入省", trigger: "blur" }],
        city: [{ required: true, message: "请输入市", trigger: "blur" }],
        county: [{ required: true, message: "请输入区", trigger: "blur" }],
        specific: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        consignee: [
          { required: true, message: "请输入收货人", trigger: "blur" }
        ],
        telphone: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "this.form": function(newValue) {
      console.log(newValue);
    }
  },
  methods: {
    handleAddClose() {
      //点击保存按钮后把添加的内容发送给服务器
      var loadingInstance = Loading.service({
        //读取文件时显示加载条
        target: "#mainCon",
        text: "保存中..."
      });
      var params = new URLSearchParams();
      var form = this.form;
      if (
        form.province == "" ||
        "" == form.city ||
        "" == form.county ||
        "" == form.detail ||
        "" == form.consignee ||
        "" == form.telphone
      ) {
        this.$message.error("请填写所有必填项");
        return false;
      }
      if (!this.IsAdd) {
        params.append("id", this.form.id);
      }
      params.append("province", this.form.province);
      params.append("city", this.form.city);
      params.append("county", this.form.county);
      params.append("detail", this.form.specific);
      params.append("consignee", this.form.consignee);
      params.append("telphone", this.form.telphone + "");
      params.append("userid", this.userInfo.id);
      this.axios
        .post("address/add", params)
        .then(res => {
          loadingInstance.close();
          this.$message.success("保存成功！");
          this.dialogFormAddSubjectVisible = false;
          bus.$emit("afterAddAddress", {
            IsAdd: this.IsAdd
          });
        })
        .catch(res => {
          loadingInstance.close();
          this.$message.error("保存失败！");
        });
    },
    handleClose() {
      this.dialogFormAddSubjectVisible = false;
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

    //在组件的钩子函数中监听事件
    bus.$on("openAddressChild", data => {
      console.log("子组件监听" + data);
      //获取值
      this.dialogFormAddSubjectVisible = data.flag;
      this.IsAdd = data.IsAdd;
      this.goodChildTitle = data.formTitle;
      if (data.IsAdd != true) {
        this.form = data.currentItem;
      } else {
        this.from = {
          id: "",
          userid: "",
          province: "",
          city: "",
          county: "",
          specific: "",
          consignee: "",
          telphone: ""
        };
      }
    });
  }
};
</script>

<style>
.el-input {
  width: 400px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>

