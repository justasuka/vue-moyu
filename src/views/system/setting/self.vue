<template>
    <div class="margin-40-60-0">
     <!--   <el-tabs  type="card" v-model="activeName">
           <el-tab-pane label="基本信息" name="first">-->
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
                        >
                            <img v-if="upsertForm.portrait" :src="adminAvatar" class="uploader-img">
                            <i v-else class="el-icon-plus el-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input size="mini" v-model="upsertForm.username" disabled auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="真实考生姓名" prop="realName">
                        <el-input size="mini" v-model="upsertForm.realName" auto-complete="off"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="电子邮件" prop="email">
                        <el-input size="mini" v-model="upsertForm.email" auto-complete="off"></el-input>
                    </el-form-item>-->
                    <el-form-item label="手机号码" prop="phone">
                        <el-input size="mini" v-model="upsertForm.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="修改密码" >
                        <el-button  class="table-edit" plain size="mini" v-display:updateMyPassword @click="showUpdateDialog()">修改</el-button>
                    </el-form-item>

                </el-form>
        <div  class="dialog-footer" >
          <!--  <el-button @click="closeDialog">取 消</el-button>-->
            <el-button type="primary"  plain size="mini" v-display:ignore-updateMySelf @click="updateMySelf()">确 定 修 改</el-button>
        </div>

        <!-- 重命名对话框-begin -->
        <el-dialog  :close-on-click-modal="false" :title="dialog.title" width="640px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
                <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="pwdForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword" style="margin-top: 15px;">
                    <el-input type="password" v-model="pwdForm.newPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="newPassword2" style="margin-top: 15px;">
                    <el-input type="password" v-model="pwdForm.newPassword2" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div  class="dialog-footer" style="text-align: right">
                <el-button  plain size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button  plain size="mini" v-display:updatePassword  type="primary"  @click="updatePassword()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 重命名对话框-end -->
    </div>
</template>

<script>
    import axios from 'axios'
    import md5 from 'md5'
    export default {
        name: "self",
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
                /*对话框*/
                dialog:{
                    dialogFormVisible:false,
                    title:'修改密码'
                },
                /**/
                portrait:'',
               // ok:false,
                activeName:'first',
                config:config,
                uploadAvatarUrl:`${home}/upload/uploadAvatar`,
                upsertForm:{
                    id:'',
                    username:'',
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
                        {max:11, message: '必须是11位长度', trigger: 'blur'},
                        { pattern: /^1[23456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
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
            showUpdateDialog(){
               /* axios({
                    url:`${home}/lessonResMediaFile/update/findLessonResMediaFileById/${id}`,
                    method:'GET'
                }).then(res=>{*/
                  //  this.upsertForm=res.data;
                  /*  let filename=res.data.filename;
                    let name = filename.substring(0,filename.lastIndexOf("."));
                    let end = filename.substring(filename.lastIndexOf("."));
                    this.upsertForm.filename=name;
                    this.end=end;*/
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改密码';
               /* }).catch(error=>{

                })*/

            },
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
                           this.$message
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });


                            // this.closeDialog();

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