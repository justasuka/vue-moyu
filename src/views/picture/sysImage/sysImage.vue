<template>
    <div class="sysImage">
            <div class="header">
                <div style="float: left">
                    <el-breadcrumb style="margin: 1rem 3rem 0" separator="/" >
                        <el-breadcrumb-item><a style="font-size: 1rem" @click="breadcrumbindex()">图库</a></el-breadcrumb-item>
                        <!--<el-breadcrumb-item style="color: #151313a6">{{ this.item.path }}</el-breadcrumb-item>-->
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" style="color: #151313a6"><a @click="breadcrumbFind(index)">{{ item }}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div style="float: right" class="topMenu" v-show="toolActive!=='动态'">
                    <div style="width: 150px;margin:5px 10px;float: left">
                        <el-slider :show-tooltip="false" v-model="imgSize"  :format-tooltip="formatTooltip" v-show="isBlockOrList"></el-slider>
                    </div>
                    <div class="menuIcon" :style="changeBlockOrList(true)" @click="isBlockOrList = true">
                        <img src="../../../assets/img/menu_icon_block.png" />
                    </div>
                    <div class="menuIcon" :style="changeBlockOrList(false)" @click="isBlockOrList = false">
                        <img src="../../../assets/img/menu_icon_list.png"/>
                    </div>
                    <el-popover placement="bottom" trigger="hover" popper-class="popperStyle">
                        <div>
                            <el-radio-group v-model="photoListSearchForm.pager.sortField" style="border-bottom: 1px rgba(0,0,0,0.1) solid;" class="selectRank" @change="changePhotoList()">
                                <div><el-radio label="type,title">文件名称</el-radio></div>
                                <div style="margin-top: 5px"><el-radio label="type,size">文件大小</el-radio></div>
                                <div style="margin-top: 5px"><el-radio label="type,create_time">创建时间</el-radio></div>
                            </el-radio-group>
                            <div></div>
                            <el-radio-group v-model="photoListSearchForm.pager.sortOrder" class="selectRank" @change="changePhotoList()">
                                <div style="padding-top: 5px"><el-radio label="asc,asc">升序</el-radio></div>
                                <div style="margin-top: 5px"><el-radio label="asc,desc">降序</el-radio></div>
                            </el-radio-group>
                        </div>
                        <div class="menuIcon" slot="reference">
                            <img src="../../../assets/img/menu_icon_rank.png">
                        </div>
                    </el-popover>
<!--                    <div class="menuIcon" >-->
<!--                        <img src="../../../assets/img/menu_icon_rank.png">-->
<!--                    </div>-->
                </div>
            </div>
            <div style="height: 100%;">
                <ul class="box" ref="box">
                    <li class="left" ref="left">
                        <div class="leftBlock" style="display: inline-block">
                            <div class="menu">
                                <header><img src="../../../assets/img/index_icon.png" style="height: 12px;width: 12px"><span style="padding-left: 5px">目录</span></header>
                                <el-tree
                                        :data="menuData"
                                        :props="defaultProps"
                                        @node-click="handleNodeClick"
                                        :filter-node-method="filterNode"
                                        node-key="id"
                                        :highlight-current="true"
                                        style="padding-left: 2rem" ref="tree">
                                    <span class="custom-tree-node" slot-scope="{ node, data }">
                                        <span><img src="../../../assets/img/file_icon_mini.png"/>&nbsp;{{ node.label }}</span>
                                    </span>
                                </el-tree>
                            </div>
                            <div class="toolMenu">
                                <header>工具栏</header>
                                <div :style="toolNav('动态')" @click="toToolPage('动态')"><img src="../../../assets/img/tool_menu_active.png"><span>动态</span></div>
                                <div :style="toolNav('回收站')" @click="toToolPage('回收站')"><img src="../../../assets/img/tool_menu_delete.png"><span>回收站</span></div>
<!--                                <div :style="toolNav('收藏')" @click="toToolPage('收藏')"><img src="../../../assets/img/tool_menu_collect.png"><span>收藏</span></div>-->
                            </div>
                        </div>
                    </li>
                    <li class="resize" ref="resize"></li>
                    <li class="mid" ref="mid">
                        <div class="centerBlock" style="display: inline-block">
                            <header v-show="toolActive!=='动态'&&toolActive!=='回收站'">
                                <el-form :inline="true" class="searchLine">
                                    <el-form-item>
                                        <el-input
                                            placeholder="搜索"
                                            prefix-icon="el-icon-search"
                                            size="mini"
                                            v-model="photoListSearchForm.title"
                                            @keyup.enter.native="changePhotoList">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="标签">
                                        <el-select v-model="photoListSearchForm.tag" placeholder="请选择" size="mini" @change="changePhotoList()">
                                            <el-option label="全部" value=""></el-option>
                                            <el-option
                                                v-for="item in tagOptions"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                                <span style="float: left">{{ item.name }}</span>
                                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="形状">
                                        <el-select v-model="photoListSearchForm.shape" placeholder="请选择" size="mini" @change="changePhotoList()">
                                            <el-option label="全部" value=""></el-option>
                                            <el-option
                                                v-for="item in shapeOptions"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                                <span style="float: left">{{ item.name }}</span>
                                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="后缀">
                                        <el-select v-model="photoListSearchForm.suffix" placeholder="请选择" size="mini" @change="changePhotoList()">
                                            <el-option label="全部" value=""></el-option>
                                            <el-option
                                                v-for="item in suffixOptions"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                                <span style="float: left">{{ item.name }}</span>
                                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </header>
                            <div class="blockStyle" v-show="isBlockOrList&&toolActive!=='动态'">
                                <p v-for="item in tableData" :key="item.id" @click="clickPicture(item)" @dblclick="dbclickItem(item)">
                                    <el-image v-if="item.type==='2'" :src="config.resPre+item.path+'?width=100&height=100'"  :style="`width: ${100+imgSize}px; height: ${100+imgSize}px`" fit="cover" lazy></el-image>
                                    <el-image v-if="item.type==='0'" :src="require('../../../assets/img/file_icon.jpg')"  :style="`width: ${100+imgSize}px; height: ${100+imgSize}px`" fit="cover" lazy></el-image>
                                    <span :style="`width: ${100+imgSize}px; height: ${(100+imgSize)/5}px;line-height: ${(100+imgSize)/5}px; top:${(100+imgSize)*4/5}px;font-size:${(100+imgSize)/10}px;border-radius:0px 0px ${(100+imgSize)/20}px ${(100+imgSize)/20}px;`">{{ item.title }}</span>
                                </p>
                                <p @click="getMore" v-if="this.photoListSearchForm.pager.totalCount>(this.photoListSearchForm.pager.page*30)">
                                    <el-image :src="require('../../../assets/img/more_icon.png')"  :style="`width: ${100+imgSize}px; height: ${100+imgSize}px`" fit="cover"></el-image>
                                </p>
                                <el-image-viewer
                                    v-if="showViewer"
                                    :on-close="()=>{this.showViewer=false}"
                                    :url-list="viewerList"
                                />
                            </div>
                            <div class="listStyle" v-show="!isBlockOrList&&toolActive!=='动态'">
                                <el-table
                                    :data="tableData"
                                    style="width: 100%"
                                    @row-click="clickPicture"
                                    @row-dblclick="dbclickItem">
                                    <el-table-column
                                        width="75">
                                        <template slot-scope="scope">
                                            <el-image v-if="scope.row.type==='2'" :src="config.resPre+scope.row.path+'?width=100&height=100'" style="height: 50px;width: 50px" fit="cover"></el-image>
                                            <el-image v-if="scope.row.type==='0'" :src="require('../../../assets/img/file_icon.jpg')" style="height: 50px;width: 50px" fit="cover"></el-image>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="文件名称"
                                        prop="title">
                                    </el-table-column>
                                    <el-table-column
                                        prop="size"
                                        label="文件大小"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createTime"
                                        label="创建时间"
                                        width="250">
                                    </el-table-column>
                                </el-table>
                                <el-divider @click="getMore" v-if="this.photoListSearchForm.pager.totalCount>(this.photoListSearchForm.pager.page*30)">点击加载更多</el-divider>
                            </div>
                            <div class="activePage" v-show="toolActive==='动态'">
                                <el-table
                                    :data="activeData"
                                    style="width: 100%"
                                    :default-sort = "{prop: 'time', order: 'descending'}" >
                                    <el-table-column
                                        label="时间"
                                        prop="createTime"
                                        width="180"
                                        sortable>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作者"
                                        prop="adminName"
                                        width="180"
                                        sortable>
                                    </el-table-column>
                                    <el-table-column
                                        prop="operation"
                                        label="操作"
                                        sortable
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="comment"
                                        label="详细信息">
                                    </el-table-column>
                                </el-table>
                                <div class="pageCurrent">
                                    <el-pagination
                                        @current-change="handleCurrentChange"
                                        :current-page.sync="allLogSearchForm.pager.page"
                                        :page-size="allLogSearchForm.pager.pageSize"
                                        layout="prev, pager, next, jumper"
                                        :total="allLogSearchForm.pager.totalCount">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="resize2" ref="resize2"></li>
                    <li class="right" ref="right" v-if="toolActive!=='动态'" style="height: 100%;">
                        <el-tabs tab-position="top"  @tab-click="clickTab" v-model="rightActive" >
                            <el-tab-pane name="详细信息" label="详细信息">
                                <div class="information" >
                                    <el-image v-show="item.type === '2'&&!showRecycleMsg" :src="config.imgPre+item.path" fit="contain" style="width: 270px;height: 140px;background: #ccc;margin-top: 15px"></el-image>
                                    <el-image v-show="showRecycleMsg||item.type === '0'" :src="require('../../../assets/img/file_icon.jpg')" fit="contain" style="width: 270px;height: 140px;background: #ccc;margin-top: 15px"></el-image>
                                    <div class="informationContent" v-show="!showRecycleMsg" >
                                        <el-input v-model="item.title" @blur="handleInputConfirm"></el-input>
                                        <div>标签：</div>
                                        <div>
                                            <el-tag
                                                :key="tag"
                                                v-for="tag in item.tags"
                                                closable
                                                :disable-transitions="false"
                                                style="margin-right: 10px;margin-left: 0"
                                                @close="handleClose(tag)">
                                                {{tag}}
                                            </el-tag>
                                            <el-input
                                                class="input-new-tag"
                                                v-if="inputVisible"
                                                v-model="inputValue"
                                                ref="saveTagInput"
                                                size="small"
                                                @keyup.enter.native="handleInputConfirm"
                                                @blur="handleInputConfirm"
                                                style="margin-left: 0"
                                            >
                                            </el-input>
                                            <el-button v-else style="margin-left: 0" class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                                        </div>
                                        <div>描述：</div>
                                        <el-input v-model="item.description" @blur="handleInputConfirm"></el-input>
                                        <div  v-show="item.type === '2'">宽度&#12288;&#12288;&#12288;&#12288;&#12288;：{{ item.width }}px</div>
                                        <div  v-show="item.type === '2'">高度&#12288;&#12288;&#12288;&#12288;&#12288;：{{ item.height }}px</div>
                                        <div  v-show="item.type === '2'">文件大小&#12288;&#12288;&#12288;：{{ item.size }}</div>
<!--                                        <div v-show="item.address">位置&#12288;&#12288;&#12288;&#12288;&#12288;：{{ item.address }}</div>-->
                                        <div v-show="item.adminName">上传者&#12288;&#12288;&#12288;&#12288;：{{ item.adminName }}</div>
                                        <div v-show="item.createTime">创建时间&#12288;&#12288;&#12288;：{{ item.createTime }}</div>
                                        <div v-show="item.updateTime">上次修改时间&#12288;：{{ item.updateTime }}</div>
                                        <div v-show="item.type === '2'&&item.shootingTime">拍摄时间&#12288;&#12288;&#12288;：{{ item.shootingTime }}</div>

                                    </div>

                                    <div class="informationContent" v-show="showRecycleMsg">
                                        <el-input v-model="recycleName" disabled></el-input>

                                    </div>
                                </div>
                                <div v-show="showRecycleMsg" style="position: absolute;bottom: 0;margin-left: 10px">
                                    <el-button v-display:img-deleteFile type="danger" @click="clearRecycleBin"><i class="el-icon-delete"></i>清空回收站</el-button>
                                </div>
                                <div v-show="!showRecycleMsg" style="position: absolute;bottom: 0;margin-left: 10px">
                                    <div class="button-group" style="width: 100%" size="mini">
                                        <div class="upload-button" v-display:img-upload v-if="toolActive!=='回收站'&&item.type==='0'" @click="showAddUpload">上传</div>
                                        <div class="download-button-1" v-display:img-download v-if="toolActive!=='回收站'" @click="downLoad(1)">下载</div>
                                        <div class="download-button-2" v-display:img-download v-if="toolActive!=='回收站'" @click="downLoad(0)">下载原图</div>

                                        <div class="download-button-2" v-if="toolActive==='回收站'" @click="deleteFile(1)">恢复文件</div>
                                        <div class="delete-button" v-display:img-deleteFile @click="deleteFile(0)">删除</div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane name="操作记录" v-if="!showRecycleMsg" label="操作记录">
                                <div class="activeLogs">
                                    <div v-for="log of item.logs" :key="log.id">
                                        <span class="logTime">{{ log.createTime }}</span>
                                        <div class="log">
                                            <el-avatar :size="25" icon="el-icon-user-solid"></el-avatar>
                                            <span class="logText">{{ log.comment }}</span>
                                        </div>
                                    </div>
									<el-divider class="logButton" v-if="logButton" @click="nextPage">点击加载更多</el-divider>
                                </div>
                            </el-tab-pane>
<!--                            <el-tab-pane name="成员管理">-->
<!--                                <span slot="label">-->
<!--                                    <el-tooltip class="item" effect="dark" content="成员管理" placement="left">-->
<!--                                        <div @click="openRightBlock('成员管理')"><i class="el-icon-s-custom"></i></div>-->
<!--                                    </el-tooltip>-->
<!--                                </span>-->
<!--                                <header class="rightHeader">-->
<!--                                    <span>成员管理</span>-->
<!--                                </header>-->
<!--                                <ul class="members">-->
<!--                                    <li v-for="item of 5" :key="item">-->
<!--                                        <div class="member">-->
<!--                                            <div class="avatar"><el-avatar icon="el-icon-user-solid"></el-avatar></div>-->
<!--                                            <p class="memberName">张三</p>-->
<!--                                            <p class="memberClass">管理员</p>-->
<!--                                        </div>-->
<!--                                    </li>-->
<!--                                </ul>-->
<!--                            </el-tab-pane>-->
                        </el-tabs>
                    </li>
                </ul>
            </div>
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
                    id="uploader"
                    :options="uploadOptions"
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
                        <uploader-btn :directory="true" style="margin-left: 10px">文件夹上传</uploader-btn>
                        <el-input v-model="newFolderName" v-show="showFolderNameInput" placeholder="请输入名称" size="mini" style="margin-left:10px;width: 100px"></el-input>
                        <el-button size="mini" class="newFolderBtn" v-show="!showFolderNameInput" @click="showFolderNameInput=true">新建文件夹</el-button>
                        <el-button size="mini" class="newFolderBtn" v-show="showFolderNameInput" @click="addFloder">确定</el-button>
                    </uploader-drop>
                    <uploader-list></uploader-list>
                </uploader>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="mini" class="large" @click="closeUpload">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

    import axios from 'axios';
    import fileDownload from "js-file-download";
    import noData from '../../../components/noData/noData';
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    let clickTime = null;
    let uploaderDom
    export default {
        name:'sysImage',
        components:{ noData,ElImageViewer},
        data(){
            return {
                recycleName:'回收站',
                showRecycleMsg:false,
                showFolderNameInput:false,
                newFolderName:'',
                viewerUrl:[],
                showViewer:false,
                uploadOptions: {
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
                uploaderDialog:{
                    visible:false,
                    title:'文件夹上传',
                    url:''
                },
                menuData: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                isShowRight:true,
                iconActive:'',
                searchInput:'',
                value1:'',
                options:[{value:123,label:123}],
                imgSize:0,
                tableData:[],
                isBlockOrList:true,
                topActive:'',
                item:{
                    id:'',
                    title:'',
                    tags:[],
                    content:'',
                    logs:[]
                },
                tagOptions:[],
                shapeOptions:[],
                suffixOptions:[],
                toolActive:'',
                activeData:[],
                config:config,
                rightActive:'详细信息',
                allLogSearchForm:{
                    fileId:'-1',
                    pager:{
                        sortField:"create_time",
                        sortOrder:"desc",
                        page:1,
                        pageSize:10,
                        totalCount:0
                    }
                },
				pictureLogPager:{
						sortField:"create_time",
						sortOrder:"desc",
						page:1,
						pageSize:20,
						totalCount:0
				},
                photoListSearchForm:{
                    address:'/',
                    title:'',
                    parentId:-99,
                    shape:'',
                    isDelete:'0',
                    suffix:'',
                    tag:'',
                    pager:{
                        sortField:'type,create_time',
                        sortOrder:'asc,desc',
                        like:'title',
                        page:1,
                        pageSize:30,
                        totalCount:0
                    }
                },
                breadcrumbList:[],
                inputVisible: false,
                inputValue: '',
                recycleIdList:[],
				logsLength:'',
				logsTotalCount:'',
				logButton:false,
                viewerList:[],
            }
        },
        mounted() {
            this.dragControllerDiv()
        },
        created() {
            this.getFileListTree()
            this.getPhotoList()
        },
        methods:{
            clearRecycleBin(){
                axios({
                    url:`${home}/sysFile/batchDeleteSysFile`,
                    method:'POST',
                    data:{
                        rowData:this.recycleIdList
                    }
                }).then(res=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.toToolPage('回收站')
                })
            },
            addFloder(){
                axios({
                    url:`${home}/sysFile/saveSysFile`,
                    method:'POST',
                    data:{
                        id:this.item.id,
                        title:this.newFolderName,
                        type:'0',
                        isDelete:'0',
                    }
                }).then(res=>{
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.showFolderNameInput = false
                    this.newFolderName = ''
                    this.uploaderDialog.visible = false
                }).catch(error=>{
                    //do something
                })
            },
            showAddUpload(){
                this.uploaderDialog.visible = true;
                // 清空文件列表
                this.$nextTick(() => {
                    uploaderDom = this.$refs.uploader.uploader
                })
                uploaderDom.cancel()
                // uploaderDom.fileList = [];
            },
            closeUpload(){
                this.uploaderDialog.visible = false;
                this.showFolderNameInput = false
                this.newFolderName = ''
            },
            onFileComplete() {
                console.log(this.item)
                axios({
                    url:`${home}/sysFile/reloadDirByparentId/${this.item.id}`,
                    method:'GET',
                }).then(res=>{
                    this.$message({
                        type: "success",
                        message: "上传成功"
                    });
                    this.getPhotoList()
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //出错
            onFileError(rootFile, file, response, chunk) {},
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
            onFileProgress(rootFile, file, chunk) {},
            //添加文件到列表 还未上传
            onFileAdded(file) {
                this.panelShow = true;
//                console.log('wj',file);
//                this.options.query.parentId='';
                if(this.item.id =='-1'){
                    this.uploadOptions.query.parentId='';
                }else{
                    this.uploadOptions.query.parentId=this.item.id;
                }

                this.uploadOptions.query.MultipartFile = this.uploadOptions.query.MultipartFile.push(file.relativePath);
//                console.log(this.options.query.MultipartFile);
            },
            getMore(){
                this.photoListSearchForm.pager.page += 1
                axios({
                    url: `${home}/sysFile/findSysFilesByCondition`,
                    method: "POST",
                    data:this.photoListSearchForm
                }).then(res => {
                    console.log('more',res)
                    this.tableData = this.tableData.concat(res.data)
                    const _self = this
                    res.data4.map(item=>{
                        _self.viewerUrl.push(config.imgPre+item)
                    })
                });
            },
            handleClose(tag) {
                this.item.tags.splice(this.item.tags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                console.log(this.inputValue,this.item.tags)
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.item.tags.push(inputValue);
                }
                this.updateFile()
                this.inputVisible = false;
                this.inputValue = '';
            },
            deleteFile(type){
                if(this.item.isDelete==='1'&&type===0){
                    axios({
                        url: `${home}/sysFile/deleteSysFile/${this.item.id}`,
                        method: "GET"
                    }).then(res=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRecycleBin()
                    })
                }else if(type===1){
                    axios({
                        url: `${home}/sysFile/update/updateSysFile`,
                        method: "POST",
                        data: {
                            id:this.item.id,
                            isDelete:'0'
                        }
                    }).then(res => {
                        this.getRecycleBin()
                    });
                }else if(type===0){
                    axios({
                        url: `${home}/sysFile/update/updateSysFile`,
                        method: "POST",
                        data: {
                            id:this.item.id,
                            isDelete:'1'
                        }
                    }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$refs["tree"].remove(this.item.id);
                        this.photoListSearchForm.address = this.photoListSearchForm.address.split('/').slice(0,-1).join('/')
                        console.log(this.photoListSearchForm.address)
                        this.changePhotoList()
                    }).then(res=>{
                        this.showRecycleMsg = false
                        this.item = this.tableData[0]
                    })
                }
            },
            updateFile(){
                this.item['tag'] = this.item.tags.toString()
                axios({
                    url: `${home}/sysFile/update/updateSysFile`,
                    method: "POST",
                    data: this.item
                }).then(res => {
                    console.log('updata',res)
                });
            },
            handleCurrentChange(val) {
                console.log(val)
                this.allLogSearchForm.pager.page = val
                this.getAllLogs()
            },
            clickTab(data){
                if(data.name==='操作记录'){
                    this.getPictureLog(this.item.id)
					this.item.logs = []
                }
				if(data.name==='详细信息'){
					this.item.logs = []
					this.pictureLogPager.page =1
				}
            },
            getAllLogs(){
                axios({
                    url: `${home}/sysFileLog/findSysFileLogListBySysFileId`,
                    method: "POST",
                    data:this.allLogSearchForm
                }).then(res => {
                    this.activeData = res.data
                    this.allLogSearchForm.pager.totalCount = res.totalCount
                });
            },
            getPictureLog(fileId){
                axios({
                    url: `${home}/sysFileLog/findSysFileLogListBySysFileId`,
                    method: "POST",
					data: {
						fileId:fileId,
						pager:this.pictureLogPager,
					}
                }).then(res => {
                	console.log(res)
                    this.item.logs.push.apply(this.item.logs,res.data);
                    this.logsLength = this.item.logs.length;
                    this.logsTotalCount = res.totalCount;
                    if(this.logsLength>=20) {
                    	this.logButton=true
					}
					if(this.logsLength===this.logsTotalCount) {
					    this.logButton=false
					}
                    this.$forceUpdate()
                });
            },
			//操作记录下一页
			nextPage(){
				this.pictureLogPager.page +=1;
//				console.log(this.pictureLogPager.pageSize);
				this.getPictureLog(this.item.id);
			},
            getRecycleBin(){
                this.rightActive = '详细信息'
                axios({
                    url: `${home}/sysFile/findSysFileListByCondition`,
                    method: "POST",
                    data:{
                        isDelete:'1',
                        pager:{}
                    }
                }).then(res => {
                    this.tableData = res.data
                    this.recycleIdList = []
                    this.tableData.map(item=>{
                        this.recycleIdList.push(item.id)
                    })
                    console.log(this.recycleIdList)
                    this.showRecycleMsg = true
                });
            },
            clickPicture(item){
                clearTimeout(clickTime);  //首先清除计时器
                clickTime = setTimeout(() => {
                    // to do something
                    this.showRecycleMsg = false
                    this.item = item
                    this.photoListSearchForm.address = this.item.path
                    this.rightActive = '详细信息'
                    console.log('page',this.photoListSearchForm.pager.page,this.photoListSearchForm.pager.totalCount)
                    console.log('item',item)
                }, 300);
            },
            async dbclickItem(item){
                clearTimeout(clickTime);
                if(this.toolActive==='回收站'){
                    return
                }
                if(await  item.type==='0'){
                    this.photoListSearchForm.address = item.path;
                    await this.getPhotoList();
                    // 展开节点
                    this.$nextTick(() => {
                        this.$refs["tree"].setCurrentKey(item.id);
                    });
                    this.expandNodes(this.$refs["tree"].store.nodesMap[item.id]);
                    this.breadcrumbList = item.path.substring(1).split('/');
                }else if(await item.type==='2'){
                    // this.viewerUrl = config.imgPre+item.path
                    this.viewerList = this.viewerUrl.slice(this.viewerUrl.indexOf(config.imgPre+item.path)).concat(this.viewerUrl.slice(0,this.viewerUrl.indexOf(config.imgPre+item.path)))
                    console.log(this.viewerUrl)
                    this.showViewer = true
                }
				this.rightActive = '详细信息'
            },
            // 展开父节点
            expandNodes(node){
                if(null !== node.parent){
                    this.expandNodes(node.parent);
                }
                node.expanded = true;
            },
            // 闭合子节点的子节点
            closeNodes(nodes){
                if(null !== nodes){
                    nodes.forEach(e=>{
                        this.closeNodes(e.childNodes)
                        e.expanded = false;
                    });
                }
            },
            filterNode(value, data) {
                console.log('d',value)
                if(data.children!==null){
                    return true
                }else{
                    return false
                }
            },
            changePhotoList(){
                this.photoListSearchForm.pager.page = 1
                axios({
                    url: `${home}/sysFile/findSysFilesByCondition`,
                    method: "POST",
                    data:this.photoListSearchForm
                }).then(res => {
                    console.log(res)
                    this.tableData = res.data
                });
            },
            getPhotoList(){
                this.photoListSearchForm.pager.page = 1
                this.photoListSearchForm.tag=null
                axios({
                    url: `${home}/sysFile/findSysFilesByCondition`,
                    method: "POST",
                    data:this.photoListSearchForm
                }).then(res => {
                    this.tableData = res.data
                    this.photoListSearchForm.pager.totalCount = res.data2
                    this.tagOptions = res.data3.tag
                    this.shapeOptions = res.data3.shape
                    this.suffixOptions = res.data3.suffix
                    const _self = this
                    this.viewerUrl = []
                    res.data4.map(item=>{
                        _self.viewerUrl.push(config.imgPre+item)
                    })
                });
            },
            getFileListTree(){
                axios({
                    url: `${home}/sysFile/findSysFileListTreeByRole`,
                    method: "GET",
                }).then(res => {
                    this.menuData = res.data
                    this.recycleIdList = false
                    this.item = this.menuData[0]
                });
            },
            toolNav(active){
                if(active===this.toolActive){
                    return 'background: rgba(100,100,100,0.1);'
                }
            },
            toToolPage(active){
                this.toolActive = active
                if(active==='动态'){
                    this.getAllLogs()
                }else if(active==='回收站'){
                    this.showRecycleMsg = true
                    this.getRecycleBin()
                }
            },
            changeBlockOrList(bool){
                if(bool===this.isBlockOrList){
                    return 'background-color: #b5e5ff;'
                }
            },
            formatTooltip(val){
                return val/2
            },
            downLoad(type) {
                axios({
                    url: `${home}/upload/downLoadDIROrFile/${type}`,
                    method: "POST",
                    data:this.item,
                    responseType: "arraybuffer"

                }).then(res => {
                    fileDownload(res, this.item.type==='0'?this.item.title+'.zip':this.item.title);
                });
            },
            handleNodeClick(data) {
                this.toolActive = ''
                this.rightActive = '详细信息'
                this.showRecycleMsg = false
                this.item = data;
                this.breadcrumbList = data.path.substring(1).split('/');
                this.photoListSearchForm.address = this.item.path
                this.getPhotoList();
				this.pictureLogPager.page = 1;
            },
            dragControllerDiv: function () {
                var resize = document.getElementsByClassName('resize');
                var resize2 = document.getElementsByClassName('resize2');
                var left = document.getElementsByClassName('left');
                var right = document.getElementsByClassName('right');
                var mid = document.getElementsByClassName('mid');
                var box = document.getElementsByClassName('box');

                for (let i = 0; i < resize.length; i++) {
                    resize[i].onmousedown = function (e) {
                        var startX = e.clientX;
                        resize[i].left = resize[i].offsetLeft;
                        document.onmousemove = function (e) {
                            var endX = e.clientX;
                            var rightW = right[i].offsetWidth;
                            var moveLen = resize[i].left + (endX - startX);
                            var maxT = box[i].clientWidth - resize[i].offsetWidth;
                            if (moveLen < 150) moveLen = 150;
                            if (moveLen > maxT - rightW - 150) moveLen = maxT - rightW - 150;
                            resize[i].style.left = moveLen;
                            for (let j = 0; j < left.length; j++) {
                                left[j].style.width = moveLen + 'px';
                                mid[j].style.width = (box[i].clientWidth - moveLen - rightW - 10) + 'px';
                                right[j].style.width = rightW + 'px';
                            }
                        };
                        document.onmouseup = function (evt) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize[i].releaseCapture && resize[i].releaseCapture();
                        };
                        resize[i].setCapture && resize[i].setCapture();
                        return false;
                    }
                }
                for (let i = 0; i < resize2.length; i++) {
                    resize2[i].onmousedown = function (e) {
                        var startX = e.clientX;
                        resize2[i].left = resize2[i].offsetLeft;
                        document.onmousemove = function (e) {
                            var endX = e.clientX;
                            var leftW = left[i].offsetWidth;
                            var moveLen = resize2[i].left + (endX - startX) - leftW;
                            var maxT = box[i].clientWidth - resize2[i].offsetWidth - 5;
                            if (moveLen < 150) moveLen = 150;
                            if (moveLen > maxT - leftW - 150) moveLen = maxT - leftW - 150;

                            resize2[i].style.left = moveLen;
                            for (let j = 0; j < right.length; j++) {
                                mid[j].style.width = moveLen + 'px';
                                right[j].style.width = (box[i].clientWidth - moveLen - leftW - 10) + 'px';
                                left[j].style.width = leftW + 'px';
                            }
                        };
                        document.onmouseup = function (evt) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize2[i].releaseCapture && resize2[i].releaseCapture();
                        };
                        resize2[i].setCapture && resize2[i].setCapture();
                        return false;
                    }
                }
            },
            breadcrumbFind(index) {
                let path = '/' + this.breadcrumbList.slice(0,index+1).join('/');
                this.photoListSearchForm.pager.page = 1

                axios({
                    url: `${home}/sysFile/findSysFilesByCondition`,
                    method: "POST",
                    data:{'isDelete':0,'address':path,'parentId':-99,'pager':this.photoListSearchForm.pager}
                }).then(res => {
                    this.tableData = res.data
                    this.photoListSearchForm.pager.totalCount = res.data2
                    this.tagOptions = res.data3.tag
                    this.shapeOptions = res.data3.shape
                    this.suffixOptions = res.data3.suffix
                    // 高亮
                    let pid = res.data[0].parentId;
                    this.$nextTick(() => {
                        this.$refs["tree"].setCurrentKey(pid);
                    });
//                    this.expandNodes(this.$refs["tree"].store.nodesMap[pid]);
                    // 闭合子节点的子节点
                    this.closeNodes(this.$refs["tree"].store.nodesMap[pid].childNodes)
                    this.breadcrumbList = this.breadcrumbList.slice(0,index+1);
                });
            },
            breadcrumbindex(){
                axios({
                    url: `${home}/sysFile/findSysFilesByCondition`,
                    method: "POST",
                    data:{'isDelete':0,'parentId':-1,'pager':this.photoListSearchForm.pager}
                }).then(res => {
                    this.tableData = res.data
                    this.tagOptions = res.data3.tag
                    this.shapeOptions = res.data3.shape
                    this.suffixOptions = res.data3.suffix
                    // 高亮
                    let pid = res.data[res.data2-1].id;
                    this.$nextTick(() => {
                        this.$refs["tree"].setCurrentKey(pid);
                    });
//                    this.expandNodes(this.$refs["tree"].store.nodesMap[pid]);
                    // 闭合子节点的子节点
                    this.closeNodes(this.$refs["tree"].store.nodesMap.childNodes)
//                    this.breadcrumbList = this.breadcrumbList.slice(0,index+1);
                });
            },
        },
    }
</script>
<style lang="scss">
.sysImage{
    height: calc(100% - 65px);
    width: 100%;
    .el-main{
        padding:0px;
    }
    .el-slider__button{
        border: solid 2px #69c9fc;
    }

    .el-form-item__label{
        color: #5f6368;
    }
    ul,li{
        list-style: none;
        //display: block;
        margin:0;
        padding:0;
    }
    .box{
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .left{
        width:calc(20% - 10px);
        height:100%;
        float:left;
        min-width: 150px;
    }
    .resize{
        width:5px;
        height:100%;
        cursor: w-resize;
        float:left;
    }
    .resize2{
        width:5px;
        height:100%;
        cursor: w-resize;
        float:left;
    }
    .right{
        float:left;
        width:20.5%;
        height:100%;
    }
    .rightMenu{
        float:right;
        width:50px;
        height:100%;
    }
    .mid{
        float:left;
        width:59.5%;
        height:100%;
    }
    .el-tabs{
        height: 100%;

    }
    .el-tabs__content {
        overflow: hidden;
        position: relative;
        height: calc(100% - 60px);
    }
    #pane-操作记录{
        height: 100%;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background: rgba(100,100,100,0.1);
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
}
</style>
<style lang="scss" scoped>
    .header{
        height: 44px;
        border-bottom: solid 1px rgba(0,0,0,0.1);
    }
    .popperStyle{
        /deep/.el-popover{
            min-width: 100px !important;
            width: 100px !important;
        }
    }
    .topMenu{
        width: 400px;
        .menuIcon{
            float: left;
            height: 40px;
            width: 40px;
            border-radius:50%;
            text-align: center;
            margin: 2px 5px;
            background: #e5f6ff;
            cursor: pointer;
            img{
                height: 25px;
                width: 25px;
                margin: 7.5px;
            }
        }
        .menuIcon:hover{
            background: #b5e5ff;
        }
        .selectRank{
            >div{
                padding: 5px;
            }
            /deep/{
                .el-radio{
                    .el-radio__label{
                        color: #888888 !important;
                    }
                    .el-radio__input{
                        &.is-checked {
                            .el-radio__inner{
                                background-color:#69c9fc;
                                border-color:#69c9fc;
                            }
                        }
                        .el-radio__inner{
                            &:hover{
                                border-color:#69c9fc;
                            }
                        }
                    }
                }
                .popper__arrow {
                    border-bottom-color: #303133;
                }
                .el-tooltip__popper {
                    background: #FFFFFF;
                    border: solid rgba(255,255,255,0.28);
                }
            }
        }

    }
    .pageCurrent{
        li{
            display: inline;
        }
    }
    .leftBlock{
        height: 100%;
        width: 100%;
        border-right: solid 1px rgba(0,0,0,0.1);
        .menu{
            border-bottom: solid 1px rgba(0,0,0,0.1);
            >header{
                color: rgba(136, 144, 160, 1);
                font-size: 12px;
                padding-left: 27px;
                line-height: 30px;
                height: 30px;
                /* white-space: nowrap; */
                min-width: 160px;
            }
        }
        .toolMenu{
            border-bottom: solid 1px rgba(0,0,0,0.1);
            >header{
                color: rgba(136, 144, 160, 1);
                font-size: 12px;
                padding-left: 27px;
                line-height: 30px;
                height: 30px;
                /* white-space: nowrap; */
                min-width: 160px;
            }
            >div{
                padding-left: 2rem;
                font-size: 14px;
                height: 40px;
                cursor: pointer;
                line-height: 40px;
                img{
                    height: 14px;
                    width: 14px;
                }
                span{
                    padding-left: 5px;
                }

            }
            >div:hover{
                background: rgba(100,100,100,0.1);
            }
        }
    }
    .centerBlock{
        height: 100%;
        width: 100%;
        font-size: 16px;
        border-right: solid 1px rgba(0,0,0,0.1);
        >header{
            //height: 40px;
            width: 100%;
            border-bottom: solid 1px rgba(0,0,0,0.1);
            .searchLine{
                .el-form-item{
                    height: 32px;
                }
                .el-input{
                    width: 150px;
                    padding-left: 5px;
                }
                .el-select{
                    min-width: 40px;
                    width: 100px;
                }
            }

        }
        .listStyle{
            max-height:calc(100% - 41px);
            overflow: auto;
            /deep/.el-divider{
                cursor: pointer;
            }
        }
        .blockStyle{
            max-height:calc(100% - 41px);
            overflow: auto;
            >p{
                margin: 10px 10px;float: left;
                position: relative;
                border-radius:5%;
                .el-image{
                    border-radius:5%;
                }
                span{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    position: absolute;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    background: #ffffff;
                    opacity: 0.8;
                }
                .el-image:hover{
                    box-shadow: 0px 0px 6px #888888;
                }
            }
        }
    }
    .rightBlock{
        border-left: solid 1px rgba(0,0,0,0.1);
        height: 100%;
        width: 100%;
        >header{
            height: 40px;
            text-align: center;
            border-bottom: solid 1px rgba(0,0,0,0.1);
            background: #ffffff;
            z-index: 1;
            >span{
                float: left;
                margin: 0.5rem 0.5rem;
            }
            >i{
                float: right;
                margin: 0.75rem 0.75rem;
                color: rgba(0,0,0,0.5);
                cursor: pointer;
            }
        }
    }
    .activePage{
        max-height:calc(100% - 41px);
        overflow: auto;
    }
    .rightButton{
        >div{
            height: 40px;
            width: 40px;
            cursor: pointer;
            border-radius:50%;
            margin: 10px 5px;
            text-align: center;
            background: #e5f6ff;
            img{
                height: 25px;
                width: 25px;
                padding-top: 40px;
            }
        }
    }
    .information{
        height: calc(100% - 41px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-left: 15px;
        padding-right: 15px;
        .informationContent{
            >div{
                font-size: 12px;
                color: rgb(95, 99, 104);
                padding-top: 10px;
            }
        }
    }
    .activeLogs{
        height: calc(100% - 41px);
        overflow-y: auto;
        padding-left: 15px;
        padding-right: 15px;

        .logTime{
            font-size: 12px;
            color: #999999;
        }
        .log{
            position: relative;
            padding-top: 8px;
            word-break: break-all;
            /deep/.el-avatar{
                position: absolute;
                left: 0;
                top: 8px;
                line-height: 24px;
                font-size: 14px;
            }
            .logText{
                display: block;
                padding-left: 36px;
                line-height: 25px;
                min-height: 40px;
                color:rgb(102, 102, 102);
                font-size: 12px;
            }
        }
		.logButton{
			margin-top: 10px;
			float: right;
            cursor: pointer;
		}
    }
    .newFolderBtn{
        margin-left: 10px;
        display: inline-block;
        position: relative;
        padding: 4px 8px;
        font-size: 100%;
        line-height: 1.4;
        color: #666;
        border: 1px solid #666;
        cursor: pointer;
        border-radius: 2px;
        background: none;
        outline: none;
        &:hover {
            background-color: rgba(0,0,0,.08);
        }
    }
    .members{
        border-left: solid 1px rgba(0,0,0,0.1);
        height: calc(100% - 41px);
        overflow-y: auto;
        overflow-x: hidden;
        padding-left: 15px;
        padding-right: 15px;
        >li{
            margin-bottom: 5px;
            position: relative;
            margin-left: -15px;
            margin-right: -15px;
            .member{
                line-height: 24px;
                padding: 5px 15px;
                .avatar{
                    position: absolute;
                    left: 15px;
                    top: 8px;
                }
                .memberName{
                    position: relative;
                    height: 18px;
                    left: 10px;
                    margin-top: 5px;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 18px;
                    padding-left: 40px;
                }
                .memberClass{
                    position: relative;
                    left: 10px;
                    font-size: 12px;
                    padding-left: 40px;
                    margin-top: -10px;
                    margin-bottom: 0;
                    color: #999;
                    opacity: 0.5;
                    line-height: 18px;
                }
            }
        }
    }

    .button-group{
        .upload-button{
            background-image: url('../../../assets/img/upload_button.png');
            background-size:cover;
            height: 40px;
            width: 54px;
            color: #fff;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            float: left;
            &:hover{
                background-image: url('../../../assets/img/upload_button_hover.png');
                cursor: pointer;
            }
        }
        .download-button-1{
            background-image: url('../../../assets/img/download_button_1.png');
            background-size:cover;
            height: 40px;
            width: 54px;
            color: #fff;
            line-height: 40px;
            text-align: center;
            float: left;
            font-size: 14px;
            margin-left: 1px;
            &:hover{
                cursor: pointer;
                background-image: url('../../../assets/img/download_button_1_hover.png');
            }
        }
        .download-button-2{
            background-image: url('../../../assets/img/download_button_2.png');
            background-size:cover;
            height: 40px;
            width: 80px;
            line-height: 40px;
            color: #fff;
            text-align: center;
            float: left;
            margin-left: 1px;
            font-size: 14px;
            &:hover{
                cursor: pointer;
                background-image: url('../../../assets/img/download_button_2_hover.png');
            }
        }
        .delete-button{
            background-image: url('../../../assets/img/delete_button.png');
            background-size:cover;
            height: 40px;
            line-height: 40px;
            width: 54px;
            color: #fff;
            text-align: center;
            float: left;
            margin-left: 1px;
            font-size: 14px;
            &:hover{
                cursor: pointer;
                background-image: url('../../../assets/img/delete_button_hover.png');
            }
        }
    }
</style>