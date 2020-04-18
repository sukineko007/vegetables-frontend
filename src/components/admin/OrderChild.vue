<template>
  <div id="mainCon">
    <el-dialog
      :title="管理订单状态"
      :visible.sync="dialogFormAddSubjectVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        class="el-form"
        label-position="right"
      >
        <el-form-item class="el-form-item" label="用户名:" prop="username">
          <el-input class="el-input" v-model="form.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="收货地址:" prop="address">
          <el-input class="el-input" v-model="form.address" disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="订单总价:" prop="totalprice">
          <el-input
            class="el-input"
            v-model="form.totalprice"
            type="number"
            step="0.01"
            disabled="true"
          >
            <span slot="prefix">￥</span>
            <span slot="suffix">元</span>
          </el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="订单状态:" prop="paystate">
          <el-select v-model="form.paystate" placeholder="请选择订单状态">
            <el-option label="待支付" value="待支付"></el-option>
            <el-option label="已支付" value="已支付"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
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
        username: "",
        address: "",
        totalprice: 0,
        paystate: ""
      },
      dialogFormAddSubjectVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        totalprice: [
          { required: true, message: "请输入总价", trigger: "blur" }
        ],
        paystate: [
          { required: true, message: "请选择订单状态", trigger: "blur" }
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
        target: "#container",
        text: "保存中..."
      });
      var params = new URLSearchParams();
      const form = this.form;
      if (
        form.username == "" ||
        "" == form.address ||
        "" == form.totalprice ||
        "" == form.paystate
      ) {
        this.$message.error("请填写所有必填项");
        return false;
      }
      params.append("paystate", form.paystate);
      params.append("id", form.id);
      this.axios
        .post("order/save", params)
        .then(res => {
          loadingInstance.close();
          this.$message.success("保存成功！");
          this.dialogFormAddSubjectVisible = false;
          bus.$emit("afterEditOrder", {
            IsAdd: false
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
    //在组件的钩子函数中监听事件
    bus.$on("openOrderChild", data => {
      console.log("子组件监听" + data);
      //获取值
      this.dialogFormAddSubjectVisible = data.flag;
      this.form = data.currentItem;
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

