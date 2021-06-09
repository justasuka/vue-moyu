<template>
  <div class="nodata" :style="{padding: paddingSize+ 'px 0'}">
    <img :src="src" alt="">
    <p>{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无数据~'
    },
    paddingSize: {
      type: Number,
      default: 50
    },
		src:{
			type:String,
			default:require('../../assets/frame/images/emp_icon.png')
		}
  }
}
</script>
<style scoped lang="scss">
.nodata {
  width: 100%;
  text-align: center;
  img {
    width: 150px;
  }
  p {
    font-size: 16px;
    color: #999;
  }
}
</style>
