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
        label-width="120px"
        class="el-form"
        label-position="right"
      >
        <el-form-item class="el-form-item" label="收货人:" prop="goodsname">
          <el-input class="el-input" v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="蔬菜重量:" prop="goodsweight">
          <el-input class="el-input" v-model="form.goodsweight" type="number" step="0.01">
            <span slot="suffix">克(g)</span>
          </el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="蔬菜价格:" prop="goodsprice">
          <el-input class="el-input" v-model="form.goodsprice" type="number" step="0.01">
            <span slot="prefix">￥</span>
            <span slot="suffix">元</span>
          </el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="蔬菜描述:" prop="goodsinfo">
          <el-input class="el-input" type="textarea" v-model="form.goodsinfo"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="上架状态:" prop="goodsstate">
          <el-select v-model="form.goodsstate" placeholder="请选择商品状态">
            <el-option label="上架" value="上架"></el-option>
            <el-option label="已下架" value="已下架"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="蔬菜图片:" prop="goodsimage" v-if="IsAdd">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            accept=".jpg, .jpeg, JPG, .JPEG, .png"
          >
            <img v-if="showImage" :src="goodsimage" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        goodscode: "",
        goodsname: "",
        goodsweight: "",
        goodsprice: "",
        goodsinfo: "",
        goodsstate: "上架"
      },
      showImage: false,
      goodsimage: "",
      goodChildTitle: "",
      dialogFormAddSubjectVisible: false,
      IsAdd: false,
      rules: {
        goodsname: [
          { required: true, message: "请输入蔬菜名称", trigger: "blur" }
        ],
        goodsweight: [
          { required: true, message: "请输入蔬菜重量", trigger: "blur" }
        ],
        goodsprice: [
          { required: true, message: "请输入蔬菜价格", trigger: "blur" }
        ],
        goodsinfo: [
          { required: true, message: "请输入蔬菜描述", trigger: "blur" }
        ],
        goodsstate: [
          { required: true, message: "请选择上架状态", trigger: "blur" }
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
      const form = this.form;
      if (form.id == "") {
        this.$message.error("请上传图片！");
        return false;
      }
      if (
        form.goodsname == "" ||
        "" == form.goodsweight ||
        "" == form.goodsprice ||
        "" == form.goodsinfo ||
        "" == form.goodsstate
      ) {
        this.$message.error("请填写所有必填项");
        return false;
      }
      params.append("id", this.form.id);
      params.append("goodscode", this.form.goodscode);
      params.append("stuName", this.form.stuName);
      params.append("goodsname", this.form.goodsname);
      params.append("goodsweight", this.form.goodsweight);
      params.append("goodsprice", this.form.goodsprice);
      params.append("goodsinfo", this.form.goodsinfo);
      params.append("goodsstate", this.form.goodsstate);
      this.axios
        .post("goods/add", params)
        .then(res => {
          loadingInstance.close();
          this.$message.success("保存成功！");
          this.dialogFormAddSubjectVisible = false;
          bus.$emit("afterAddGood", {
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
    },
    beforeUpload(file) {
      console.log("图片上传....");
    },
    uploadFile(param) {
      console.log("自定义上传");
      console.log(param.file);
      var loadingInstance = Loading.service({
        //读取文件时显示加载条
        target: "#container",
        text: "图片上传中..."
      });
      var params = new FormData();
      params.append("name", param.file.name);
      params.append("file", param.file);
      var config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      this.axios
        .post("image/upload", params, config)
        .then(res => {
          console.log(res.data);
          this.showImage = true;
          this.goodsimage = res.data.imagepath;
          this.form.id = res.data.goodsid;
          loadingInstance.close();
        })
        .catch(err => {
          console.error(err);
          this.$message.error("上传失败");
          loadingInstance.close();
        });
    }
  },
  mounted() {
    //在组件的钩子函数中监听事件
    bus.$on("openGoodChild", data => {
      console.log("子组件监听" + data);
      //获取值
      this.dialogFormAddSubjectVisible = data.flag;
      this.IsAdd = data.IsAdd;
      this.goodChildTitle = data.formTitle;
      if (data.IsAdd != true) {
        this.form = data.currentItem;
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

