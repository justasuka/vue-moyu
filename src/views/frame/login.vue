<template>
    <div class="login">
        <img class="logo" :src="logoSrc" alt="">
        <div class="center">
            <div class="box">
                <header class="title" >
                    <p>
                        <i style="color: #748BFF;font-weight: bold;">欢迎登录</i>
                        <span>武汉大学融媒体中心照片大数据平台</span></p>
                </header>
                <div style="width: 400px;margin: auto;">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" @keyup.enter.native="login">
                        <el-form-item prop="username">
                            <el-input placeholder="用户名" v-model="ruleForm.username">
                                <i slot="prefix" class="iconfont icon-zhanghao" style="font-size: 20px;color: #748BFF;"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="pwd">
                            <el-input :type="pwdType" placeholder="密码" v-model="ruleForm.pwd">
                                <i slot="prefix" class="iconfont icon-denglu-mima" style="font-size: 20px;color: #748BFF;"></i>
                                <i slot="suffix" :class="pwdType==='text'? 'iconfont icon-zhengyan':'iconfont icon-biyan'" @click="pwdType = pwdType==='password'?'text':'password'"></i>
                            </el-input>
                        </el-form-item>
                        <div class="login-btn-group">
                            <el-button style="width:100%;font-size: 22px;" type="common" @click="login">登&nbsp;录</el-button>
                        </div>
                        <div style="height: 40px;margin-top: 10px;text-align: center">
                            <el-tooltip class="item" effect="dark" content="为了提高体验度，推荐使用谷歌浏览器，点击即可下载" placement="bottom">
                                <a @click="downLoad"><img src="../../assets/google.png" alt="谷歌浏览器下载" style="width: 50px;height: 50px;"></a>
                            </el-tooltip>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    import md5 from 'md5';
    let obj;
    export default {
        name: 'login',
        data () {
            return {
                config:config,
                url:'/upload/exe/Google.exe',
                logoSrc: require('../../assets/logo.png'),
                activeName: 'first',
                ruleForm:{
                    username:'',
                    pwd:'',
                },
                pwdType: 'password',
                rules:{
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            login() {
                this.$refs['ruleForm'].validate((valid) => {
                    if(!valid){
                        this.$message.error('请填写符合规范的用户名和密码');
                        return;
                    }
                    axios({
                        url:`${home}/login/login`,
                        method:'POST',
                        data:{
                            username:this.ruleForm.username,
                            password:md5(this.ruleForm.pwd),
//                            token:config.isDev?obj.getToken():''
                        },
                        diy:true
                    }).then(res=>{
                        if(!res.result.success){
                            // obj.reset();
                            this.ruleForm.tel='';
                            this.ruleForm.pwd='';
                            this.$message.error(res.result.msg);
                            return;
                        }
                        this.$store.commit('setToken',res.data);
                        this.$store.commit('setPerms',res.data2);
                        // this.$router.push('/index');
                        this.$router.push('/imgIndex')
                    })
                });
            },
            downLoad(){
                window.open(config.resPre+this.url);
            },
        },
        created(){
        },
        mounted(){
        }
    }
</script>
<style lang="scss">
    /*vaptach验证码*/
    .vaptcha-init-main {
        display: table;
        width: 100%;
        height: 100%;
        background-color: #eeeeee;
    }

    .vaptcha-init-loading {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }

    .vaptcha-init-loading>a {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: none;
    }

    .vaptcha-init-loading>a img {
        vertical-align: middle;
    }

    .vaptcha-init-loading .vaptcha-text {
        font-family: sans-serif;
        font-size: 12px;
        color: #cccccc;
        vertical-align: middle;
    }

    .vp-tip {
        line-height: 56px !important;
    }

    .vp-dark-btn.vp-basic-btn {
        max-height: 56px !important;
    }

    .vp-dark-btn.vp-basic-btn .vp-shield {
        width: 70px !important;
        background-color: rgba(0, 0, 0, 0.1) !important;
    }

    .vp-dark-btn.vp-success-btn.success-ing .vp-shield .vp-shade {
        display: none;
    }

    .vp-dark-btn.vp-basic-btn .vp-factor-chart {
        margin-left: 23px !important;
    }

    .vp-dark-btn.vp-success-btn .vp-shield .vp-chart-ring i {
        left: 28px !important;
    }

    .vp-dark-btn.vp-check-btn,
    .vp-dark-btn.vp-fail-btn,
    .vp-dark-btn.vp-low-btn,
    .vp-dark-btn.vp-tip-btn,
    .vp-dark-btn.vp-success-btn,
    .vp-light-btn.vp-default-btn .vp-shield,
    .vp-light-btn.vp-default-btn .vp-about {
        background-color: #00D59F !important;
        border-radius: 30px !important;
    }

    .vp-dark-btn.vp-basic-btn .vp-tip {
        font-size: 16px !important;
        text-indent: 66px !important;
    }

    .vp-dark-btn.vp-tip-btn .vp-tip{
        text-indent: 26px !important;
    }

    .vp-dark-btn.vp-success-btn .vp-tip{
        text-indent: 20px !important;
    }

    .vp-dark-btn.success-ing .vp-tip{
        text-indent: 98px !important;
    }


    .vp-dark-btn.fail-ing .vp-tip{
        text-indent: 92px !important;
    }

    .vp-about {
        display: none !important;
    }

    .vaptcha-init-main {
        border-radius: 30px !important;
    }

    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    }

    .vp-dark-btn.vp-success-btn .vp-btn-bg{
        background: #748BFF !important;
    }

    .login .el-form-item__error {
        text-indent: 60px !important;
    }
    .login{
        .el-form-item[data-v-f85286c6] .el-form-item__content .el-input:after{
            border: none;
        }
        .box{
            .el-input{
                border-bottom:1px solid #748BFF;
            }
        }
    }
</style>
<style scoped lang="scss">
    .login {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: url(../../assets/frame/images/bg.png) no-repeat;
        background-size: 100% 100%;
        .index-fix {
            height:50px;
            padding: 0 15px;
            line-height: 50px;
            cursor: pointer;
            position: absolute;
            top:10px;
            right: 10px;
        }
        .center {
            position: absolute;
            top: 50%;
            right: 10%;
            width: 500px;
            border-radius: 5px;
            z-index: 2;
            transform: translate(0, -50%);

            /deep/ .el-button--common {
                height: 56px;
                border-color: #748BFF;
                /*border-radius: 30px;*/
                color: #fff;
                font-size: 18px;
                background: #748BFF;
                transition: all .3s;

                &:hover {
                    background: #8FB9FF;
                }
            }
        }
    }

    .logo {
        display: inline-block;
        margin: 35px 0 0 0;
        height: 60px;
    }

    .login-btn-group {
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
    }

    .el-input {
        width: 100%;
    }
    .box {
        box-sizing: border-box;
        width: 100%;
        .iconfont {
            display: block;
            width: 22px;
            height: 100%;
            font-size: 24px;
            margin-left: 18px;
            color: #A6A6A6;
        }
        .icon-zhengyan,
        .icon-biyan {
            margin-right: 24px;
            font-size: 16px;
        }

        .icon-biyan {
            transform: scale(0.94);
            font-size: 12px;
        }
    }

    .box-active-class {
        animation: box-in 1.2s;
    }

    @keyframes box-in {
        0% {
            transform: translateX(150px);
        }

        100% {
            transform: translateX(0);
        }
    }

    .title {
        p {
            padding: 0;
            margin: 0;
            letter-spacing: 2.4px;
            color: #666;
            font-size: 26px;
            /*font-weight: bold;*/
        }

        i {
            color: #808181;
            font-size: 34px;
            font-style: normal;
        }
    }

    .el-form {
        margin-top: 56px;
    }

    .el-form-item {
        margin-top: 30px;

        /deep/ .el-input__inner {
            border: none;
            border-radius: 0;
        }

        /deep/ .vp-dark-btn.vp-default-btn {
            //background: linear-gradient(to right, #24c660, #05a278);
            background: #748BFF;
            border-radius: 30px;
        }

        /deep/ .el-form-item__content {
            line-height: 50px;

            .el-input__inner {
                position: relative;
                padding-left: 60px;
                height: 56px;
                line-height: 56px;
            }

            .el-input {
                &:after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    border-bottom: 1px solid #E0E0E0;
                    opacity: 0.5;
                }
            }
        }
    }

    #vaptcha_container {
        margin-top: 30px;
    }

    .page-bottom {
        position: absolute;
        margin: 0;
        padding: 0;
        right: 12%;
        bottom: 20px;
        font-size: 12px;
        text-align: center;
        color: #999;
    }
</style>

