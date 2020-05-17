<template>
    <div>
        <el-form :rules="rules" :model="loginForm" ref="loginForm" class="login-container" label-position="left"
                 label-width="0px" v-loading="loading">
            <h3 class="login_title">系统登录</h3>
            <el-form-item prop="username">
                <el-input @keyup.enter.native="submitClick"  v-model="loginForm.username" ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input @keyup.enter.native="submitClick" type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
            <el-form-item style="width: 100%">
                <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "index",
        mounted(){
            let _this = this;
            document.onkeydown = function(e){
                if(e.key=="Enter"){
                    _this.submitClick();
                }
            }
        },
        methods:{
            submitClick(){
                let _this = this;
                _this.loading = true;
                _this.postRequest('/auth',this.loginForm).then(resp=>{
                    _this.loading = false;
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.$store.commit('SET_USER', data.user);
                        _this.$store.commit('SET_ALLOWPATH',data.allowPath);
                        _this.$router.replace({path:'/'});
                    }else{
                        _this.$message.error("登录失败");
                    }
                })
            }
        },
        data(){
            return{
                loginForm:{
                    username:'',
                    password:''
                },
                rules:{
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                checked:true,
                loading:false
            }
        }
    }
</script>

<style>
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .login_remember {
        margin: 0px 0px 35px 0px;
        text-align: left;
    }
</style>