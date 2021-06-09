<template>
    <el-dialog class="iconDialog"   title="选择图标"  :fullscreen="true" style="height:100%;" :visible.sync="visible">
        <ul class="icon-list">
            <li v-for="item in iconList" @click="setIcon(item)">
                <i :class="'iconfont '+item"></i>
                <p>iconfont</p>
                <p>{{item}}</p>
            </li>
        </ul>
    </el-dialog>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "iconDialog",
        data(){
            return {
                visible:false,
                iconList:[]
            }
        },
        created(){
            axios({
                url:`${home}/iconfont/getIconfontCss`,
                method:'GET'
            }).then(res=>{
                this.iconList=res.data;
            })
        },
        mounted(){

        },
        methods:{
            setIcon(name){
                this.visible=false;
                this.$emit('setIcon',`iconfont ${name}`);
            },
            show(){
                this.visible=true;
            },
            hide(){
                this.visible=false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon-list{
        padding: 20px 100px;
        list-style: none;
        overflow: hidden;
        margin: 0;
        >li{
            cursor: pointer;
            text-align: center;
            float: left;
            padding: 10px 20px;
            border-radius: 5px;
            width:130px;
            height: 80px;
            >.iconfont{
                font-size: 30px;
                margin-bottom: 5px;
                display: inline-block;
            }
            p{
                margin: 0;
            }
        }
        >li:hover{
            background-color: teal;
            >.iconfont{
                color:white;
            }
            >p{
                color:white;
            }
        }
    }
    .iconDialog /deep/ .el-dialog__body{
        height:calc(100% - 114px);
        overflow: auto;
    }
</style>