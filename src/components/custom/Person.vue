<template>
  <div id="mainCon">
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
        <el-form-item class="el-form-item" label="密码:" prop="password">
          <el-input class="el-input" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="性别:" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="保密" value="保密"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="年龄:" prop="age">
          <el-input class="el-input" v-model="form.age" type="number" step="1">
          </el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="手机号:" prop="tel">
          <el-input class="el-input" v-model="form.mobilephone"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="头像:" prop="img">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            accept=".jpg, .jpeg, JPG, .JPEG, .png"
          >
            <img v-if="showImage" :src="form.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddClose">保 存</el-button>
      </div>
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
        password: "",
        usertype: "",
        sex: "",
        age: "",
        mobilephone: "",
        image: ''
      },
      showImage: false,
      goodsimage: "",
      goodChildTitle: "",
      dialogFormAddSubjectVisible: true,
      IsAdd: false,
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "请输入性别", trigger: "blur" }
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
      params.append("id", this.form.id);
      params.append("username", this.form.username);
      params.append("password", this.form.password);
      params.append("age", this.form.age);
      params.append("sex", this.form.sex);
      params.append("usertype", this.form.usertype);
      params.append("mobilephone", this.form.mobilephone);
      params.append("image", this.form.image);
      this.axios
        .post("userInfo/add", params)
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
        .post("image/upload2", params, config)
        .then(res => {
          console.log(res.data);
          this.showImage = true;
          this.form.image = res.data.imagepath;
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
      var userJsonStr = sessionStorage.getItem("userInfo");
    if (!userJsonStr) {
      this.$message.error("尚未登录，请先登录！");
      setTimeout(this.$router.push("/login"), 3000);
    }
    this.form = JSON.parse(userJsonStr);
    if (this.form.usertype != "2") {
      this.$message.error("请登录顾客账号！");
      setTimeout(this.$router.push("/login"), 3000);
    }
    if(this.form.image != ''){
      this.showImage = true;
    }
  }
};
</script>

<style>
#mainCon {
  width: 580px;
  margin: 0 auto;
  text-align: center;
  border: cadetblue 1px solid;
  margin-top: 20px;
}
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
.el-form {
  margin-top: 15px;
}
.dialog_footer {
  margin-bottom: 15px;
}
</style>

