<template>
    <el-cascader @input="input" :options="addr" v-model="value" @active-item-change="openNext" @change="changeRegion"   :props="props" v-bind="propObj"></el-cascader>
</template>

<script>
    function getRegionNameById(regions,id) {
        for (let i = 0; i < regions.length; i++) {
            const province = regions[i];
            if(province.id==id){
                return province.name;
            }else{
                for (let j = 0; j < province.children.length; j++) {
                    const city = province.children[j];
                    if(city.id==id){
                        return city.name;
                    }else{
                        for (let k = 0; k < city.children.length; k++) {
                            const district = city.children[k];
                            if(district.id==id){
                                return district.name;
                            }
                        }
                    }
                }
            }
        }
    }
    import axios from 'axios'
    export default {
        name: "regionSelect",
        props:{
            path:{
                type:Array,
                default:()=>[]
            },
            separator:'/',
            'popper-class':undefined,
            placeholder:'请选择',
            disabled:false,
            clearable:false,
            'expand-trigger':'click',
            'show-all-levels':true,
            filterable:undefined,
            debounce:300,
            'change-on-select':false,
            size:undefined,
            'before-filter':undefined
        },
        data(){
            return {
                addr:[],
                props: {
                    value: 'id',
                    label:'name'
                },
                value:[]
            }
        },
        computed:{
            propObj(){
                return {
                    separator:this.separator,
                    'popper-class':this["popper-class"],
                    placeholder:this.placeholder,
                    disabled:this.disabled,
                    clearable:this.clearable,
                    'expand-trigger':this["expand-trigger"],
                    'show-all-levels':this["show-all-levels"],
                    filterable:this.filterable,
                    debounce:this.debounce,
                    'change-on-select':this["change-on-select"],
                    size:this.size,
                    'before-filter':this["before-filter"]
                }
            }
        },
        created(){
            this.value=this.path;
            if(this.path.length!==0){
                if(this.path.length!==3){
                    throw Error("path length should be 3")
                }
                axios({
                    url:`${home}/region/findRegionForCascade/${this.path[0]+','+this.path[1]}`,
                    method:'GET'
                }).then(res=>{
                    this.addr=res.data;
                })
            }else{
                this.queryRegion();
            }

        },
        methods:{
            queryRegion(id,index1,index2){
                axios({
                    url:`${home}/region/findRegionsById/${id}`,
                    method:'GET'
                }).then(res=>{
                    if(res.data[0].levelType<3){
                        res.data.forEach(item=>{
                            item.children=[];
                        })
                    }
                    if(index1==undefined&&index2==undefined){
                        this.addr=res.data;
                    }else if(index1!=undefined&&index2==undefined){
                        this.addr[index1].children=res.data;
                    }else if(index1!=undefined&&index2!=undefined){
                        this.addr[index1].children[index2].children=res.data;
                    }
                })
            },
            openNext(path) {
                let index1,index2;
                if(path.length===1){//点击第一级
                    for (let i = 0; i < this.addr.length; i++) {
                        const item = this.addr[i];
                        if(item.id==path[0]){
                            index1=i;
                            break;
                        }
                    }
                    if(this.addr[index1].children.length===0){
                        this.queryRegion(path[0],index1,undefined);
                    }
                }else if(path.length===2){//点击第二季
                    for (let i = 0; i < this.addr.length; i++) {
                        const item = this.addr[i];
                        let found=false;
                        for (let j = 0; j < item.children.length; j++) {
                            const child = item.children[j];
                            if(child.id==path[1]){
                                found=true;
                                index1=i;
                                index2=j;
                                break;
                            }
                        }
                        if(found){
                            break;
                        }
                    }
                    if(this.addr[index1].children[index2].children.length===0){
                        this.queryRegion(path[1],index1,index2);
                    }
                }else{//点击第三极没有
                }
            },
            changeRegion(path){
                /*this.value.provinceId=path[0];
                this.value.cityId=path[1];
                this.value.districtId=path[2];
                this.value.provinceName=getRegionNameById(this.addr,path[0]);
                this.value.cityName=getRegionNameById(this.addr,path[1]);
                this.value.districtName=getRegionNameById(this.addr,path[2]);*/

            },
            input(){
                this.$emit('input', [
                    {
                        id:this.value[0],
                        name:getRegionNameById(this.addr,this.value[0])
                    },
                    {
                        id:this.value[1],
                        name:getRegionNameById(this.addr,this.value[1])
                    },
                    {
                        id:this.value[2],
                        name:getRegionNameById(this.addr,this.value[2])
                    }
                ]);
            }
        }
    }
</script>

