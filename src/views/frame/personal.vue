<template>
    <div>
        <el-tabs  type="card" v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="100px">
                    <input type="hidden" :value="upsertForm.id">
                    <el-form-item label="头像" prop="portrait">
                        <el-upload
                                class="el-uploader"
                                :headers="{token:$store.getters.getToken}"
                                :action="uploadAvatarUrl"
                                :show-file-list="false"
                                :on-progress="avatarUploadProgress"
                                :on-success="uploadAvatarSuccess"
                                :on-error="uploadAvatarError"
                                :before-upload="beforeAvatarUpload"
                                accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG">
                            <img v-if="upsertForm.portrait" :src="adminAvatar" class="uploader-img">
                            <i v-else class="el-icon-plus el-uploader-icon"></i>
                            <div class="el-upload__tip" slot="tip" style="margin-top: -20px;text-align: left;">支持png、jpg、jpeg等格式，大小不超过<strong style="color: #fe6a66">2MB</strong></div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="真实考生姓名" prop="realName">
                        <el-input size="mini" v-model="upsertForm.realName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件" prop="email">
                        <el-input size="mini"  v-model="upsertForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input size="mini"  v-model="upsertForm.phone" auto-complete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div  class="dialog-footer" >
                    <el-button size="mini" @click="closeDialog">取 消</el-button>
                    <el-button size="mini" type="primary"  @click="updateMySelf()">确 定</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码"  name="second">
                <el-form class="upsertForm" :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
                    <el-form-item label="原密码" prop="password">
                        <el-input size="mini" type="password" v-model="pwdForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input size="mini" type="password" v-model="pwdForm.newPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码" prop="newPassword2">
                        <el-input size="mini" type="password" v-model="pwdForm.newPassword2" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div  class="dialog-footer" >
                    <el-button size="mini" @click="closeDialog">取 消</el-button>
                    <el-button size="mini" type="primary"  @click="updatePassword()">确 定</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import axios from 'axios'
    import md5 from 'md5'
    export default {
        name: "personal",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.pwdForm.newPassword !== '') {
                        this.$refs.pwdForm.validateField('newPassword2');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                portrait:'',
               // ok:false,
                activeName:'first',
                config:config,
                f:`${home}/upload/uploadAvatar`,
                upsertForm:{
                    id:'',
                    /*username:'',*/
                    password:'',
                    realName:'',
                    phone:'',
                    email:'',
                    portrait:'',
                    createTime:'',
                    educationBureauId:''
                },
                rules: {
                   /* username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],*/
                    realName: [
                        { required: true, message: '请输入真实考生姓名', trigger: 'blur' }
                    ],
                    phone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {min:11, message: '必须是11位长度', trigger: 'blur'},
                        {max:11, message: '必须是11位长度', trigger: 'blur'}
                     ],
                    email: [
                        {required: true, message: '请输入email', trigger: 'blur'},
                        {type:'email', message: '请输入email', trigger: 'blur'}
                    ],
                    portrait: [
                        { required: true, message: '请输入头像', trigger: 'blur' }
                    ]
                  /*  createTime: [
                        { required: true, message: '请输入创建时间', trigger: 'blur' }
                    ]*/
                },
                pwdForm:{
                    password:'',
                    newPassword:'',
                    newPassword2:''
                },
                pwdFormRules:{
                    password:[
                        {required: true, message: '请输入原始密码', trigger: 'blur'}
                    ],
                    newPassword:[
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    newPassword2:[
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            axios({
                url:`${home}/admin/ignore/findMySelf`,
                method:'GET'
            }).then(res=>{
                Object.assign(this.upsertForm,res.data);
            })
        },
        methods:{
            closeDialog(){
                this.$emit('update:visible',false);
            },
            uploadAvatarSuccess(response, file, fileList){
                this.upsertForm.portrait=response;
                loading.close();
            },
            updateMySelf(){
                this.$refs['upsertForm'].validate(valid =>{
                    if(valid){
                        axios({
                            url:`${home}/admin/ignore/updateMySelf`,
                            method:"POST",
                            data:this.upsertForm
                        }).then(res=>{
                            this.$store.commit('setAdmin', res.data);
                            this.$message({
                                showClose: true,
                                message: '个人设置修改成功',
                                type: 'success'
                            });
                            this.closeDialog();

                        })
                    }
                })

            },
            updatePassword(){
                this.$refs['pwdForm'].validate(valid =>{
                    if(valid){
                        axios({
                            url:`${home}/admin/ignore/updateMyPassword`,
                            method:'POST',
                            data:{password:md5(this.pwdForm.password),newPassword:md5(this.pwdForm.newPassword)}
                        }).then(res=>{
                            this.$message({
                                showClose: true,
                                message: '修改密码成功',
                                type: 'success'
                            });
                            this.closeDialog();
                            this.$router.replace('/login');
                        })
                    }
                })

            },
            beforeAvatarUpload(file){
                const isJPG =
                    file.type === "image/jpeg" || file.type === "image/png"
                file.type === "image/jpg" || file.type === "image/PNG"
                file.type === "image/JPEG" || file.type === "image/JPG";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 jpeg/jpg/png 格式!");
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                    return false;
                }
                loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            },
            avatarUploadProgress(event, file, fileList){

            },
            uploadAvatarError(err, file, fileList){
                loading.close();
            }
        },
        computed:{
            adminAvatar(){
                return config.resPre+this.upsertForm.portrait;
            }
        }
    }
    let loading;
</script>

<style scoped lang="scss">
    .upsertForm {
        padding: 20px 50px;
        .el-input, .el-textarea {
            width: 60%;
        }
    }
    .avatar{
        width:80px;
        height:80px;
        border-radius: 5px;
    }
    .dialog-footer{
        text-align: center;
    }
</style>