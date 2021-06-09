<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>权限树</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="showAddDialog($event,'-1')">添加根节点</el-button>
            </div>
            <el-tree
                    @node-drop="handleDrop"
                    :props="defaultProps"
                    :data="perms"
                    :draggable="!!$store.getters.getPermByIdentify('sysPerm-update')"
                    node-key="id"
                    :default-expanded-keys="openKeys"
                    :expand-on-click-node="false">
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <template>
                          <span><i :class="data.icon"></i>{{node.label}}</span>
                        </template>
                        <span >
                          <el-button type="text" size="mini" @click="() => appendChild(data)">添加子节点</el-button>
                          <el-button type="text" size="mini" @click="() => updatePerm(data)">编辑</el-button>
                          <el-button type="text" size="mini" @click="() => deleteData(data.id,data.parentId)">删除</el-button>
                        </span>
                      </span>
            </el-tree>
        </el-card>
        <!--添加或者修改表单-->
        <el-dialog :close-on-click-modal="false" :title="dialog.title"  width="650px" :visible.sync="dialog.dialogFormVisible">
            <el-form class="upsertForm" :model="upsertForm" :rules="rules" ref="upsertForm" label-width="80px" :inline="true">
                <input type="hidden" :value="upsertForm.id">
                <input type="hidden" :value="upsertForm.parentId"/>
                <el-form-item label="权限名称" prop="title">
                    <el-input size="mini" v-model="upsertForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识" prop="identify">
                    <el-input size="mini"  v-model.trim="upsertForm.identify" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon" >
                    <el-input size="mini"  class="icon"  :readonly="true" v-model="upsertForm.icon" auto-complete="off"></el-input>
                    <i v-if="upsertForm.icon" :class="'iconfont '+upsertForm.icon" @click="openIconDialog"></i>
                    <i v-else class="iconfont icon-addition" @click="openIconDialog"></i>
                </el-form-item>
                <el-form-item label="路由名称" prop="routeName">
                    <el-input size="mini" v-model.trim="upsertForm.routeName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="urlPath" ref="urlPath">
                    <el-input size="mini" v-model.trim="upsertForm.urlPath" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortNum" ref="sortNum">
                    <el-input size="mini" v-model.trim="upsertForm.sortNum" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="所属模块">-->
                <!--<el-select size="mini" filterable v-model="upsertForm.moduleType" >-->
                <!--<el-option key="0" label="其他" value="0"></el-option>-->
                <!--<el-option key="1" label="汇交" value="1"></el-option>-->
                <!--<el-option key="2" label="档案" value="2"></el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="权限类型" prop="type">
                    <el-select size="mini" filterable v-model="upsertForm.type" @change="changeType"  >
                        <el-option key="0" label="菜单" value="0"></el-option>
                        <el-option key="1" label="按钮" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="dialog.title=='增加'&&dialog.showAutoBtn" label="生成按钮" prop="autoBtn" style="width:200px;">
                    <el-checkbox v-model="upsertForm.autoBtn"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialog.dialogFormVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveOrUpdate('upsertForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--选择图标窗口-->
        <icon-dialog ref="iconDialog" v-on:setIcon="setIcon($event)"></icon-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import iconDialog from '../../../components/icon/iconDialog'
    export default {
        name: "sysPerm",
        components:{
            iconDialog
        },
        data() {
            return {
                iconDialog:{
                    visible:false,
                    iconList:[]
                },
                perms: [],
                openKeys:[],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                dialog:{
                    dialogFormVisible:false,
                    title:'增加',
                    showAutoBtn:true
                },
                upsertForm:{
                    id:'',
                    title:'',
                    identify:'',
                    icon:'',
                    parentId:'',
                    type:'0',
                    autoBtn:true,
                    routeName:'',
                    urlPath:'',
                    sortNum:'',
                    moduleType: '',
                },
                rules: {
                    title: [
                        { required: true, message: '请输入权限名称', trigger: 'blur' }
                    ],
                    identify: [
                        { required: true, message: '请输入唯一标识', trigger: 'blur' }
                    ],
                    urlPath:[
                        { required: true, message: 'URL路径', trigger: 'blur' }
                    ],
                    moduleType:[
                        { required: true, message: '所属模块', trigger: 'blur' }
                    ]

                }
            }
        },
        created(){
            this.loadPerms();
        },
        methods: {
            setIcon(name){
                this.upsertForm.icon=name;
            },
            openIconDialog(){
                this.$refs.iconDialog.show();
            },
            changeType(){
                if(this.upsertForm.type=='1'){
                    this.rules.urlPath=[{ required: true, message: 'URL路径', trigger: 'blur' }];
                }else{
                    this.$refs.urlPath.clearValidate();
                    delete this.rules.urlPath;
                }
                if(this.dialog.title=='增加'){
                    if(this.upsertForm.type=='0'){
                        this.dialog.showAutoBtn=true;
                    }else{
                        this.dialog.showAutoBtn=false;
                    }
                }
            },
            loadPerms(id){
                axios({
                    url:`${home}/sysPerm/findAllTreeMenu`,
                    method:'GET'
                }).then(res=>{
                    this.perms=res.data;
                    this.openKeys = [id];
                }).catch(error=>{

                })
            },
            showAddDialog(e,pId){
                this.dialog.dialogFormVisible=true;
                this.dialog.title='增加';
                objUtil.setToDefault(this.upsertForm);
                this.upsertForm.type='0';
                this.upsertForm.parentId=pId;
                this.upsertForm.autoBtn=true;
                this.$nextTick(()=>{
                    this.changeType();
                })
            },
            appendChild({id:id}){
                this.showAddDialog(undefined, id);
            },
            updatePerm({id:id}){
                this.showUpdateDialog(id);
            },
            showUpdateDialog(id){
                axios({
                    url:`${home}/sysPerm/findSysPermById/${id}`,
                    method:'GET'
                }).then(res=>{
                    Object.assign(this.upsertForm, res.data);
                    this.dialog.dialogFormVisible=true;
                    this.dialog.title = '修改';
                    this.$nextTick(()=>{
                        this.changeType();
                    })
                }).catch(error=>{

                })

            },
            saveOrUpdate(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){

                        axios({
                            url:`${home}/sysPerm/${this.dialog.title==='增加'?'saveSysPerm':'updateSysPerm'}`,
                            method:'POST',
                            data:this.upsertForm
                        }).then(res=>{
                            this.$message({
                                message: this.dialog.title+'成功',
                                type: 'success'
                            });
                            this.dialog.dialogFormVisible = false;
                            this.loadPerms(this.upsertForm.id?this.upsertForm.id:this.upsertForm.parentId);
                        }).catch(error=>{
                            //do something
                        })


                    }
                })
            },
            deleteData(id,parentId){
                this.$confirm('删除吗?删除将删除底下所有子节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        url: `${home}/sysPerm/deleteSysPermRecursive/${id}`,
                        method: 'GET'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.loadPerms(parentId);
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
                    url:`${home}/sysPerm/findSysPermsByCondition`,
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
            handleDrop(draggingNode, dropNode, dropType, ev) {
                axios({
                    url:`${home}/sysPerm/updateSysPerm`,
                    method:'POST',
                    data:Object.assign(draggingNode.data,{parentId:dropType==='inner'?dropNode.data.id:dropNode.data.parentId})
                })
            },

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