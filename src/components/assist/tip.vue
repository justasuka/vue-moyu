<template>
        <el-popover class="tip-wrapper" :trigger="trigger" :width="width"  :placement="placement" :content="content">
            <i slot="reference"  :class="icon==='warn'?'iconfont icon-prompt_fill':'iconfont icon-feedback_fill'"></i>
        </el-popover>
</template>

<script>
    /**
     * 用于页面上的提示，图标加鼠标移入弹出提示
     */
    export default {
        name: "tip",
        props:{
            trigger:{type:String,default:'hover'},
            width:{type:Number,default:30},
            placement:{type:String,default:'right'},
            content:{
                type:String,
                default: '温馨提示!'
            },
            icon:{
                type:String,
                default: 'warn'
            },//warn or question
        }
    }
</script>

<style scoped lang="scss">
    .iconfont{
        font-size: 22px;
        cursor: pointer;
    }
    .icon-prompt_fill{
        color:#ee6042;
    }
    .tip-wrapper{
        display: inline-block;
        vertical-align: middle;
        >.iconfont{
            font-weight: normal;
            position:relative;
            top:-0.1rem;
        }
    }
</style>