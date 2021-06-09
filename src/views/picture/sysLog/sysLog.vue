<template>
    <div>
        <!--搜索表单-->
        <div class="search-box">
            <el-form ref="searchForm"  :inline="true" :rules="searchRules" :model="searchForm" >
                     <el-form-item label="用户操作:" prop="operation">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.operation" placeholder="请输入用户操作"></el-input>
                    </el-form-item>
                     <el-form-item label="IP地址:" prop="ip">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.ip" placeholder="请输入IP地址"></el-input>
                    </el-form-item>
                <el-form-item>
                    <el-button plain size="mini" type="primary" icon="el-icon-search" id="findBtn" v-display:sysLog-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                    <el-button plain size="mini" type="warning" icon="el-icon-refresh" @click="clear">清空</el-button>
                </el-form-item>
            </el-form>
         </div>
         <div style="margin-bottom: 10px;float: right;" >
            <el-button plain size="mini" type="success" icon="el-icon-refresh-left" @click="()=>{this.searchForm.pager.page=1;this.submit();}">刷新</el-button>
            <el-button plain size="mini" type="danger" v-display:sysLog-batchDelete icon="el-icon-delete" @click="batchDelete" >批量删除</el-button>
            <el-button plain size="mini" type="success" v-display:sysLog-export icon="el-icon-download" @click="exportsysLog">导出</el-button>
         </div>
        <!--表格-->
        <el-table border size="mini" class="table-ui" :stripe="true"  :data="tableData" @selection-change="changeFun"  @sort-change="sortChange" >
            <el-table-column type="selection" width="40px" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="username" label="用户名" width="120px"></el-table-column>
                <el-table-column show-overflow-tooltip prop="operation" label="用户操作"></el-table-column>
                <el-table-column show-overflow-tooltip prop="time" label="响应时间"  width="180px"></el-table-column>
                <el-table-column show-overflow-tooltip prop="method" label="请求方法" ></el-table-column>
                <!--<el-table-column show-overflow-tooltip prop="params" label="请求参数"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="ip" label="IP地址" width="180px"></el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180px"></el-table-column>
            <el-table-column fixed="right" label="操作"  width="100px">
                <template slot-scope="scope">
                    <el-button plain size="mini" type="success" v-display:sysLog-look @click="toLook($event,scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
            <div slot="empty"><no-data></no-data></div>
        </el-table>
        <el-pagination
                style="margin-top: 10px;padding-bottom: 20px;"
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
        ></el-pagination>
        <!--查看详情-->

        <el-dialog :close-on-click-modal="false" title="查看" width="1000px" :visible.sync="lookVisible">
            <div>
                <el-form class="upsertForm" :inline="true" label-width="100px">
                   <el-form-item label="用户名" prop="username">
                    <el-input size="mini" v-model="upsertForm.username" readonly auto-complete="off"></el-input>
                    </el-form-item>
                   <el-form-item label="用户操作" prop="operation">
                    <el-input size="mini" v-model="upsertForm.operation" readonly auto-complete="off"></el-input>
                    </el-form-item>
                   <el-form-item label="响应时间" prop="time">
                    <el-input size="mini" v-model="upsertForm.time" readonly auto-complete="off"></el-input>
                    </el-form-item>
                   <el-form-item label="请求方法" prop="method">
                    <el-input size="mini" v-model="upsertForm.method" readonly auto-complete="off"></el-input>
                    </el-form-item>
                   <el-form-item label="IP地址" prop="ip">
                    <el-input size="mini" v-model="upsertForm.ip" readonly auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="mini" class="large" @click="lookVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import fileDownload from "js-file-download";
    import noData from '@/components/noData/noData';
    export default {
        name: "sysLog",
        components: {
            noData },
        data() {
            return {
                searchForm:{
                      userId: '',
                      username: '',
                      operation: '',
                      time: '',
                      method: '',
                      params: '',
                      ip: '',
                      createTime: '',
                    pager:{
                        sortField:'create_time',
                        sortOrder:'desc',
                        page:1,
                        pageSize:10,
                        totalCount:0,
                        like:'operation,ip',
                    }
                },
                tableData: [],
                upsertForm:{
                        id:'',
                        userId:'',
                        username:'',
                        operation:'',
                        time:'',
                        method:'',
                        params:'',
                        ip:'',
                        createTime:''
                },
                searchRules: {
                          userId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          username: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          operation: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          time: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          method: [
                                  {  max: 100, message: '长度必须少于100个字符', trigger: 'blur' }
                              ],
                          params: [
                                  {  max: 1000, message: '长度必须少于1000个字符', trigger: 'blur' }
                              ],
                          ip: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                },
                rules: {
                          userId: [
                                  { required: true, message: '请输入用户id', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          username: [
                                  { required: true, message: '请输入用户名', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          operation: [
                                  { required: true, message: '请输入用户操作', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          time: [
                                  { required: true, message: '请输入响应时间', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          method: [
                                  { required: true, message: '请输入请求方法', trigger: 'blur' },
                                  {  max: 100, message: '长度必须少于100个字符', trigger: 'blur' }
                              ],
                          params: [
                                  { required: true, message: '请输入请求参数', trigger: 'blur' },
                                  {  max: 1000, message: '长度必须少于1000个字符', trigger: 'blur' }
                              ],
                          ip: [
                                  { required: true, message: '请输入IP地址', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  { required: true, message: '请输入创建时间', trigger: 'blur' },
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
                uploadUrl: `${home}/sysLog/importByExcel`,
                dialogExcel:{
                    dialogFormVisible:false,
                    title:'导入'
                },
            }
        },
        created(){
        },
        mounted(){
            let findBtn=document.querySelector('#findBtn');
            findBtn&&this.submit();
        },
        methods: {
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
            showAddDialog(){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                objUtil.setToDefault(this.upsertForm);
                this.$nextTick(()=>{
                    this.$refs.upsertForm.clearValidate();
                });
            },
            showUpdateDialog(id){
                axios({
                    url:`${home}/sysLog/update/findSysLogById/${id}`,
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
                            url:`${home}/sysLog/${this.dialog.title==='增加'?'saveSysLog':'update/updateSysLog'}`,
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
                        url: `${home}/sysLog/deleteSysLog/${id}`,
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
                    url:`${home}/sysLog/findSysLogsByCondition`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.data.length===0&&this.searchForm.pager.page>1){
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
            clear(){
                this.$refs['searchForm'].resetFields();
            },
            toLook($event,id){
                this.lookVisible=true;
                axios({
                    url:`${home}/sysLog/look/lookSysLogById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm,res.data);
                }).catch(error=>{
                    console.log(error);
                })
            },
            leadingInsysLog() {
                this.dialogExcel.dialogFormVisible = true;
                this.dialogExcel.title = '导入';
            },
            exportsysLog() {
                axios({
                    url: `${home}/sysOperation/exportSysOperation`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysLog.xls");
                });
            },
            exportsysLogModule() {
                axios({
                    url: `${home}/sysLog/exportSysLogModule`,
                    method: "GET",
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysLog模板.xls");
                });

            },
            handlesysLogSuccess(res, file) {
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
            beforesysLogUpload(file) {
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
                        url: `${home}/sysOperation/batchDeleteSysOperation`,
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
                        type: "warning",
                        message: "取消删除!"
                    });
                });
            }

        }
    }
</script>
