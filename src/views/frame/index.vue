<template>
    <div class="index">
        <header class="index-header" :class="bgCheck" :style="{background:bgColor}">
            <span class="index-logo" :style="{background:bgColor}">
                <img :src="logoSrc" style="height: 40px;" />
            </span>
            <i class="iconfont index-fold " :class="{'icon-list-collapsed':!collapse,'icon-list-expand-copy':collapse}" @click="fold"></i>
            <el-menu
                    class="barMenu"
                    :default-active="activeBarIndex"
                    mode="horizontal"
                    @select="clickBarMenu"
                    :background-color="bgColor"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <template v-for="menu in barData" >
                    <el-submenu v-if="!!menu.children" :index="menu.identify">
                        <template slot="title">
                            <i :class="menu.icon"></i>
                            <span>{{menu.title}}</span>
                        </template>
                        <template v-for="subMenu in menu.children">
                            <!--暂时只到二级-->
                            <el-menu-item  :index="subMenu.identify">
                                <i :class="subMenu.icon"></i>
                                <span slot="title">{{subMenu.title}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :index="menu.identify">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.title}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
            <ul class="index-oper">
                <li>
                    <div class="index-fix">
                        <i class="el-icon-info" style="color: #fff" ></i>
                        <a class="table-look" style="color: #fff" @click="dialogVisible=true">流程向导</a>
                    </div>
                </li>
                <li>
                    <el-dropdown  @command="sysMenu" style="margin-right: -15px">
                        <div class="index-fix">
                            <div class="el-dropdown-link" style="color: #fff;">
                               <span style="display: block;float: left;text-align: center;margin: auto;padding: 5px">
                                   <el-image v-if="imgUrl" style="height: 40px;width: 40px;border-radius: 100%;" :src="config.resPre+imgUrl" :preview-src-list="[config.resPre+imgUrl]"></el-image>
                                   <el-image v-else style="height: 40px;width: 40px;border-radius: 100%;" :src="defaultFaceImg" :preview-src-list="[defaultFaceImg]"></el-image>
                               </span>
                                <span style="display: block;float: right">
                                    {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                            </div>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="personalSetting">
                                <i class="iconfont icon-kehuqunzu"></i>
                                用户配置
                            </el-dropdown-item>
                            <el-dropdown-item command="logout">
                                <i class="iconfont icon-tuichu1"></i>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li>
                    <el-dropdown  @command="sysMenu">
                        <div class="index-fix">
                            <i class="el-icon-circle-close" style="font-size: 30px;color: #fff;margin-top: 12px"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                    command="closeOther">
                                <i class="iconfont icon-delete"></i>
                                关闭其他
                            </el-dropdown-item>
                            <el-dropdown-item command="closeAll">
                                <i class="iconfont icon-cuowu"></i>
                                关闭全部
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>

                <el-color-picker v-model="theme" class="theme-picker" :predefine="predefineColors"  popper-class="theme-picker-dropdown"></el-color-picker>
            </ul>
        </header>
        <aside class="index-aside" :style="{width:asideW}">

            <el-menu
                    :unique-opened="true"
                    :default-active="activeMenuIndex"
                    class="el-menu-vertical-demo"
                    @select="clickAsideMenu"
                    background-color="#222d32"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :collapse="collapse"
                    :collapse-transition="false"
            >
                <template v-for="menu in menuData" >
                    <el-submenu v-if="!!menu.children&&menu.children.length>0" :index="menu.identify">
                        <template slot="title">
                            <i :class="menu.icon"></i>
                            <span>{{menu.title}}</span>
                        </template>
                        <template v-for="subMenu in menu.children">
                            <el-submenu v-if="!!subMenu.children&&subMenu.children.length>0" :index="subMenu.identify">
                                <!--暂时只到三级-->
                                <template slot="title">
                                    <i :class="subMenu.icon"></i>
                                    <span>{{subMenu.title}}</span>
                                </template>
                                <template v-for="thirdMenu in subMenu.children">
                                    <el-menu-item  :index="thirdMenu.identify">
                                        <i :class="thirdMenu.icon"></i>
                                        <span slot="title">{{thirdMenu.title}}</span>
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                            <el-menu-item v-else  :index="subMenu.identify">
                                <i :class="subMenu.icon"></i>
                                <span slot="title">{{subMenu.title}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :index="menu.identify">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.title}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </aside>
        <main class="index-main" :style="{left:asideW}">
            <el-tabs class="index-tab" v-model="activeTabIndex" closeable  type="border-card" @edit="handleTabsEdit"
                     @tab-click="clickTab">
                <el-tab-pane
                        :key="item.index"
                        v-for="item in mainTabs"
                        :label="item.title"
                        :name="item.index"
                        :closable="item.index=='a'?false:true"
                >
                </el-tab-pane>
            </el-tabs>
            <div class="index-page">
                <keep-alive max="10" :include="includeRoute" :exclude="excludeRoute">
                    <router-view v-on:clearCache="clearCache"></router-view>
                </keep-alive>
            </div>
        </main>
        <el-dialog :close-on-click-modal="false" title="个人设置"  :fullscreen="true"   :visible.sync="personalDialog.show">
            <personal  v-if="personalDialog.show" :visible.sync="personalDialog.show" ></personal>
        </el-dialog>
        <el-dialog title="流程向导" :visible.sync="dialogVisible" width="30%">
      <span>
        提示：您可以按照如下操作完成整条流程，点击按钮快速进入对应页面
        <div class="liu">
          <!--<el-button type="primary" @click="clickIndexMenu('sysTimeSet','时间设置','sysTimeSet')" plain>时间设置</el-button>-->
          <!--<br/>-->
          <!--<i class="iconfont icon-xiangxiajiantoucuxiao"></i>-->
          <!--<br/>-->
        </div>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import axios from 'axios';
    import personal from './personal';
    const ORIGINAL_THEME = "#409EFF";
    //    import primary from '../../element-variables.scss'
    const version = require("element-ui/package.json").version; // 版本号
    function findMenuByIdentify(menuData, identify) {
        for (let i = 0; i < menuData.length; i++) {
            const item = menuData[i];
            if(item.identify==identify&&(!item.children||item.children.length===0)){
                return item;
            }else if(item.children){
                const r= findMenuByIdentify(item.children, identify);
                if(r){
                    return r;
                }
            }
        }
        return undefined;

    }
    function findMenuByRouteName(menuData, routeName) {
        for (let i = 0; i < menuData.length; i++) {
            const item = menuData[i];
            if(item.routeName==routeName&&!item.children){
                return item;
            }else if(item.children){
                const r= findMenuByRouteName(item.children, routeName);
                if(r){
                    return r;
                }
            }
        }
        return undefined;

    }
    let historyClick=true;//表示用户点击了浏览器的后腿或者前进按钮
    export default {
        name:'index',
        components: {personal},
        data() {
            return {
                bgCheck:{
                    'background':"fff"
                },
                chalk: "",
                theme:ORIGINAL_THEME,
                predefineColors: [
                    "#282f32",
                    "#409EFF",
                    "#ff4500",
                    "#ff8c00",
                    "#ffd700",
                    "#90ee90",
                    "#00ced1",
                    "#1e90ff",
                    "#c71585",
                    "rgba(255, 69, 0, 0.68)",
                    "rgb(255, 120, 0)",
                    "hsv(51, 100, 98)",
                    "hsva(120, 40, 94, 0.5)",
                    "hsl(181, 100%, 37%)",
                ],
                username:'',
                imgUrl:'',
                personalDialog:{
                    show:false
                },
                config:config,
                includeRoute:[],
                color: '#7DAEFC',
                excludeRoute:['editor'],//不用缓存页面
                activeBarIndex:'a',
                barData:[
                    {
                        title:'主页',
                        identify:'a',
                        routeName:'door'
                    },
                ],
                visible: false,
                top: 0,
                left: 0,
                collapse: false,
                menuData:[],
                activeMenuIndex:'',
                asideW: '180px',
                activeTabIndex: '0',
                mainTabs: [],
                bgColor:'#7DAEFC',
                defaultFaceImg:require('../../assets/frame/images/blacksan.jpg'),
                dialogVisible:false,
                logoSrc: require('../../assets/logo.png'),
            };
        },
        created(){

            this.findUserInfo();
            if(!this.$store.getters.getToken){
                this.returnToLogin();
                return;
            }
            axios({
                url:`${home}/sysPerm/findAdminTreeMenu`,
                method:'GET'
            }).then(res=>{
                this.menuData=res.data;
            }).catch(error=>{

            })
        },
        mounted(){
            this.$store.getters.getToken&&document.querySelector('.barMenu>li:first-child').click();
            if(this.CheckIsColor(localStorage.getItem('colorPicker'))){
                this.theme=localStorage.getItem('colorPicker');
                this.bgCheck.background = this.theme.toString()
            }
        },
        watch: {
            theme(val, oldVal) {
                if (typeof val !== "string") return;
                localStorage.setItem('colorPicker',val)
                this.bgColor=val
                const themeCluster = this.getThemeCluster(val.replace("#", ""));
                const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
                const getHandler = (variable, id) => {
                    return () => {
                        const originalCluster = this.getThemeCluster(
                            ORIGINAL_THEME.replace("#", "")
                        );
                        const newStyle = this.updateStyle(
                            this[variable],
                            originalCluster,
                            themeCluster
                        );

                        let styleTag = document.getElementById(id);
                        if (!styleTag) {
                            styleTag = document.createElement("style");
                            styleTag.setAttribute("id", id);
                            document.head.appendChild(styleTag);
                        }
                        styleTag.innerText = newStyle;
                    };
                };

                const chalkHandler = getHandler("chalk", "chalk-style");

                if (!this.chalk) {
                    const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
                    this.getCSSString(url, chalkHandler, "chalk");
                } else {
                    chalkHandler();
                }

                const styles = [].slice
                    .call(document.querySelectorAll("style"))
                    .filter(style => {
                        const text = style.innerText;
                        return (
                            new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
                        );
                    });
                styles.forEach(style => {
                    const { innerText } = style;
                    if (typeof innerText !== "string") return;
                    style.innerText = this.updateStyle(
                        innerText,
                        originalCluster,
                        themeCluster
                    );
                });

            }
        },
        beforeRouteUpdate(to, from, next) {
            next();
            if(!historyClick){
                historyClick=true;
                return;
            }
            const item = findMenuByRouteName(this.menuData, to.name)||findMenuByRouteName(this.barData, to.name);
            if(item){
                this.activeMenuIndex=this.activeBarIndex=item.identify;
                const targetTab=this.mainTabs.find(t=>{
                    if(t.index==item.identify){
                        return t;
                    }
                });
                targetTab||this.mainTabs.push({
                    title: item.title,
                    index: item.identify,
                    routeName: item.routeName
                })
                this.activeTabIndex=item.identify;

            }

            historyClick=true;
        },
        methods: {
            //获取个人信息
            findUserInfo(){
                axios({
                    url:`${home}/admin/ignore/findMySelf`,
                    method:'GET'
                }).then(res=>{
                    this.username=res.data.username;
                    this.imgUrl = res.data.portrait;
//                    Object.assign(this.upsertForm,res.data);
                })
            },
            returnToLogin(){
                this.$router.replace('/login');
            },
            clearCache(routeName){//接受到子组件清空缓存的消息
                this.removeIncludes(routeName);
            },
            sysMenu(command){
                if(command==='logout'){//登出
                    this.$confirm('确定退出吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$store.commit('clearStore');
                        this.returnToLogin();

                    });

                }
                else if(command==='personalSetting'){
                    this.personalDialog.show=true;
                }else if (command === 'closeAll') {
                    if(this.mainTabs.length>1){
                        this.mainTabs= [];
                    }
                    this.$router.push({
                        name: 'door'
                    })
                } else if (command === 'closeOther') {
                    let tabs = this.mainTabs;
                    this.mainTabs = tabs.filter(tab => {
                        return tab.index == this.activeTabIndex ||tab.index=='a'
                    });

                }else {
                    var len = this.mainTabs.length;
                    console.log(this.mainTabs.splice(1,len),"this.mainTabs");
                    this.$router.push({
                        name:'door'
                    })
                    return true;
                    this.mainTabs = [];
                }

            },
            fold: function () {
                if (this.collapse) {
                    this.asideW = '180px';
                } else {
                    this.asideW = '64px';
                }
                this.collapse = !this.collapse;
            },
            clickBarMenu(key,keyPath){
                const targetMenu=findMenuByIdentify(this.barData,key);
                targetMenu&&this.handleTabsEdit(key,'add',targetMenu.title,targetMenu.routeName);
            },
            clickAsideMenu(key, keyPath){
                const targetMenu=findMenuByIdentify(this.menuData,key);
                targetMenu&&this.handleTabsEdit(key,'add',targetMenu.title,targetMenu.routeName);
            },
            clickTab(tab, event) {
                //这里的tab.name等同于index
                const menuItem = findMenuByIdentify(this.menuData, tab.name);
                const barItem = findMenuByIdentify(this.barData, tab.name);
                this.routerPush(menuItem?menuItem.routeName:barItem?barItem.routeName:'');
                this.activeMenuIndex=this.activeBarIndex=tab.name;

            },
            handleTabsEdit(tabIndex,action,title,routeName) {
                if (action === 'add') {
                    if(!routeName){
                        this.$alert('请配置路由名称!','提示');
                        return;
                    }
                    let has=this.mainTabs.some((tab)=>{
                        if(tab.index==tabIndex){
                            return true;
                        }
                    });
                    has||this.mainTabs.push({
                        title: title,
                        index: tabIndex,
                        routeName: routeName
                    });
                    this.activeTabIndex =this.activeMenuIndex=this.activeBarIndex= tabIndex;
                    this.routerPush(routeName);
                }else if (action === 'remove') {
                    let tabs = this.mainTabs;
                    let activeTabIndex = this.activeTabIndex;
                    let closeingTab;
                    this.mainTabs = tabs.filter(tab => {
                        if(tab.index !== tabIndex){
                            return true;
                        }else{
                            closeingTab=tab;
                            return false;
                        }
                    });
                    this.removeIncludes(closeingTab.routeName);
                    if (activeTabIndex === tabIndex) {
                        let nextTab;
                        tabs.find((tab, index) => {
                            if (tab.index == tabIndex) {
                                nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeTabIndex = nextTab.index;
                                }
                                return tab;
                            }
                        });
                        this.activeTabIndex =this.activeMenuIndex=this.activeBarIndex= activeTabIndex;
                        this.routerPush(nextTab.routeName);

                    }
                }
            },
            removeIncludes(routeName){
                const i = this.includeRoute.indexOf(routeName);
                if(i!==-1){
                    this.includeRoute.splice(i, i);
                }
            },
            addIncludes(routeName){
                this.includeRoute.indexOf(routeName)===-1&&this.includeRoute.push(routeName);
            },
            routerPush(routeName){
                historyClick=false;
                this.addIncludes(routeName);
                this.$router.push({
                    name:routeName
                });
            },
            CheckIsColor(bgVal) {
                if(bgVal){
                    var type = "^#[0-9a-fA-F]{6}$";
                    var re = new RegExp(type);
                    if (bgVal.match(re) == null) {
                        type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$";
                        re = new RegExp(type);
                        if (bgVal.match(re) == null) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            },
            updateStyle(style, oldCluster, newCluster) {
                let newStyle = style;
                oldCluster.forEach((color, index) => {
                    newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
                });
                return newStyle;
            },
            //跳转数据中心
            goDataCenter:function(){
                let newpage = this.$router.resolve({
                    name:'home'
                })
                window.open(newpage.href, '_blank');
            },
            goReport(){
                let newpage = this.$router.resolve({
                    name:'groupfinancialstatement'
                })
                window.open(newpage.href, '_blank');
            },
            getCSSString(url, callback, variable) {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "");
                        callback();
                    }
                };
                xhr.open("GET", url);
                xhr.send();
            },

            getThemeCluster(theme) {
                const tintColor = (color, tint) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    if (tint === 0) {
                        // when primary color is in its rgb space
                        return [red, green, blue].join(",");
                    } else {
                        red += Math.round(tint * (255 - red));
                        green += Math.round(tint * (255 - green));
                        blue += Math.round(tint * (255 - blue));

                        red = red.toString(16);
                        green = green.toString(16);
                        blue = blue.toString(16);

                        return `#${red}${green}${blue}`;
                    }
                };

                const shadeColor = (color, shade) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    red = Math.round((1 - shade) * red);
                    green = Math.round((1 - shade) * green);
                    blue = Math.round((1 - shade) * blue);

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    return `#${red}${green}${blue}`;
                };

                const clusters = [theme];
                for (let i = 0; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
                }
                clusters.push(shadeColor(theme, 0.1));
                return clusters;
            },
            openMenu(tag, e) {
                const menuMinWidth = 105;
                const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
                const offsetWidth = this.$el.offsetWidth // container width
                const maxLeft = offsetWidth - menuMinWidth // left boundary
                const left = e.clientX - offsetLeft + 15 // 15: margin right

                if (left > maxLeft) {
                    this.left = maxLeft
                } else {
                    this.left = left
                }

                this.top = e.clientY
                this.visible = true
                this.selectedTag = tag
            },
            closeMenu() {
                this.visible = false
            },
            clickIndexMenu(key,title,name) {
                this.dialogVisible = false;
                this.handleTabsEdit(key, 'add', title, name);
            },
        }
    }
</script>
<style lang="scss" >
    $lightGreen: #222d32;
    $deepGreen: #282f32;
    html, body {
        height: 100%;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #CCCCCC;
        -webkit-border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        background-color: #999999;
        -webkit-border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        width: 5px;
        background-color: #CCCCCC;
        -webkit-border-radius: 6px;
    }

    .index {
        height: 100%;
    }

    .index-header {
        position: relative;
        height: 50px;
        background-color: #3cc1c4;
    }

    .index-aside {
        position: relative;
        width: 180px;
        background-color: #222d32;
        height: calc(100% - 50px);
        transition: all 0.3s;
        text-align: left;
        overflow: auto;
        overflow-x: hidden;
        .iconfont{
            vertical-align: middle;
            margin-right: 2px;
            margin-top: -2px;
            display: inline-block;
        }
    }

    .index-aside .el-menu {
        border-right: none;
    }

    .index-main {
        position: absolute;
        top: 50px;
        right: 0;
        height: calc(100% - 50px);
        left: 180px;
        transition: all 0.3s;
        >.el-tabs--border-card{
            border-bottom: none;
            box-shadow: none;
            -webkit-box-shadow: none;
        }
        >.index-page{
            height: calc(100% - 40px);
            overflow: auto;
        }
    }

    .index-logo {
        float: left;
        line-height: 50px;
        font-size: 20px;
        width: 180px;
        height: 100%;
        background-color: #3cc1c4;
        color: white;
        text-align: center;
    }

    i.index-fold {
        font-size: 23px;
        float: left;
        margin-top: 10px;
        margin-left: 10px;
        cursor: pointer;
        color: white;
    }

    .index-user {
        white-space: nowrap;
        overflow: hidden;
        padding: 25px 0 10px 0px;
        max-height: 100px;
        background-color: #282f32;
        > * {
            vertical-align: middle;
        }
        > img {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            transition: all 0.3s;
        }
        > div {
            display: inline-block;
            color: white;
            font-size: 14px;
            margin-left: 10px;
            > p:first-child + p {
                font-size: 12px;
                color: #eeeeee;
            }
        }

    }

    .index-oper {
        margin: 0;
        padding: 0 20px 0 0;
        list-style: none;
        float: right;
        height: 100%;
        > li {
            float: left;
            .index-fix {
                height: 100%;
                padding: 0 15px;
                line-height: 50px;
                cursor: pointer;
            }
            i.iconfont {
                color: white;
                font-size: 25px;
            }
        }

    }

    div.index-tab {
        /*height: 0;*/
        box-sizing: border-box;
        overflow: hidden;
        > .el-tabs__content {
            padding: 0;
            height: 0;
            .el-tab-pane {
                height: 0;
                overflow: auto;
            }
        }
    }
    /*去除tab的蓝色边框*/
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
    }
    /*barMenu*/
    ul.barMenu{
        height: 100%!important;
        float: left;

        margin-left: 30px;
        border-bottom: none;
        box-sizing: border-box;
        .el-menu-item,.el-submenu__title{
            height: 100%!important;
            box-sizing: border-box;
            line-height: 50px!important;
        }

    }
    .el-submenu__title>i,.el-menu-item>i{
        color:white!important;
    }
    .theme-picker .el-color-picker__trigger {
        vertical-align: middle;
        margin-top: 5px;
    }

    .theme-picker-dropdown .el-color-dropdown__link-btn {
        display: none;
    }
    .liu {
        position: relative;
        left: 37%;
        margin-left: -15%;
        line-height: 20px;
        margin-top: 20px;
        > button {
            width: 50%;
        }
        > i {
            position: relative;
            left: 37%;
            margin-left: -15%;
        }
    }
</style>