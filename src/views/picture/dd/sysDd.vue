<template>
    <div class="margin-40-60-0 el-img">
        <el-container>
            <el-aside class="left">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>字典类型</span>
                    </div>
                    <div style="height: 70vh;overflow-y: auto">
                        <div v-for="item in titleList" class="text item"
                             style="height: 30px;line-height: 30px;margin: 10px 0px;background-color: #f0faf4;font-size: 14px;color: #252323;padding-left: 20px">
                            <p plain @click="()=>{searchForm.typeCode = item.code;typeCode = item.code;submit();}">
                                {{item.name}}</p>
                        </div>
                    </div>
                </el-card>
            </el-aside>
            <el-main style="background: #FFFFFF;margin-top: -40px">
                <!--搜索表单-->
                <div class="search-box">
                    <el-form ref="searchForm" :inline="true" :rules="searchRules" :model="searchForm">
                        <el-form-item label="所属类型" prop="typeCode">
                            <el-select size="mini" filterable v-model="searchForm.typeCode" placeholder="请选择">
                                <el-option v-for="item in titleList" :key="item.code" :label="item.name"
                                           :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称:" prop="name">
                            <el-input size="mini" maxlength="255" show-word-limit v-model="searchForm.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="描述:" prop="remark">
                            <el-input size="mini" maxlength="255" show-word-limit v-model="searchForm.remark" placeholder="请输入键名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" plain type="primary" icon="el-icon-search" id="findBtn" v-display:sysDd-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                            <el-button size="mini" type="warning" icon="el-icon-refresh-left" plain @click="clear">清空</el-button>
                            <el-button size="mini" type="success" icon="el-icon-refresh-left" plain @click="()=>{this.searchForm.pager.page=1;this.submit();}">刷新</el-button>
                            <el-button size="mini" plain type="primary" v-display:sysDd-save icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                            <el-button plain size="mini" type="danger" v-display:sysDd-batchDelete icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!--表格-->
                <el-table border size="mini" class="table-ui" highlight-current-row :stripe="true" @selection-change="changeFun" :data="tableData" @sort-change="sortChange">
                    <el-table-column type="selection" width="40px" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="typeName" label="类型名称"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="name" label="名称">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right-start">
                                <span v-if="scope.row.name">{{scope.row.name.length > 35 ? scope.row.name.substring(0, 35) + '...' : scope.row.name}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="remark" label="描述">
                        <template slot-scope="scope">
                            <el-tooltip v-if="scope.row.type==0" class="item" effect="dark" :content="scope.row.remark" placement="right-start">
                                <span v-if="scope.row.remark">{{scope.row.remark.length > 35 ? scope.row.remark.substring(0, 35) + '...' : scope.row.remark}}</span>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.type==1" class="item" effect="dark" content="点击查看大图" placement="right-start">
                                <el-image v-if="scope.row.remark" style="width: 50px; height: 50px;border-radius: 100%" :src="config.resPre+scope.row.remark" :preview-src-list="[config.resPre+scope.row.remark]"></el-image>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.type==2" class="item" effect="dark" content="点击跳转" placement="right-start">
                                <a :href="scope.row.remark" target="_blank" class="table-edit"></a>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="type" label="内容类型">
                        <template slot-scope="scope">
                            <span>{{typeMap[scope.row.type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link" style="color: #409EFF;">操作
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <p plain size="mini" type="primary" v-display:sysDd-update @click="showUpdateDialog(scope.row.id)">修改</p>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <p plain size="mini" type="success" v-display:sysDd-look @click="toLook($event,scope.row.id)">查看</p>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <p plain size="mini" type="warning" v-display:sysDd-delete @click="deleteData(scope.row.id)">删除</p>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
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
            </el-main>
        </el-container>
        <!--添加或者修改表单-->
        <el-dialog :close-on-click-modal="false" :title="dialog.title" width="650px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" :inline="true">
                <input type="hidden" :value="upsertForm.id"/>
                <el-form-item label="所属类型" prop="typeCode">
                    <el-select size="mini" filterable v-model="upsertForm.typeCode" placeholder="请选择字典类型">
                        <el-option v-for="item in titleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容类型" prop="type">
                    <el-radio-group v-model="upsertForm.type" size="mini">
                        <el-radio-button :label="0" :value="0" :key="0">文字</el-radio-button>
                        <el-radio-button :label="1" :value="1" :key="1">图片</el-radio-button>
                        <el-radio-button :label="2" :value="2" :key="2">链接</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input size="mini" v-model="upsertForm.name" maxlength="255" style="width: 455px" show-word-limit placeholder="请输入名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="remark">
                    <el-input v-if="upsertForm.type=='0'" type="textarea" style="width: 455px" maxlength="255" show-word-limit autosize v-model="upsertForm.remark" placeholder="请输入内容" auto-complete="off"></el-input>
                    <el-input v-if="upsertForm.type=='2'" size="mini" style="width: 455px" placeholder="请输入链接" maxlength="255" show-word-limit autosize v-model="upsertForm.remark"></el-input>
                    <el-upload
                            v-if="upsertForm.type=='1'"
                            class="avatar-uploader"
                            :action="uploadDdFileUrl"
                            :headers="{token:$store.getters.getToken}"
                            :show-file-list="false"
                            :on-success="handleImgSuccess"
                            :before-upload="beforeAvatarUpload"
                            accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG">
                        <img v-if="upsertForm.remark" :src="config.resPre+upsertForm.remark" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:sysDd-save v-if="dialog.title=='增加'"
                           @click="saveOrUpdate('upsertForm')">确 定
                </el-button>
                <el-button size="mini" type="primary" v-display:sysDd-update v-else @click="saveOrUpdate('upsertForm')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <!--查看详情-->
        <el-dialog :close-on-click-modal="false" title="查看" width="650px" :visible.sync="lookVisible">
            <div>
                <el-form class="upsertForm" :inline="true" label-width="100px">
                    <el-form-item label="名称" prop="name">
                        <el-input size="mini" v-model="upsertForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="remark">
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="upsertForm.remark"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" class="large" @click="lookVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="dialogExcel.title" width="650px"
                   :visible.sync="dialogExcel.dialogFormVisible">
            <div v-if="dialogExcel.title=='导入结果'">
                <el-badge :value="cnt" class="item" style="margin: 10px 20px 10px 0px">
                    <el-button size="mini">导入总数</el-button>
                </el-badge>
                <el-badge :value="successCnt" class="item" type="primary" style="margin: 10px 20px 10px 10px">
                    <el-button size="mini">导入成功</el-button>
                </el-badge>
                <el-badge :value="errorNumber" class="item" type="warning" style="margin: 10px 20px 10px 10px">
                    <el-button size="mini">导入失败</el-button>
                </el-badge>
                <!--表格-->
                <el-table border v-show="errorNumber>0" :stripe="true" :data="uploadData" style="margin-top: 10px">
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="remark" label="描述"></el-table-column>
                    <el-table-column prop="typeCode" label="类型编码"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="updateTime" label="修改时间"></el-table-column>
                </el-table>
            </div>
            <div v-if="dialogExcel.title=='导入'">
                <el-upload class="lead-in-th"
                           style="border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #4dbd73 ;"
                           :action="uploadUrl" :headers="headers" multiple
                           :show-file-list="false" :on-success="handlesysDdSuccess" :before-upload="beforesysDdUpload">
                    <div class style="width: 440px;height: 50px;">导入</div>
                </el-upload>
                <div class="lead-in-th" @click="exportsysDdModule('upsertForm')"
                     style="border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #fff ;background-color: #51c993">
                    下载模板
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";
    let loading;
    export default {
        name: "sysDd",
        data() {
            return {
                titleList: [],
                activeNames: ["0"],
                searchForm: {
                    name: "",
                    remark: "",
                    typeCode: "",
                    type:'',
                    createTime: "",
                    updateTime: "",
                    sort: "",
                    pager: {
                        sortField: "create_time",
                        sortOrder: "desc",
                        page: 1,
                        pageSize: 10,
                        totalCount: 0,
                        like: 'typeCode,name,remark'
                    }
                },
                titleForm: {
                    name: "",
                    code: "",
                    createTime: "",
                    updateTime: "",
                    pager: {
                        sortField: "",
                        sortOrder: "",
                        page: 1,
                        pageSize: 10,
                        totalCount: 0,
                        paging: false
                    }
                },
                tableData: [],
                upsertForm: {
                    id: "",
                    name: "",
                    remark: "",
                    typeCode: "",
                    type:0,
                    createTime: "",
                    updateTime: "",
                    sort: "",
                },
                searchRules: {
                    name: [{max: 255, message: "长度必须少于255个字符", trigger: "blur"}],
                    sort: [{max: 3, message: "长度必须少于3个字符", trigger: "blur"}],
                    remark: [
                        {max: 255, message: "长度必须少于255个字符", trigger: "blur"}
                    ],
                    typeCode: [
                        {max: 32, message: "长度必须少于32个字符", trigger: "blur"}
                    ]
                },
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"},
                        {max: 255, message: "长度必须少于255个字符", trigger: "blur"}
                    ],
                    sort: [
                        {required: true, message: "请输入排序", trigger: "blur"},
                        {max: 3, message: "长度必须少于3个字符", trigger: "blur"}
                    ],
                    remark: [
                        {required: true, message: "请输入内容", trigger: "blur"},
                        {max: 255, message: "长度必须少于255个字符", trigger: "blur"}
                    ],
                    typeCode: [
                        {required: true, message: "请输入类型编号", trigger: "blur"},
                        {max: 32, message: "长度必须少于32个字符", trigger: "blur"}
                    ],
                    type: [
                        {required: true, message: "请选择类型", trigger: "blur"},
                    ]
                },
                dialog: {
                    dialogFormVisible: false,
                    title: "增加"
                },
                lookVisible: false,
                headers: {
                    token: this.$store.getters.getToken
                },
                rowData: [],
                cnt: "",
                successCnt: "",
                errorNumber: "",
                uploadData: [],
                uploadUrl: `${home}/sysDd/importByExcel`,
                dialogExcel: {
                    dialogFormVisible: false,
                    title: "导入"
                },
                typeCode: "",
                typeMap:["文字","图片","链接"],
                typeList:[
                    {"name":"文字","value":"0"},
                    {"name":"图片","value":"1"},
                    {"name":"链接","value":"2"},
                ],
                uploadDdFileUrl:`${home}/sysDd/uploadDdFileUrl`,
                config:config,
            };
        },
        created() {
            this.getTypeList();
        },
        mounted() {
            let findBtn = document.querySelector("#findBtn");
            findBtn && this.submit();
        },
        methods: {
            changeFun(row) {
                this.rowData = [];
                for (var i = 0; i < row.length; i++) {
                    this.rowData.push(row[i].id);
                }
            },
            sortChange({column, prop, order}) {
                this.searchForm.pager.sortField = prop;
                this.searchForm.pager.sortOrder = order
                    ? order.replace(/ending$/, "")
                    : "";
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
                this.dialog.title = "增加";
                objUtil.setToDefault(this.upsertForm);
                if (this.typeCode) {
                    this.upsertForm.typeCode = this.typeCode;
                }
                this.upsertForm.type='0';
                this.$nextTick(() => {
                    this.$refs.upsertForm.clearValidate();
                });
            },
            showUpdateDialog(id) {
                axios({
                    url: `${home}/sysDd/update/findSysDdById/${id}`,
                    method: "GET"
                })
                    .then(res => {
                        Object.assign(this.upsertForm, res.data);
                        this.dialog.dialogFormVisible = true;
                        this.dialog.title = "修改";
                        this.$nextTick(() => {
                            this.$refs.upsertForm.clearValidate();
                        });
                    })
                    .catch(error => {
                    });
            },
            saveOrUpdate(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        axios({
                            url: `${home}/sysDd/${
                                this.dialog.title === "增加" ? "saveSysDd" : "update/updateSysDd"
                                }`,
                            method: "POST",
                            data: this.upsertForm
                        })
                            .then(res => {
                                this.$message({
                                    message: this.dialog.title + "成功",
                                    type: "success"
                                });
                                this.dialog.dialogFormVisible = false;
                                this.submit();
                            })
                            .catch(error => {
                                //do something
                            });
                    }
                });
            },
            deleteData(id) {
                this.$confirm("删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        axios({
                            url: `${home}/sysDd/deleteSysDd/${id}`,
                            method: "GET"
                        })
                            .then(res => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.submit();
                            })
                            .catch(error => {
                            });
                    })
                    .catch(() => {
                    });
            },
            submit() {
                axios({
                    url: `${home}/sysDd/findSysDdsByCondition`,
                    method: "POST",
                    data: this.searchForm
                })
                    .then(res => {
                        if (res.data.length === 0 && this.searchForm.pager.page > 1) {
                            this.searchForm.pager.page--;
                            this.submit();
                        } else {
                            this.tableData = res.data;
                            this.searchForm.pager.totalCount = res.totalCount;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            clear() {
                this.$refs["searchForm"].resetFields();
            },
            toLook($event, id) {
                this.lookVisible = true;
                axios({
                    url: `${home}/sysDd/look/lookSysDdById/${id}`,
                    method: "GET"
                })
                    .then(res => {
                        Object.assign(this.upsertForm, res.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            leadingInsysDd() {
                this.dialogExcel.dialogFormVisible = true;
                this.dialogExcel.title = "导入";
            },
            exportsysDd() {
                axios({
                    url: `${home}/sysDd/exportSysDd`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysDd.xls");
                });
            },
            exportsysDdModule() {
                axios({
                    url: `${home}/sysDd/exportSysDdModule`,
                    method: "GET",
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysDd模板.xls");
                });
            },
            handlesysDdSuccess(res, file) {
                this.loading.close();
                this.dialogExcel.dialogUploadVisible = false;
                if (res.result.success == true) {
                    if (res.data.successCnt > 0) {
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
                        this.dialogExcel.title = "导入结果";
                    } else {
                        this.cnt = res.data.sumCnt;
                        this.successCnt = res.data.successCnt;
                        this.errorNumber = res.data.errorNumber;
                        this.uploadData = res.data.objectList;
                        this.$message({
                            message: "导入失败",
                            type: "warning"
                        });
                        this.dialogExcel.dialogFormVisible = true;
                        this.dialogExcel.title = "导入结果";
                    }
                } else {
                    this.$message({
                        message: "模板有误或数据为空",
                        type: "error"
                    });
                    this.dialogExcel.dialogUploadErrorVisible = true;
                }
            },
            beforesysDdUpload(file) {
                this.loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                const extension = file.name.split(".")[1] === "xls";
                const extension2 = file.name.split(".")[1] === "xls";
                if (!extension && !extension2) {
                    this.loading.close();
                    this.$message.error("上传模板只能是 xls、xlsx 格式!");
                }
                return extension || extension2;
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
                })
                    .then(() => {
                        axios({
                            url: `${home}/sysDd/batchDeleteSysDd`,
                            method: "post",
                            data: {
                                rowData: this.rowData
                            }
                        })
                            .then(res => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.submit();
                            })
                            .catch(error => {
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "warning",
                            message: "取消删除!"
                        });
                    });
            },
            getTypeList() {
                axios({
                    url: `${home}/sysDdtype/findSysDdtypesByCondition`,
                    method: "POST",
                    data: this.titleForm
                })
                    .then(res => {
                        this.titleList = res.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //上移
            moveUp(index, row) {
                var that = this;
                if (index > 0) {
                    this.batchRowData(that.tableData[index], that.tableData[index - 1]);
                    let upDate = that.tableData[index - 1];
                    that.tableData.splice(index - 1, 1);
                    that.tableData.splice(index, 0, upDate);
                } else {
                    this.$message({
                        type: "warning",
                        message: "已经是第一条，不可上移!"
                    });
                }
            },

            //下移
            moveDown(index, row) {
                var that = this;
                if ((index + 1) === that.tableData.length) {
                    this.$message({
                        type: "warning",
                        message: "已经是最后一条，不可下移!"
                    });
                } else {
                    this.batchRowData(that.tableData[index], that.tableData[index + 1]);
                    let downDate = that.tableData[index + 1];
                    that.tableData.splice(index + 1, 1);
                    that.tableData.splice(index, 0, downDate);
                }
            },
            batchRowData(data1, data2) {
                this.upsertForm = data1;
                this.upsertForm.sort = data2.sort;
                this.updateRowData();
                this.upsertForm = data2;
                this.upsertForm.sort = data1.sort;
                this.updateRowData();
                this.$message({
                    message: "移动成功",
                    type: "success"
                });
            },
            updateRowData() {
                axios({
                    url: `${home}/sysDd/update/updateSysDd`,
                    method: "POST",
                    data: this.upsertForm
                }).then(res => {

                })
                    .catch(error => {
                    });
            },
            handleImgSuccess(response, file, fileList){
                this.upsertForm.remark=response;
                loading.close();
            },
            beforeAvatarUpload(file) {
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
            }
        }
    };
</script>
<style lang="scss" scoped>
    p {
        margin: 0px;
    }
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<style lang="scss" >
    .el-img{
        .el-image__inner{
            width: 50px;
            height: 50px;
            border-radius: 100%;
        }
    }
</style>