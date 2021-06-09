<template>
    <div class="sysFile">
        <div style="width: 15%;float: left;height: 100%;">
            <el-card class="box-card" style="height: 100%;">
                <div slot="header" class="clearfix">
                    <span>目录列表</span>
                </div>
                <div class="text item" :style="{width:'300px',overflow:'auto',height:scrollHeight}">
                    <div class="scroll">
                        <el-scrollbar>

                        <el-tree
                            class="filter-tree"
                            :data="treeList"
                            :props="defaultProps"
                            @node-click="handleNodeClick"
                            node-key="id">
                        </el-tree>
                        </el-scrollbar>

                    </div>
                </div>
            </el-card>
        </div>
        <div style="width: 85%;float: left;">
            <!--搜索表单-->
            <div class="search-box">
                <el-form ref="searchForm" :inline="true" :rules="searchRules" :model="searchForm" >
                    <el-form-item label="类型:" prop="type">
                        <el-select filterable v-model="searchForm.type" placeholder="请选择组卷方式" size="mini">
                            <el-option v-for="item in issueTypeMapList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称:" prop="title">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.title" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标签:" prop="tag">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.tag" placeholder="请输入标签"></el-input>
                    </el-form-item>
                    <el-form-item label="评分:" prop="score">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.score" placeholder="请输入评分"></el-input>
                    </el-form-item>
                    <el-form-item label="说明:" prop="remark">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="searchForm.remark" placeholder="请输入说明"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain size="mini" type="primary" icon="el-icon-search" id="findBtn" v-display:sysFile-find @click="()=>{this.searchForm.pager.page=1;this.submit();}">查询</el-button>
                        <el-button plain size="mini" type="warning" icon="el-icon-refresh" @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-bottom: 20px;float: right;margin-right: 20px">
                <el-button plain size="mini" type="success" icon="el-icon-refresh-left" @click="()=>{this.searchForm.pager.page=1;this.submit();this.getTreeList();}">刷新</el-button>
                <el-button plain size="mini" type="primary" v-display:sysFile-save icon="el-icon-plus" @click="showAddDialog" >新增</el-button>
                <el-button plain size="mini" type="primary" v-display:sysFile-save icon="el-icon-upload" @click="showAddUpload">上传文件夹</el-button>
                <el-button plain size="mini" type="primary" v-display:sysFile-batchDelete icon="el-icon-delete" @click="batchDelete" >批量删除</el-button>
                <!--<el-dropdown>-->
                    <!--<el-button type="primary" size="mini" plain style="margin: 0px 10px 0px 10px">-->
                        <!--批量操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                    <!--</el-button>-->
                    <!--<el-dropdown-menu slot="dropdown">-->
                        <!--<el-dropdown-item><el-button size="mini" type="text" v-display:sysFile-batchDelete icon="el-icon-delete" @click="batchDelete" >批量删除</el-button></el-dropdown-item>-->
                        <!--<el-dropdown-item><el-button size="mini" type="text" v-display:sysFile-leadingIn icon="el-icon-upload" @click="leadingInSysFile">导入</el-button></el-dropdown-item>-->
                        <!--<el-dropdown-item><el-button size="mini" type="text" v-display:sysFile-export icon="el-icon-download" @click="exportSysFile">导出</el-button></el-dropdown-item>-->
                        <!--<el-dropdown-item><el-button size="mini" type="text" v-display:sysFile-exportField icon="el-icon-download" @click="exportSysFileDialog">导出选择字段</el-button></el-dropdown-item>-->
                        <!--<el-dropdown-item><el-button size="mini" type="text" v-display:sysFile-exportModule icon="el-icon-download" @click="exportSysFileModule('upsertForm')">下载模板</el-button></el-dropdown-item>-->
                    <!--</el-dropdown-menu>-->
                <!--</el-dropdown>-->
            </div>
            <!--表格-->
            <el-table border size="mini" class="table-ui" :stripe="true"  :data="tableData" @selection-change="changeFun"  @sort-change="sortChange" >
                <el-table-column type="selection" width="60px" style="text-align: center;margin: auto"></el-table-column>
                <el-table-column show-overflow-tooltip prop="type" label="类型" sortable="custom" >
                    <template slot-scope="scope">
                        <span>{{issueTypeMap[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="名称" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="tag" label="标签" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="description" label="描述" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="address" label="位置" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="adminName" label="创建人名" sortable="custom" ></el-table-column>
                <!--<el-table-column show-overflow-tooltip prop="level" label="应用级别" sortable="custom" ></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="score" label="评分" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" sortable="custom" ></el-table-column>
                <!--<el-table-column show-overflow-tooltip prop="isDelete" label="回收站；" sortable="custom" ></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="updateTime" label="上次修改" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="openTime" label="上次打开" sortable="custom" ></el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="说明" sortable="custom" ></el-table-column>
                <el-table-column fixed="right" label="操作" width="80"  >
                    <template slot-scope="scope">
                        <el-dropdown>
                            <span class="el-dropdown-link" style="color: #409EFF">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><el-button type="text" v-display:sysFile-update @click="showUpdateDialog(scope.row.id)">修改</el-button></el-dropdown-item>
                                <el-dropdown-item><el-button type="text" v-display:sysFile-look @click="toLook($event,scope.row.id)">查看</el-button></el-dropdown-item>
                                <el-dropdown-item><el-button type="text" v-display:sysFile-delete @click="deleteData(scope.row.id)">删除</el-button></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
            <!--添加或者修改表单-->
            <el-dialog :close-on-click-modal="false" :title="dialog.title" width="1000px" :visible.sync="dialog.dialogFormVisible">
                <el-form class="upsertForm"  :model="upsertForm" :rules="rules" ref="upsertForm" label-width="100px" :inline="true">
                    <input type="hidden" :value="upsertForm.id">
                    <el-form-item label="上级目录">
                        <el-input size="mini" v-model="parentName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="title">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.title" placeholder="请输入名称" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="标签" prop="tag">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.tag" placeholder="请输入标签" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select filterable v-model="upsertForm.type" placeholder="请选择类型" size="mini">
                            <el-option v-for="item in issueTypeMapList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评分" prop="score">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.score" placeholder="请输入评分" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" prop="address">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.address" placeholder="请输入位置" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.description" placeholder="请输入描述" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="说明" prop="remark">
                        <el-input size="mini" maxlength="32" show-word-limit  v-model="upsertForm.remark" placeholder="请输入说明" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button plain size="mini"  @click="dialog.dialogFormVisible = false">取 消</el-button>
                    <el-button plain size="mini"  type="primary" v-if="dialog.title=='增加'" v-display:sysFile-save @click="saveOrUpdate('upsertForm')">确 定</el-button>
                    <el-button plain size="mini"  type="primary" v-else v-display:sysFile-update @click="saveOrUpdate('upsertForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!--查看详情-->
            <el-dialog :close-on-click-modal="false" title="查看" width="1000px" :visible.sync="lookVisible">
                <div>
                    <el-form class="upsertForm" :inline="true" label-width="100px">
                        <el-form-item label="名称" prop="title">
                            <el-input size="mini" v-model="upsertForm.title" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="标签" prop="tag">
                            <el-input size="mini" v-model="upsertForm.tag" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="type">
                            <el-input size="mini" v-model="issueTypeMap[upsertForm.type]" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input size="mini" v-model="upsertForm.score" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="位置" prop="address">
                            <el-input size="mini" v-model="upsertForm.address" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input size="mini" v-model="upsertForm.description" readonly auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="说明" prop="remark">
                            <el-input size="mini" v-model="upsertForm.remark" readonly auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button plain size="mini" class="large" @click="lookVisible = false">取 消</el-button>
                </div>
            </el-dialog>

            <!--文件夹上传-->
            <el-dialog :close-on-click-modal="false" title="文件夹上传" width="600px" :visible.sync="uploaderDialog.visible">
                <div>
                    <!--<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="文件夹上传" name="0">

                        </el-tab-pane>
                        <el-tab-pane label="路径同步" name="1">
                            <el-alert :title="'请将文件夹拷贝至【'+uploaderDialog.url+'】路径下'" type="success"></el-alert>
                        </el-tab-pane>
                    </el-tabs>-->
                    <!-- 上传 -->
                    <uploader
                            ref="uploader"
                            :options="options"
                            :autoStart="true"
                            :file-status-text="statusText"
                            @file-added="onFileAdded"
                            @file-success="onFileSuccess"
                            @file-progress="onFileProgress"
                            @file-error="onFileError"
                            @file-complete="onFileComplete"
                            class="uploader-app">
                        <uploader-unsupport></uploader-unsupport>
                        <uploader-drop>
                            <p>将文件或文件夹拖到此处即可上传</p>
                            <uploader-btn>文件上传</uploader-btn>
                            <uploader-btn :directory="true" >文件夹上传</uploader-btn>
                        </uploader-drop>
                        <uploader-list></uploader-list>
                    </uploader>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button plain size="mini" class="large" @click="closeUpload">取 消</el-button>
                </div>
            </el-dialog>
            <!-- <el-dialog :close-on-click-modal="false" :title="dialogExcel.title"   width="650px" :visible.sync="dialogExcel.dialogFormVisible">
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
                 &lt;!&ndash;表格&ndash;&gt;
                 <el-table v-show="errorNumber>0" :stripe="true" :data="uploadData" style="margin-top: 10px">
                         <el-table-column prop="type" label="类型" sortable="custom" ></el-table-column>
                         <el-table-column prop="title" label="名称" sortable="custom" ></el-table-column>
                         <el-table-column prop="parentId" label="父id" sortable="custom" ></el-table-column>
                         <el-table-column prop="path" label="路径" sortable="custom" ></el-table-column>
                         <el-table-column prop="tag" label="标签" sortable="custom" ></el-table-column>
                         <el-table-column prop="description" label="描述" sortable="custom" ></el-table-column>
                         <el-table-column prop="address" label="位置" sortable="custom" ></el-table-column>
                         <el-table-column prop="adminId" label="创建人i" sortable="custom" ></el-table-column>
                         <el-table-column prop="adminName" label="创建人名" sortable="custom" ></el-table-column>
                         <el-table-column prop="level" label="应用级别" sortable="custom" ></el-table-column>
                         <el-table-column prop="score" label="评分" sortable="custom" ></el-table-column>
                         <el-table-column prop="createTime" label="创建时间" sortable="custom" ></el-table-column>
                         <el-table-column prop="isDelete" label="回收站；" sortable="custom" ></el-table-column>
                         <el-table-column prop="updateTime" label="上次修改" sortable="custom" ></el-table-column>
                         <el-table-column prop="openTime" label="上次打开" sortable="custom" ></el-table-column>
                         <el-table-column prop="remark" label="说明" sortable="custom" ></el-table-column>
                 </el-table>
             </div>
                 <div v-if="dialogExcel.title=='导入'">
                     <el-upload class="lead-in-th"
                                style="border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #4dbd73 ;"
                                :action="uploadUrl"
                                :headers="headers"
                                multiple
                                :show-file-list="false"
                                :on-success="handleSysFileSuccess"
                                :before-upload="beforeSysFileUpload">
                         <div class="" style="width: 440px;height: 50px;">导入</div>
                     </el-upload>
                     <div class="lead-in-th" @click="exportSysFileModule('upsertForm')" style="border:1px #4dbd73 solid;text-align: center;line-height: 50px;border-radius: 5px;margin-top:30px;color: #fff ;background-color: #51c993">下载模板</div>
                 </div>
             </el-dialog>
             &lt;!&ndash;选择字段导出&ndash;&gt;
             <el-dialog :close-on-click-modal="false"  :title="exportDialogExcel.title"  width="650px" :visible.sync="exportDialogExcel.dialogFormVisible">
                <div style="height: 400px;overflow-y: auto;width: 100%" >
                    &lt;!&ndash;表格&ndash;&gt;
                    <el-table border :stripe="true" :data="tableFieldData" style="margin-top: 20px" @selection-change="changeTableFieldFun"  >
                        <el-table-column type="selection" fixed="left" width="40"></el-table-column>
                        <el-table-column prop="key" label="英文字段名" ></el-table-column>
                        <el-table-column prop="name" label="中文字段名" ></el-table-column>
                        <el-table-column prop="newName" label="重命名字段" >
                            <template slot-scope="scope">
                                <el-input  placeholder="重命名字段" maxlength="20" size="mini" v-model="tableFieldData[scope.$index].newName"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                 <div slot="footer" class="dialog-footer">
                     <el-button plain size="mini" @click="exportDialogExcel.dialogFormVisible = false">取 消</el-button>
                     <el-button plain size="mini" icon="el-icon-download"  type="success" @click="exportSysFileByField">确认导出</el-button>
                 </div>
             </el-dialog>-->
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import fileDownload from "js-file-download";
    import noData from '@/components/noData/noData';
    var uploaderDom
    export default {
        name: "sysFile",
        components: { noData },
        data() {
            return {
                fileList3: [],
                fileData:'',
                show:2,
                searchForm:{
                      type: '',
                      title: '',
                      parentId: '',
                      path: '',
                      tag: '',
                      description: '',
                      address: '',
                      adminId: '',
                      adminName: '',
                      level: '',
                      score: '',
                      createTime: '',
                      isDelete: '0',
                      updateTime: '',
                      openTime: '',
                      remark: '',
                    pager:{
                        sortField:'create_time',
                        sortOrder:'desc',
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
                tableData: [],
                upsertForm:{
                        id:'',
                        type:'',
                        title:'',
                        parentId:'',
                        path:'',
                        tag:'',
                        description:'',
                        address:'',
                        adminId:'',
                        adminName:'',
                        level:'',
                        score:'',
                        createTime:'',
                        isDelete:'0',
                        updateTime:'',
                        openTime:'',
                        remark:'',
                        refilePath:''
                },
                searchRules: {
                          type: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          title: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          parentId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          path: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          tag: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          description: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          address: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          adminId: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          adminName: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          level: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          score: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          createTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          isDelete: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          updateTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          openTime: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          remark: [
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                },
                rules: {
                          type: [
                                  { required: true, message: '请输入类型', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          title: [
                                  { required: true, message: '请输入名称', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
                          path: [
                                  { required: true, message: '请输入路径', trigger: 'blur' },
                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
                              ],
//                          tag: [
//                                  { required: true, message: '请输入标签', trigger: 'blur' },
//                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
//                              ],
//                          level: [
//                                  { required: true, message: '请输入应用级别', trigger: 'blur' },
//                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
//                              ],
//                          score: [
//                                  { required: true, message: '请输入评分', trigger: 'blur' },
//                                  {  max: 32, message: '长度必须少于32个字符', trigger: 'blur' }
//                              ],
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加'
                },
                uploadVisible:false,
                headers: {
                    token: this.$store.getters.getToken
                },
                rowData: [],
                cnt: '',
                successCnt: '',
                errorNumber: '',
//                headers: {
//                    token: this.$store.getters.getToken
//                },
                uploadData: [],
                uploadUrl: `${home}/sysFile/importByExcel`,
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
                treeList:[],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                parentName:'',
                parentId:'',
                issueTypeMap:['目录','文件'],
                issueTypeMapList:[
                    {value: '0', label: '目录'},
                    {value: '1', label: '文件'},
                ],
                lookVisible:false,
                uploaderDialog:{
                    visible:false,
                    title:'文件夹上传',
                    url:''
                },
                options: {
                    target: `${home}/upload/uploadFiles`, // 目标上传 URL
                    chunkSize: '204800000',   //分块大小
                    fileParameterName: 'file', //上传文件时文件的参数名，默认file
                    maxChunkRetries: 3,  //最大自动失败重试上传次数
                    testChunks: false,     //是否开启服务器分片校验
                    // 服务器分片校验函数，秒传及断点续传基础
//                    checkChunkUploadedByResponse: function (chunk, message) {
//                        let objMessage = JSON.parse(message);
//                        if (objMessage.skipUpload) {
//                            return true;
//                        }
//                        return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
//                    },
                    headers: {
                        token: this.$store.getters.getToken
                    },
                    query :{
                        'MultipartFile':[],
                        parentId:''
                    },
                },
                statusText: {
                    success: "上传成功",
                    error: "上传失败",
                    uploading: "上传中",
                    paused: "暂停中",
                    waiting: "等待中"
                },
                panelShow: false,   //选择文件后，展示上传panel
                scrollHeight:'0px',

            }
        },
        created(){
            this.getTreeList();
            /*this.$nextTick(() => {
                window.uploader = this.$refs.uploader.uploader
            })*/
        },
        mounted(){
            let findBtn=document.querySelector('#findBtn');
            findBtn&&this.submit();
            this.scrollHeight = window.innerHeight*0.8 + 'px';
        },
        methods: {
            getTreeList(){
                axios({
                    url: `${home}/sysFile/findSysFileListTree`,
                    method: "GET",
                }).then(res => {
                    this.treeList = res.data;
                });
            },
            handleNodeClick(node) {
                this.parentId = node.id;
                this.parentName = node.title;
                this.submit();
            },
            submit(){
                if(this.parentId){
                    this.searchForm.parentId=this.parentId;
                }
                axios({
                    url:`${home}/sysFile/findSysFilesByCondition`,
                    method:'POST',
                    data:this.searchForm
                }).then(res=>{
                    if(res.data.length===0&&this.searchForm.pager.page>1&&res.totalCount>0){
                        this.searchForm.pager.page--;
                        this.submit();
                    }else{
                        this.tableData=res.data;
                        this.searchForm.pager.totalCount=res.data2;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            showAddDialog(){
                this.dialog.dialogFormVisible = true;
                this.dialog.title = '增加';
                objUtil.setToDefault(this.upsertForm);
                this.$nextTick(() => {
                    this.$refs.upsertForm.clearValidate();
                });
                if(!this.parentId){
                    this.parentName = "根节点";
                }
            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        if(!this.parentId){
                            this.upsertForm.parentId = "-1";
                        }else{
                            this.upsertForm.parentId = this.parentId;
                        }
                        this.upsertForm.isDelete = '0';
                        axios({
                            url:`${home}/sysFile/${this.dialog.title==='增加'?'saveSysFile':'update/updateSysFile'}`,
                            method:'POST',
                            data:this.upsertForm
                        }).then(res=>{
                            this.$message({
                                message: this.dialog.title+'成功',
                                type: 'success'
                            });
                            this.dialog.dialogFormVisible = false;
                            this.submit();
                            this.getTreeList();
                        }).catch(error=>{
                            //do something
                        })
                    }
                })
            },
            showAddUpload(){
                this.uploaderDialog.visible = true;
                // 清空文件列表
                this.$nextTick(() => {
                    uploaderDom = this.$refs.uploader
                })
                uploaderDom.fileList = [];
            },
            handleClick(tab, event) {
                axios({
                    url:`${home}/sysDataImpListAjj/uploaderData/-1`,
                    method:'GET',
                }).then(res=>{
                    this.uploaderDialog.url = res.data;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            uploaderFiles(){
                this.$confirm('请核对地址['+this.uploaderDialog.url+']是否有实体文件?', '提示', {
                    confirmButtonText: '核对成功',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url:`${home}/sysDataImpListAjj/uploaderFiles`,
                        method:'POST',
                        data:{
                            "xmh":'-1',
                            "catalogId":this.catalogId
                        }
                    }).then(res=>{
                        this.$message({
                            type: "success",
                            message: "扫描成功"
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(() => {

                });

            },
            closeUpload(){
                this.uploaderDialog.visible = false;
            },
            onFileComplete() {
                if(!this.parentId){
                    this.parentId=-1
                }
                axios({
                    url:`${home}/sysFile/reloadDirByparentId/${this.parentId}`,
                    method:'GET',
                }).then(res=>{
                    this.$message({
                        type: "success",
                        message: "上传成功"
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //出错
            onFileError(rootFile, file, response, chunk) {
            },
            //上传成功
            onFileSuccess(rootFile, file, response, chunk) {
//                JSON.parse(response).data.map((cmap, index) => {
//                    console.log(cmap);
//                    console.log("当前文件路径"+cmap.url);
//                    this.reDelRePath(cmap.url);
//                    return cmap;
//                })

            },
            //文件进度的回调
            onFileProgress(rootFile, file, chunk) {
            },
            //添加文件到列表 还未上传
            onFileAdded(file) {
                this.panelShow = true;
                console.log('wj',file);
//                this.options.query.parentId='';
                if(this.parentId =='-1'){
                    this.options.query.parentId='';
                }else{
                    this.options.query.parentId=this.parentId;
                }
                this.options.query.MultipartFile = this.options.query.MultipartFile.push(file.relativePath);
                console.log(this.options.query.MultipartFile);
            },
            //关闭上传列表
            close() {
                this.panelShow = false;
            },
            handleImport(file, fileList) {
                this.fileList3 = fileList
            },
            upload(){
                axios({
                    method:"POST",
                    url: `${home}/upload/uploadFile`,
                    data:that.fileData,
                    contentType: false,//这里不要落下
                    dataType: 'json',
                    headers:this.headers,// { "Content-Type": "multipart/form-data"},//其他需要追加到请求头的信息也可放入这里，我司需要追加一个token以做身份校验，同时利用表单上传Content-Type必须设置为multipart/form-data
                }).then((res)=>{
                    let code =res.data.code
                    if(code==200){
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch((response)=>{
                    this.$message.error(response.msg);
                })
            },
            // 点击上传按钮
            submitUpload(params) {
                if(this.fileList3.length==0){
                    this.$message.error('请选择文件')
                    return
                }
                this.fileData = new FormData();
                this.$refs.upload.submit();
                var that = this;
                this.upload();
            },
            reDelRePath(refilePath){
                this.upsertForm.refilePath=refilePath
                axios({
                    method:"POST",
                    url: `${home}/sysFile/reDelRePath `,
                    data:this.upsertForm
                }).then((res)=>{
                    let code =res.data.code
                    if(code==200){
                        this.$message({
                            type: 'success'
                        });
                    }
                }).catch((response)=>{
//                    this.$message.error(response.msg);
                })
            },

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
                this.getTreeList();
            },
            sizeChange(pageSize){
                this.searchForm.pager.pageSize=pageSize;
                this.submit();
                this.getTreeList();
            },
            currentChange(page){
                this.searchForm.pager.page=page;
                this.submit();
                this.getTreeList();
            },
            showUpdateDialog(id){
                axios({
                    url:`${home}/sysFile/update/findSysFileById/${id}`,
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
            deleteData(id){
                this.$confirm('删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `${home}/sysFile/deleteSysFile/${id}`,
                        method: 'GET',
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.submit();
                        this.getTreeList();
                    }).catch(error => {

                    })
                }).catch(() => {

                });

            },

            clear(){
                this.$refs['searchForm'].resetFields();
            },
            toLook($event,id){
                this.lookVisible=true;
                axios({
                    url:`${home}/sysFile/look/lookSysFileById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm,res.data);
                }).catch(error=>{
                    console.log(error);
                })
            },
            leadingInSysFile() {
                this.dialogExcel.dialogFormVisible = true;
                this.dialogExcel.title = '导入';
            },
            exportSysFile() {
                axios({
                    url: `${home}/sysFile/exportSysFile`,
                    method: "POST",
                    data: this.searchForm,
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysFile.xls");
                });
            },
            exportSysFileModule() {
                axios({
                    url: `${home}/sysFile/exportSysFileModule`,
                    method: "GET",
                    responseType: "arraybuffer"
                }).then(res => {
                    fileDownload(res, "sysFile模板.xls");
                });

            },
            handleSysFileSuccess(res, file) {
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
            beforeSysFileUpload(file) {
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
                        url: `${home}/sysFile/batchDeleteSysFile`,
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
            exportSysFileDialog(){
                axios({
                    url: `${home}/sysFile/getSysFileTableField`,
                    method: "GET",
                }).then(res => {
                    this.tableFieldData = res.data;
                    this.exportDialogExcel.dialogFormVisible = true;
                    this.exportDialogExcel.title = '导出选择字段';
                    this.exportDialogExcel.id = this.id;
                });

            },
            exportSysFileByField() {
                if(this.fieldData.length<=0 ){
                    this.$message({
                        type: "error",
                        message: "请选择需要导出的字段!"
                    });
                }else{
                    this.excelParam.data = this.searchForm;
                    this.excelParam.excelExportList = this.fieldData;
                    axios({
                        url: `${home}/sysFile/exportSysFileByField`,
                        method: "POST",
                        data: this.excelParam,
                        responseType: "arraybuffer"
                    }).then(res => {
                        fileDownload(res, "sysFile.xls");
                    });
                }

            },
        }
    }
</script>
<style lang="scss" scoped>
   .sysFile{
       width: 100%;
       height: 100%;
       padding: 10px;
       box-sizing: border-box;
   }
</style>

