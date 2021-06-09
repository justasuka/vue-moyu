<template>
    <div>
        <!--搜索表单-->
        <div class="search-box">
            <el-form ref="searchForm" :inline="true" :rules="searchRules" :model="searchForm">
                <el-form-item label="名称:" prop="name">
                    <el-input size="mini" maxlength="255" show-word-limit v-model="searchForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="code:" prop="code">
                    <el-input size="mini" maxlength="20" show-word-limit v-model="searchForm.code" placeholder="请输入code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" plain icon="el-icon-search" type="primary" id="findBtn" v-display:sysDdtype-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                    <el-button size="mini" icon="el-icon-refresh-left" type="warning" plain @click="clear">清空</el-button>
                    <el-button size="mini" type="success" icon="el-icon-refresh-left" plain @click="()=>{this.searchForm.pager.page=1;this.submit();}">刷新</el-button>
                    <el-button size="mini" plain type="primary" v-display:sysDdtype-save icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                    <el-button plain size="mini" type="danger" v-display:sysDdtype-batchDelete icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格-->
        <el-table border size="mini" class="table-ui" :stripe="true" :data="tableData" @sort-change="sortChange" @selection-change="changeFun">
            <el-table-column align="center" type="selection" width="40px"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="code" label="code"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="修改时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                    <el-dropdown>
                        <span class="el-dropdown-link" style="color: #409EFF;">操作<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><p plain size="mini" type="primary" v-display:sysDdtype-update @click="showUpdateDialog(scope.row.id)">修改</p></el-dropdown-item>
                            <el-dropdown-item><p plain size="mini" type="success" v-display:sysDdtype-look @click="toLook($event,scope.row.id)">查看</p></el-dropdown-item>
                            <el-dropdown-item><p plain size="mini" type="warning" v-display:sysDdtype-delete @click="deleteData(scope.row.id)">删除</p></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 10px;padding-bottom: 20px;"
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
        <!--添加或者修改表单-->
        <el-dialog :close-on-click-modal="false" :title="dialog.title" width="650px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" :inline="true">
                <input type="hidden" :value="upsertForm.id"/>
                <el-form-item label="名称" prop="name">
                    <el-input size="mini" maxlength="255" show-word-limit v-model="upsertForm.name" placeholder="请输入类型名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input size="mini" maxlength="20" show-word-limit v-model="upsertForm.code" placeholder="请输入类型编码" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" v-display:sysDdtype-save v-if="dialog.title=='增加'" @click="saveOrUpdate('upsertForm')">确 定</el-button>
                <el-button size="mini" type="primary" v-display:sysDdtype-update v-else @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--查看详情-->
        <el-dialog :close-on-click-modal="false" title="查看" width="650px" :visible.sync="lookVisible">
            <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" :inline="true">
                <el-form-item label="名称" prop="name">
                    <el-input size="mini" maxlength="255" show-word-limit v-model="upsertForm.name" placeholder="请输入类型名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input size="mini" maxlength="20" show-word-limit v-model="upsertForm.code" placeholder="请输入类型编码" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" class="large" @click="lookVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        name: "sysDdtype",
        data() {
            return {
                searchForm: {
                    name: "",
                    code: "",
                    createTime: "",
                    updateTime: "",
                    pager: {
                        sortField: "create_time",
                        sortOrder: "desc",
                        page: 1,
                        pageSize: 30,
                        totalCount: 0,
                        like: 'code,name'
                    }
                },
                tableData: [],
                upsertForm: {
                    id: "",
                    name: "",
                    code: "",
                    createTime: "",
                    updateTime: ""
                },
                searchRules: {
                    name: [{max: 32, message: "长度必须少于32个字符", trigger: "blur"}],
                    code: [{max: 32, message: "长度必须少于32个字符", trigger: "blur"}],
                    createTime: [
                        {max: 32, message: "长度必须少于32个字符", trigger: "blur"}
                    ],
                    updateTime: [
                        {max: 32, message: "长度必须少于32个字符", trigger: "blur"}
                    ]
                },
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"},
                        {max: 255, message: "长度必须少于255个字符", trigger: "blur"}
                    ],
                    code: [
                        {required: true, message: "请输入编码", trigger: "blur"},
                        {max: 20, message: "长度必须少于20个字符", trigger: "blur"}
                    ]
                },
                dialog: {
                    dialogFormVisible: false,
                    title: "增加"
                },
                lookVisible: false,
                rowData: []
            };
        },
        created() {
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
                this.$nextTick(() => {
                    this.$refs.upsertForm.clearValidate();
                });
            },
            showUpdateDialog(id) {
                axios({
                    url: `${home}/sysDdtype/update/findSysDdtypeById/${id}`,
                    method: "GET"
                }).then(res => {
                    Object.assign(this.upsertForm, res.data);
                    this.dialog.dialogFormVisible = true;
                    this.dialog.title = "修改";
                    this.$nextTick(() => {
                        this.$refs.upsertForm.clearValidate();
                    });
                }).catch(error => {

                });
            },
            saveOrUpdate(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        axios({
                            url: `${home}/sysDdtype/${this.dialog.title === "增加" ? "saveSysDdtype" : "update/updateSysDdtype"}`,
                            method: "POST",
                            data: this.upsertForm
                        }).then(res => {
                            this.$message({
                                message: this.dialog.title + "成功",
                                type: "success"
                            });
                            this.dialog.dialogFormVisible = false;
                            this.submit();
                        }).catch(error => {
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
                }).then(() => {
                    axios({
                        url: `${home}/sysDdtype/deleteSysDdtype/${id}`,
                        method: "GET"
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.submit();
                    }).catch(error => {

                    });
                }).catch(() => {
                });
            },
            submit() {
                axios({
                    url: `${home}/sysDdtype/findSysDdtypesByCondition`,
                    method: "POST",
                    data: this.searchForm
                }).then(res => {
                    if (res.data.length === 0 && this.searchForm.pager.page > 1) {
                        this.searchForm.pager.page--;
                        this.submit();
                    } else {
                        this.tableData = res.data;
                        this.searchForm.pager.totalCount = res.totalCount;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clear() {
                this.$refs["searchForm"].resetFields();
            },
            toLook($event, id) {
                this.lookVisible = true;
                axios({
                    url: `${home}/sysDdtype/look/lookSysDdtypeById/${id}`,
                    method: "GET"
                }).then(res => {
                    Object.assign(this.upsertForm, res.data);
                }).catch(error => {
                    console.log(error);
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
                        url: `${home}/sysDdtype/batchDeleteSysDdtype`,
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
                        type: "warning",
                        message: "取消删除!"
                    });
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    p {
        margin: 0px;
    }
</style>
