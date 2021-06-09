<template>
    <div class="margin-40-60-0">
        <div class="search-box">
            <el-form ref="searchForm" :inline="true" :model="searchForm" >
                <el-form-item label="机构名称" prop="name">
                    <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.name" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button plain size="mini" type="primary" icon="el-icon-search" id="findBtn" v-display:sysDepartment-find @click="search">查询</el-button>
                    <el-button plain size="mini" type="warning" icon="el-icon-refresh-left" @click="clear">清空</el-button>
                    <el-button plain size="mini" type="success" icon="el-icon-refresh-left" @click="()=>{this.submit();}">刷新</el-button>
                    <el-button plain type="primary" v-display:sysDepartment-save size="mini" @click="showAddDialog(null,'-1')">添加一级机构</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table border size="mini" :data="departments" v-if="type==0" style="width: 100%;margin-bottom: 20px;" row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="name" label="机构名称"></el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button plain type="primary" v-display:sysDepartment-save size="mini" @click="showAddDialog(null,scope.row.id)">添加子机构</el-button>
                    <el-button plain type="success" v-display:sysDepartment-look size="mini" @click="showUpdateDialog(scope.row.id)">编辑</el-button>
                    <el-button plain type="danger"  v-display:sysDepartment-delete size="mini" @click="deleteData(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty"><no-data></no-data></div>
        </el-table>
        <el-table border size="mini" :data="departments" v-else style="width: 100%;margin-bottom: 20px;">
            <el-table-column prop="name" label="机构名称"></el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button plain type="primary" v-display:sysDepartment-save size="mini" @click="showAddDialog(null,scope.row.id)">添加子机构</el-button>
                    <el-button plain type="success" v-display:sysDepartment-look size="mini" @click="showUpdateDialog(scope.row.id)">编辑</el-button>
                    <el-button plain type="danger"  v-display:sysDepartment-delete size="mini" @click="deleteData(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty"><no-data></no-data></div>
        </el-table>
        <el-dialog  :title="dialog.title"   width="400px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm"  :model="upsertForm" :rules="rules" ref="upsertForm" label-width="120px" :inline="true">
                <input type="hidden" :value="upsertForm.id">
                <el-form-item label="组织机构" prop="name">
                    <el-input size="mini" maxlength="50" style="width: 200px"  show-word-limit  v-model="upsertForm.name" placeholder="请输入组织机构名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="组织机构排序" prop="sort">
                    <el-input-number size="mini" style="width: 200px" v-model="upsertForm.sort" :min="1" :max="999" label="请输入组织机构排序"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="mini"  @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button plain size="mini"  type="primary" v-if="dialog.title=='增加'" v-display:sysDepartment-save @click="saveOrUpdate('upsertForm')">确 定</el-button>
                <el-button plain size="mini"  type="primary" v-else v-display:sysDepartment-update @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios';
    import fileDownload from "js-file-download";
    import noData from '@/components/noData/noData';
    export default {
        name: "sysDepartment",
        components: { noData },
        data() {
            return {
                searchForm:{
                    name: '',
                    parentId: '',
                    sort: '',
                    createTime: '',
                    updateTime: '',
                    adminId: '',
                    adminName: '',
                    pager:{
                        sortField:'sort',
                        sortOrder:'asc',
                        page:1,
                        pageSize:10,
                        totalCount:0,
                        like:'name',
                    }
                },
                tableData: [],
                upsertForm:{
                    id:'',
                    name:'',
                    parentId:'',
                    sort:'',
                    createTime:'',
                    updateTime:'',
                    adminId:'',
                    adminName:''
                },
                searchRules: {
                    name: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    parentId: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    sort: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    createTime: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    updateTime: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    adminId: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    adminName: [
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                },
                rules: {
                    name: [
                        { required: true, message: '请输入组织机构', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    parentId: [
                        { required: true, message: '请输入上级部门', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入组织排序', trigger: 'blur' },
                    ],
                    createTime: [
                        { required: true, message: '请输入创建时间', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    updateTime: [
                        { required: true, message: '请输入修改时间', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    adminId: [
                        { required: true, message: '请输入用户id', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                    adminName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                    ],
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加'
                },
                lookVisible:false,
                headers: {
                    token: this.$store.getters.getToken
                },
                rowData: [],
                cnt: '',
                successCnt: '',
                errorNumber: '',
                uploadData: [],
                uploadUrl: `${home}/sysDepartment/importByExcel`,
                dialogExcel:{
                    dialogFormVisible:false,
                    title:'导入'
                },
                exportDialogExcel:{
                    dialogFormVisible:false,
                    title:'导出选择字段',
                    id:'',
                },
                tableFieldData:[],
                fieldData:[],
                excelParam:{
                    data:'',
                    excelExportList:''
                },
                departments:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                openKeys:[],
                type:0
            }
        },
        created(){
        },
        mounted(){
            this.submit();
        },
        methods: {
            changeTableFieldFun(row) {
                this.fieldData = [];
                for (var i = 0; i < row.length; i++) {
                    this.fieldData.push(row[i]);
                }
            },
            changeFun(row) {
                this.rowData = [];
                for (var i = 0; i < row.length; i++) {
                    this.rowData.push(row[i].id);
                }
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
            showAddDialog(e,pId){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                objUtil.setToDefault(this.upsertForm);
                this.$nextTick(()=>{
                    this.$refs.upsertForm.clearValidate();
                });
                this.upsertForm.parentId=pId;
            },
            showUpdateDialog(id){
                axios({
                    url:`${home}/sysDepartment/update/findSysDepartmentById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm,res.data);
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改';
                    this.$nextTick(()=>{
                        this.$refs.upsertForm.clearValidate();
                    });
                }).catch(error=>{

                })

            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        axios({
                            url:`${home}/sysDepartment/${this.dialog.title==='增加'?'saveSysDepartment':'update/updateSysDepartment'}`,
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
                this.$confirm('确认是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `${home}/sysDepartment/deleteSysDepartment/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.submit();
                    }).catch(error => {

                    })
                }).catch(() => {

                });

            },
            submit(){
                axios({
                    url:`${home}/sysDepartment/findSysDepartmentAllList`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    this.departments=res.data;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clear(){
                this.type=0;
                this.$refs['searchForm'].resetFields();
            },
            toLook($event,id){
                this.lookVisible=true;
                axios({
                    url:`${home}/sysDepartment/look/lookSysDepartmentById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm,res.data);
                }).catch(error=>{
                    console.log(error);
                })
            },
            leadingInSysDepartment() {
                this.dialogExcel.dialogFormVisible = true;
                this.dialogExcel.title = '导入';
            },
            exportSysDepartment() {
                axios({
                    url: `${home}/sysDepartment/exportSysDepartment`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysDepartment.xls");
                });
            },
            exportSysDepartmentModule() {
                axios({
                    url: `${home}/sysDepartment/exportSysDepartmentModule`,
                    method: "GET",
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysDepartment模板.xls");
                });

            },
            handleSysDepartmentSuccess(res, file) {
                this.loading.close();
                this.dialogExcel.dialogUploadVisible = false;
                if (res.result.success== true) {
                    if(res.data.successCnt>0){
                        this.cnt = res.data.sumCnt;
                        this.successCnt = res.data.successCnt;
                        this.errorNumber = res.data.errorNumber;
                        this.uploadData = res.data.objectList;
                        this.$message({
                            message: "导入成功",
                            type: "success"
                        });
                        this.submit();
                        this.dialogExcel.dialogFormVisible = true;
                        this.dialogExcel.title = '导入结果';
                    }else{
                        this.cnt = res.data.sumCnt;
                        this.successCnt = res.data.successCnt;
                        this.errorNumber = res.data.errorNumber;
                        this.uploadData = res.data.objectList;
                        this.$message({
                            message: "导入失败",
                            type: "warning"
                        });
                        this.dialogExcel.dialogFormVisible = true;
                        this.dialogExcel.title = '导入结果';
                    }
                } else{
                    this.$message({
                        message: "模板有误或数据为空",
                        type: "error"
                    });
                    this.dialogExcel.dialogUploadErrorVisible = true;
                }
            },
            beforeSysDepartmentUpload(file) {
                this.loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                const extension = file.name.split(".")[1] === "xls";
                const extension2 = file.name.split(".")[1] === "xlsx";
                if (!extension && !extension2) {
                    this.loading.close();
                    this.$message.error("上传模板只能是 xls、xlsx 格式!");
                }
                return extension || extension2;
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
                        url: `${home}/sysDepartment/batchDeleteSysDepartment`,
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
            },
            exportSysDepartmentDialog(){
                axios({
                    url: `${home}/sysDepartment/getSysDepartmentTableField`,
                    method: "GET",
                }).then(res => {
                    this.tableFieldData = res.data;
                    this.exportDialogExcel.dialogFormVisible = true;
                    this.exportDialogExcel.title = '导出选择字段';
                    this.exportDialogExcel.id = this.id;
                });

            },
            exportSysDepartmentByField() {
                if(this.fieldData.length<=0 ){
                    this.$message({
                        type: "error",
                        message: "请选择需要导出的字段!"
                    });
                }else{
                    this.excelParam.data = this.searchForm;
                    this.excelParam.excelExportList = this.fieldData;
                    axios({
                        url: `${home}/sysDepartment/exportSysDepartmentByField`,
                        method: "POST",
                        data: this.excelParam,
                        responseType: "arraybuffer"
                    }).then(res => {
                        fileDownload(res, "sysDepartment.xls");
                    });
                }

            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                axios({
                    url:`${home}/sysDepartment/update/updateSysDepartment`,
                    method:'POST',
                    data:Object.assign(draggingNode.data,{parentId:dropType==='inner'?dropNode.data.id:dropNode.data.parentId})
                })
            },
            search(){
                if(this.searchForm.name){
                    this.type = 1;
                    axios({
                        url:`${home}/sysDepartment/findSysDepartmentAllListNoTree`,
                        method:'POST',
                        data:this.searchForm
                    }).then(res=>{
                        this.departments=res.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else{
                    this.submit();
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .box-card {
        width: 500px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .upsertForm .el-input{
        width:480px;
    }

    .upsertForm {
        .icon{
            width:200px;
            /deep/  .el-input__inner{
                width:200px;
                background-color: #f4f4f4;
            }

        }
        .iconfont{
            margin-left: 10px;
            font-size: 25px;
            vertical-align: middle;
            cursor: pointer;
        }
    }
</style>
