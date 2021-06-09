<template>
    <div>
        <!--搜索表单-->
        <div class="search-box">
            <el-form ref="searchForm"  :inline="true"  :model="searchForm" >
                <el-form-item label="角色名称:" prop="title">
                    <el-input size="mini" maxlength="20" show-word-limit  v-model="searchForm.title" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="描述:" prop="remark">
                    <el-input size="mini" maxlength="255" show-word-limit  v-model="searchForm.remark" placeholder="请输入描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" plain icon="el-icon-search" type="primary" id="findBtn" v-display:sysRole-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                    <el-button size="mini" plain icon="el-icon-refresh" type="warning" @click="clear">清空</el-button>
                    <el-button size="mini" plain type="success" icon="el-icon-refresh-left" @click="()=>{this.searchForm.pager.page=1;this.submit();}">刷新</el-button>
                    <el-button size="mini" plain type="primary" v-display:sysRole-save icon="el-icon-plus" @click="showAddDialog" >新增</el-button>
                    <el-button plain size="mini" type="danger" v-display:sysRole-batchDelete icon="el-icon-delete" @click="batchDelete" >批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格-->
        <el-table border size="mini" class="table-ui" @selection-change="changeFun" :stripe="true"  :data="tableData"  @sort-change="sortChange" >
            <el-table-column type="selection" width="40px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="title" label="角色名称" ></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="remark" label="描述" ></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间" ></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="修改时间" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="450"  >
                <template slot-scope="scope">
                    <el-button type="primary" v-display:sysRole-openUpdate plain @click="showUpdateDialog(scope.row.id)"  size="mini">修改</el-button>
                    <el-button type="success" v-display:sysRole-openSetSysPerm plain @click="showSetPermDialog(scope.row.id)"  size="mini">配置权限</el-button>
                    <el-button type="success" v-display:sysRole-openSetSysPerm plain @click="showFileTreePermDialog(scope.row.id)"  size="mini">配置文件权限</el-button>
                    <el-button type="warning" v-display:sysRole-delete plain @click="deleteData(scope.row.id)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="margin-top: 10px; text-align: center;"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchForm.pager.totalCount"
                :page-size="searchForm.pager.pageSize"
                :current-page.sync="searchForm.pager.page"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                @size-change="sizeChange"
                @current-change="currentChange"
                @prev-click="currentChange"
                @next-click="currentChange"

        >
        </el-pagination>
        <!--添加或者修改表单-->
        <el-dialog :close-on-click-modal="false" :title="dialog.title"  width="640px" :visible.sync="dialog.dialogFormVisible">
            <el-form :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" :inline="true">
                <input type="hidden" :value="upsertForm.id">
                <el-form-item label="角色名称" prop="title">
                    <el-input size="mini" maxlength="20" show-word-limit v-model="upsertForm.title" placeholder="请输入角色名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input size="mini" maxlength="255" show-word-limit  v-model="upsertForm.remark" placeholder="请输入角色描述" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.dialogFormVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" v-show="dialog.title=='增加'"  @click="saveOrUpdate('upsertForm')" size="mini">确 定</el-button>
                <el-button type="primary" v-show="dialog.title=='修改'"  @click="saveOrUpdate('upsertForm')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="配置权限" width="650px" :visible.sync="permDialog.show">
            <el-tree
                    ref="tree"
                    style="max-height: 480px;overflow: auto;"
                    :data="perms"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="checked"
                    :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="permDialog.show = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:sysRole-save @click="setSysPerms()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="配置文件权限" width="650px" :visible.sync="fileRoleDialog.show">
            <el-tree
                    ref="tree"
                    style="max-height: 480px;overflow: auto;"
                    :data="perms"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="checked"
                    :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="fileRoleDialog.show = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:sysRole-save @click="setTreeAFilePerms()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    let allChecked=[];
    export default {
        name: "sysRole",
        data() {
            return {
                searchForm:{
                    title: '',
                    remark: '',
                    createTime: '',
                    updateTime: '',
                    pager:{
                        sortField:'',
                        sortOrder:'',
                        page:1,
                        pageSize:30,
                        totalCount:0,
                        like:'title,remark'
                    },
                },
                tableData: [],
                upsertForm:{
                    id:'',
                    title: '',
                    remark: '',
                    createTime: '',
                    updateTime: '',
                },
                searchRules: {
                    title: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        {  max: 20, message: '长度必须少于20个字符', trigger: 'blur' }
                    ],
                    remark: [
                        {  max: 255, message: '长度必须少于255个字符', trigger: 'blur' }
                    ],
                },
                rules: {
                    title: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        {  max: 20, message: '长度必须少于20个字符', trigger: 'blur' }
                    ],
                    remark: [
                        {  max: 255, message: '长度必须少于255个字符', trigger: 'blur' }
                    ],
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加'
                },
                permDialog:{
                    show:false,
                    roleId:'',
                },
                fileRoleDialog:{
                    show:false,
                    roleId:'',
            },
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                perms:[],
                checked:[],
                rowData:[],

            }
        },
        created(){
            this.submit();
        },
        methods: {
            changeFun(row) {
                this.rowData = [];
                for (var i = 0; i < row.length; i++) {
                    this.rowData.push(row[i].id);
                }
            },
            showSetPermDialog(roleId){
                this.permDialog.show=true;
                this.permDialog.roleId=roleId;
                this.checked=this.perms=[];
                axios({
                    url:`${home}/sysRole/findSysPermsByRoleId/${roleId}`,
                    method:'GEt'
                }).then(res=>{
                    this.perms=res.data;
                    this.checked=res.data2;
                })
            },
            showFileTreePermDialog(roleId){
                this.fileRoleDialog.show=true;
                this.fileRoleDialog.roleId=roleId;
                this.checked=this.perms=[];
                axios({
                    url:`${home}/sysFileRole/showFileTreePermDialog/${roleId}`,
                    method:'GEt'
                }).then(res=>{
                    this.perms=res.data;
                    this.checked=res.data2;
                })
            },
            setSysPerms(){
                const ids=[...this.$refs.tree.getHalfCheckedKeys(),...this.$refs.tree.getCheckedKeys()];
                axios({
                    url:`${home}/sysRole/delsertRolePerms`,
                    method:'POST',
                    data:{roleId:this.permDialog.roleId,permIds:ids.join(",")}
                }).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '配置成功!'
                    });
                    this.permDialog.show=false;
                })
            },
            setTreeAFilePerms(){
                const ids=[...this.$refs.tree.getHalfCheckedKeys(),...this.$refs.tree.getCheckedKeys()];
                axios({
                    url:`${home}/sysFileRole/delsertFileRoles`,
                    method:'POST',
                    data:{roleId:this.fileRoleDialog.roleId,permIds:ids.join(",")}
                }).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '配置成功!'
                    });
                    this.fileRoleDialog.show=false;
                })
            },
            sortChange({ column, prop, order }){
                this.searchForm.pager.sortField=prop;
                this.searchForm.pager.sortOrder=order?order.replace(/ending$/,''):'';
                this.submit();
            },
            sizeChange(pageSize){
                this.searchForm.pager.pageSize=pageSize;
                this.submit();
            },
            currentChange(page){
                this.searchForm.pager.page=page;
                this.submit();
            },
            showAddDialog(){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                this.$refs['upsertForm']&&this.$refs['upsertForm'].resetFields();
                objUtil.setToDefault(this.upsertForm);
            },
            showUpdateDialog(id){
                axios({
                    url:`${home}/sysRole/findSysRoleById/${id}`,
                    method:'GET'
                }).then(res=>{
                    this.upsertForm=res.data;
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改';
                }).catch(error=>{

                })

            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){

                        axios({
                            url:`${home}/sysRole/${this.dialog.title==='增加'?'saveSysRole':'updateSysRole'}`,
                            method:'POST',
                            data:this.upsertForm
                        }).then(res=>{
                            this.$message({
                                message: this.dialog.title+'成功',
                                type: 'success'
                            });
                            this.dialog.dialogFormVisible = false;
                            this.submit();
                        }).catch(error=>{
                            //do something
                        })


                    }
                })
            },
            deleteData(id){
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `${home}/sysRole/deleteSysRole/${id}`,
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
            operHeader(h, { column, $index }){
                return h('span',{
                        'class':{
                            cell:true
                        }
                    },
                    [
                        h('span',{domProps:{innerHTML:'操作'}}),
                        h('i',{
                            'class':{
                                iconfont:true,
                                'icon-add':true
                            },
                            style:{
                                marginLeft:'10px',
                                marginTop:'-6px',
                                display:'inline-block',
                                fontSize:'22px',
                                color:config.skin,
                                verticalAlign:'middle',
                                cursor:'pointer'
                            },
                            on: {
                                click: this.showAddDialog
                            }
                        })
                    ]
                );
            },
            submit(){
                axios({
                    url:`${home}/sysRole/findSysRolesByCondition`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    this.tableData=res.data;
                    this.searchForm.pager.totalCount=res.totalCount;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clear(){
                this.$refs['searchForm'].resetFields();
                this.submit();
            },
            batchDelete(){
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
                        url: `${home}/sysRole/batchDeleteSysRole`,
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
                    }).catch(error => {});
                }).catch(() => {
                    this.$message({
                        type: "error",
                        message: "删除失败!"
                    });
                });
            }

        }
    }
</script>

