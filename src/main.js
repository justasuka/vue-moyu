import 'babel-polyfill'
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './registerServiceWorker'
import ElementUI from 'element-ui';
import './element-variables.scss'
import AMap from "vue-amap";
import config from '../config'
import util from './util/public.js'
import uploader from 'vue-simple-uploader'

Vue.prototype.util=util
Vue.use(AMap);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(uploader);

setTimeout(()=>{
    localStorage.clear()
    Vue.use(AMap);
},0)

AMap.initAMapApiLoader({
    key: 'a0b7e066bd8c56a802d4c1078aaedff6',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder']
})
let bindToGlobal = (obj, key = 'var') => {
    if (typeof window[key] === 'undefined') {
        window[key] = {};
    }


    for (let i in obj) {
        window[key][i] = obj[i]
    }
};
/**
 *  全局混入
 */
/*Vue.mixin({
    data(){
        return {
            config:config
        }
    }
})*/
/**
 * 自定义指令要放在new Vue之前
 */
Vue.directive('display', {
    inserted: function (el, binding) {
        let args = binding.arg;
        let arr = args.split('|');
        let permArr=arr.map(arg=>arg.replace(/\[.*]/g,''));

        let perm = permArr.find(arg => store.getters.getPermByIdentify(arg));
        if (!perm) {
            el.parentNode && el.parentNode.removeChild(el);
        }else{
            //使其支持模拟事件
            const index=permArr.findIndex(arg=>perm===arg);
            if(arr[index]!==permArr[index]){
                const rawArg=arr[index];
                const eventType=rawArg.substring(rawArg.indexOf('[')+1,rawArg.indexOf(']')).trim();
                el[eventType]();
            }

        }
    }
})
new Vue({
    router,
    store,
    created() {
        //添加全局静态变量
        window.home = config.isDev?'pictureApi':'';
        bindToGlobal({
            setToDefault(obj) {
                for (let k in obj) {
                    let t = typeof obj[k];

                    if (t === 'string') {
                        obj[k] = '';
                    } else if (t === 'number') {
                        obj[k] = undefined;
                    } else if (t === 'boolean') {
                        obj[k] = undefined;
                    } else if(t==='object' && !(t instanceof Array)){
                        if(!obj[k]){
                            this.setToDefault(obj[k]);
                        }else{
                            obj[k] = '';
                        }
                    } else if(t==='object' && t instanceof Array){
                        obj[k]=[];
                    } else{
                        obj[k] = '';
                    }
                }
            }
        }, 'objUtil');
        bindToGlobal(config, 'config');
        var me = this;
        // 添加请求拦截器
        let loading;
        axios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            config.headers.token = me.$store.getters.getToken;
            if(config.loading!==false){
                if (config.url.indexOf("reDelRePath") === -1) {
                    loading=me.$loading({fullscreen:true,background:'rgba(255,255,255,0.25)'});
                }
            }
            return config;
        }, function (error) {
            // 对请求错误做些什么
            loading && loading.close();
            return Promise.reject(error);
        });

// 添加响应拦截器
        axios.interceptors.response.use(function (response) {
            let config=response.config;
            // 对响应数据做点什么
            loading && loading.close();
            if (response.data && response.data.result && response.data.result.code === 909) {
                me.$router.replace('/login');
            } else if (response.data && response.data.result && response.data.result.code === 904) {
                me.$message({
                    showClose: true,
                    message: response.data.result.msg,
                    type: 'error'
                });
                me.$router.replace('/login');
                throw new Error();
            } else if (response.data && response.data.result && !response.data.result.success) {
                if(!config.diy){
                    me.$message({
                        showClose: true,
                        message: response.data.result.msg,
                        type: 'error'
                    });
                    throw new Error();
                }

            }
            return response.data;
        }, function (error) {
            // 对响应错误做点什么
            loading && loading.close();
            if (400 == error.response.status) {
                me.$alert(error.response.data.errors[0].defaultMessage, '错误', {confirmButtonText: '确定'});
            } else if (500 == error.response.status) {
                me.$alert('服务器错误,请联系管理员', '错误', {confirmButtonText: '确定'});
            } else if (404 == error.response.status) {
                me.$message({
                    showClose: true,
                    message: 'url路径错误',
                    type: 'error'
                });
            }else{
                console.log(error.response.data+"=================");
            }
            return Promise.reject(error);
        });
        //获取阿里图标
        axios({
            url: `${home}/iconfont/getIconfontLink`,
            method: 'GET'
        }).then(res => {
            let link=document.createElement('link');
            link.id='iconfont-url';
            link.rel='stylesheet';
            link.href=res.data;
            document.querySelector('head').appendChild(link);
        });
    },
    render: h => h(App)
}).$mount('#app');



