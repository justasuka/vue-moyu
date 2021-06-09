<template>
    <div>
        <!--搜索表单-->
        <div class="search-box">
            <!--搜索表单-->
            <el-form ref="searchForm" style="margin-top: 20px;margin-left: 20px;" :inline="true" :model="searchForm">
                <el-form-item label="登录账号:" prop="username">
                    <el-input size="mini" maxlength="30" show-word-limit v-model="searchForm.username" placeholder="登录账号"></el-input>
                </el-form-item>
                <el-form-item label="真实考生姓名:" prop="realName">
                    <el-input size="mini" maxlength="10" show-word-limit v-model="searchForm.realName" placeholder="真实考生姓名"></el-input>
                </el-form-item>
                <el-form-item label="单位名称:" prop="unitName">
                    <el-input size="mini" maxlength="32" show-word-limit v-model="searchForm.unitName" placeholder="单位名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" icon="el-icon-search" type="primary" plain v-display:admin-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                    <el-button size="mini" icon="el-icon-refresh" type="warning" plain @click="clear">清空</el-button>
                    <el-button size="mini" plain type="success" icon="el-icon-refresh-left" @click="()=>{this.searchForm.pager.page=1;this.submit();}">刷新</el-button>
                    <el-button size="mini" plain type="primary" v-display:admin-save icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                    <el-button plain size="mini" type="danger" v-display:admin-batchDelete icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                    <el-button size="mini" plain type="danger" v-display:admin-batchResetPwd icon="el-icon-refresh" @click="batchResetPwd">重置密码</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格-->
        <el-table border size="mini" class="table-ui" :stripe="true" @selection-change="changeFun" :data="tableData" style="width: 100%" @sort-change="sortChange">
            <el-table-column type="selection" width="40px" align="center"></el-table-column>
            <el-table-column prop="portrait" label="头像" align="center">
                <template slot-scope="scope">
                    <img class="avatar" v-if="scope.row.portrait" :style="{'max-width':'70px','max-height':'70px'}" :src="config.resPre+scope.row.portrait" alt="">
                    <img class="avatar" v-else :style="{'max-width':'70px','max-height':'70px'}" src="@/assets/frame/images/blacksan.jpg" alt="">
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="username" label="登录账号"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="realName" label="真实考生姓名"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="roleNames" label="所属角色"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="phone" label="电话号码"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="email" label="电子邮件"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="unitName" label="单位名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="jobId" label="职务编号"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="jobName" label="职务名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="350">
                <template slot-scope="scope">
                    <el-button type="primary" v-display:admin-update plain @click="showUpdateDialog(scope.row.id)" size="mini">修改</el-button>
                    <el-button type="success" v-display:admin-openSysRole plain @click="showSetRoleDialog(scope.row.id)" size="mini">配置角色</el-button>
                    <el-button type="warning" v-display:admin-delete plain @click="deleteData(scope.row.id)" size="mini">删除</el-button>
                    <el-button type="danger" v-display:admin-resetPwd plain @click="resetPwd(scope.row.id)" size="mini">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="margin-top: 10px; text-align: center;"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                :total="searchForm.pager.totalCount"
                :page-size="searchForm.pager.pageSize"
                :current-page.sync="searchForm.pager.page"
                @size-change="sizeChange"
                @current-change="currentChange"
                @prev-click="currentChange"
                @next-click="currentChange"

        >
        </el-pagination>
        <!--添加或者修改表单-->
        <el-dialog :close-on-click-modal="false"  :title="dialog.title" width="750px" :visible.sync="dialog.dialogFormVisible">
            <el-form :model="upsertForm" :rules="rules" ref="upsertForm" label-width="120px" :inline="true">
                <input type="hidden" :value="upsertForm.id">
                <el-form-item label="登录账号" prop="username">
                    <el-input size="mini" maxlength="30" show-word-limit v-model="upsertForm.username" placeholder="请输入登录账号" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实考生姓名" prop="realName">
                    <el-input size="mini" maxlength="10" show-word-limit v-model="upsertForm.realName" placeholder="请输入真实考生姓名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input size="mini" maxlength="16" show-word-limit v-model="upsertForm.phone" placeholder="请输入电话号码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件" prop="email">
                    <el-input size="mini" maxlength="30" show-word-limit v-model="upsertForm.email" placeholder="请输入电子邮件" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职务编号" prop="jobId">
                    <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.jobId" placeholder="请输入职务编号" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职务名称" prop="jobName">
                    <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.jobName" placeholder="请输入职务名称" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:admin-save v-if="dialog.title=='增加'" @click="saveOrUpdate('upsertForm')">确 定</el-button>
                <el-button size="mini" type="primary" v-display:admin-update v-else @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" @open="openRoleDialog" :title="sysRoleDialog.title" width="700px" :visible.sync="sysRoleDialog.dialogFormVisible">
            <div style="margin-left: 30px">
                <el-transfer
                        filterable
                        v-model="roles"
                        :data="sysRoles.data"
                        :titles="titles"
                        :props="defaultProps">
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="sysRoleDialog.dialogFormVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:admin-setSysRole @click="setSysRoles()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import fileDownload from "js-file-download";
    import md5 from 'md5';

    let roleChecked = [];
    export default {
        name: "admin",
        data() {
            return {
                config: config,
                props: {
                    label: 'title',
                    children: 'zones'
                },
                sysRoles: {
                    data: []
                },
                departMentList: [],
                searchForm: {
                    username: '',
                    password: '',
                    realName: '',
                    phone: '',
                    email: '',
                    portrait: '',
                    createTime: '',
                    unitId: '',
                    unitName: '',
                    pager: {
                        sortField: '',
                        sortOrder: '',
                        page: 1,
                        pageSize: 30,
                        totalCount: 0,
                        like:'unitName,username,realName'
                    }
                },
                tableData: [],
                jobList: [],
                rowData: [],
                upsertForm: {
                    id: '',
                    username: '',
                    password: '',
                    realName: '',
                    phone: '',
                    email: '',
                    portrait: '',
                    createTime: '',
                    unitId: '',
                    unitName: '',
                },
                rules: {
                    username: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'},
                        {max: 30, message: '长度必须少于30个字符', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入真实考生姓名', trigger: 'blur'},
                        {max: 10, message: '长度必须少于10个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {max: 16, message: '长度必须少于16个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true,message: '请输入电子邮件', trigger: 'blur'},
                        {max: 30, message: '长度必须少于30个字符', trigger: 'blur'}
                    ],
                    unitId: [
                        {required: true, message: '请选择单位名称', trigger: 'blur'},
                    ],
                    jobId: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    jobName: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                },
                dialog: {
                    dialogFormVisible: false,
                    title: '增加'
                },
                sysRoleDialog: {
                    dialogFormVisible: false,
                    title: '配置角色',
                    adminId: ''
                },
                unitList:[],
                roles:[],
                titles:["所有角色","已选角色"],
                defaultProps: {
                    key: 'id',
                    label: 'title'
                }

            }
        },
        created() {
            this.submit();
        },
        methods: {
            changeFun(row) {
                this.rowData = [];
                for (var i = 0; i < row.length; i++) {
                    this.rowData.push(row[i].id);
                }
            },
            showSetRoleDialog(id) {
                this.sysRoleDialog.dialogFormVisible = true;
                this.sysRoleDialog.adminId = id;
            },
            selectionChange(checked) {
                roleChecked = checked.map(obj => obj.id);
            },
            setSysRoles() {
                axios({
                    url: `${home}/admin/delsertAdminSysRoles`,
                    method: 'POST',
                    data: {adminId: this.sysRoleDialog.adminId, roleIds: this.roles.join(",")}
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '配置成功!'
                    });
                    this.sysRoleDialog.dialogFormVisible = false;
                })
            },
            openRoleDialog() {
                this.sysRoles.data = [];
                axios({
                    url: `${home}/admin/findSysRolesByAdminId/${this.sysRoleDialog.adminId}`,
                    method: 'GET'
                }).then(res => {
                    this.roles = res.data2;
                    this.sysRoles.data = res.data;
                }).catch(error => {

                })
            },
            sortChange({column, prop, order}) {
                this.searchForm.pager.sortField = prop;
                this.searchForm.pager.sortOrder = order ? order.replace(/ending$/, '') : '';
                this.submit();
            },
            sizeChange(pageSize) {
                this.searchForm.pager.pageSize = pageSize;
                this.submit();
            },
            currentChange(page) {
                this.searchForm.pager.page = page;
                this.submit();
            },
            showAddDialog() {
                this.dialog.dialogFormVisible = true;
                this.dialog.title = '增加';
                objUtil.setToDefault(this.upsertForm);
                this.$nextTick(() => {
                    this.$refs.upsertForm.clearValidate();
                });

            },
            showUpdateDialog(id) {
                axios({
                    url: `${home}/admin/findAdminById/${id}`,
                    method: 'GET'
                }).then(res => {
                    this.upsertForm = res.data;
                    this.dialog.dialogFormVisible = true;
                    this.dialog.title = '修改';
                    this.$nextTick(() => {
                        this.$refs.upsertForm.clearValidate();
                    });
                }).catch(error => {

                })

            },
            saveOrUpdate(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {

                        axios({
                            url: `${home}/admin/${this.dialog.title === '增加' ? 'saveAdmin' : 'updateAdmin'}`,
                            method: 'POST',
                            data: this.upsertForm
                        }).then(res => {
                            this.$message({
                                message: this.dialog.title + '成功',
                                type: 'success'
                            });
                            this.dialog.dialogFormVisible = false;
                            this.submit();
                        }).catch(error => {
                            //do something
                        })


                    }
                })
            },
            deleteData(id) {
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `${home}/admin/deleteAdmin/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.submit();
                    }).catch(error => {

                    })

                });

            },
            down() {
                axios({
                    url: `${home}/admin/down`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "管理员列表.xls");
                });

            },
            submit(){
                axios({
                    url:`${home}/admin/findAdminsByCondition`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.data.length===0&&this.searchForm.pager.page>1&&res.totalCount>0){
                        this.searchForm.pager.page--;
                        this.submit();
                    }else{
                        this.tableData=res.data;
                        this.searchForm.pager.totalCount=res.totalCount;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clear() {
                this.$refs['searchForm'].resetFields();
            },
            resetPwd(id) {
                this.$prompt('请输入重置新密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^(?![a-zA-z]+$)(?!,\d+$)(?![!,@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!,@#$%^&*]+$)(?![\d!,@#$%^&*]+$)[a-zA-Z\d!,@#$%^&*]{8,20}$/,
                    inputErrorMessage: '只能输入8-20且由字母、数字、特殊符号组成'
                }).then(({value}) => {
                    this.upsertForm.password = md5(value);
                    this.upsertForm.id = id;
                    axios({
                        url: `${home}/admin/resetPwd`,
                        method: 'POST',
                        data: this.upsertForm
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消重置'
                    });
                });
            },
            batchResetPwd() {
                if (this.rowData.length <= 0) {
                    this.$message({
                        type: "error",
                        message: "请勾选数据!"
                    });
                    return;
                }
                this.$prompt('请输入重置新密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^(?![a-zA-z]+$)(?!,\d+$)(?![!,@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!,@#$%^&*]+$)(?![\d!,@#$%^&*]+$)[a-zA-Z\d!,@#$%^&*]{8,20}$/,
                    inputErrorMessage: '只能输入8-20且由字母、数字、特殊符号组成'
                }).then(({value}) => {
                    this.upsertForm.password = md5(value);
                    this.upsertForm.rowData = this.rowData;
                    axios({
                        url: `${home}/admin/batchResetPwd`,
                        method: 'POST',
                        data: this.upsertForm
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '批量重置成功!'
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消重置'
                    });
                });
            },
            batchDelete() {
                if (this.rowData.length <= 0) {
                    this.$message({
                        type: "error",
                        message: "请勾选数据!"
                    });
                    return;
                }
                this.$confirm("确认批量删除吗?", "温馨提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    axios({
                        url: `${home}/admin/batchDeleteAdmin`,
                        method: "post",
                        data: {
                            rowData: this.rowData
                        }
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.submit();
                    }).catch(error => {
                    });
                }).catch(() => {
                    this.$message({
                        type: "error",
                        message: "删除失败!"
                    });
                });
            },
        }
    }
</script>

