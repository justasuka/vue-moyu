/**
 * Created by Wangtj on 2019/3/8.
 */
let imgExts=['.jpeg','.jpg','.gif','.png','.bmp'];
export default {
    scriptLoader:{
        load: async function(src,cb){
            let scripts=document.querySelectorAll('script');
            for (let i = 0; i < scripts.length; i++) {
                let script = scripts[i];
                if(script.src===src){
                    cb&&cb();
                    return;
                }
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                    cb&&cb();
                    script.onload = script.onreadystatechange = null;

                }
            };
            script.src= src;
            head.appendChild(script);
        },
        scriptList:[],
        running:false,
        //队列形式加载script,如果前一个没有完成不会执行下一个 todo 解决不了并发问题,editor.vue被同一个vue加载两个时，使用load会重复生产script标签
        queue(src,cb){
            const scriptObj={src:src,cb:cb};
            this.scriptList.push(scriptObj);
            if(!this.running){
                this._run();
            }

        },
        _run(){
            let scriptObj=this.scriptList.shift();
            if(scriptObj){
                this.running=true;
                this.load(scriptObj.src,()=>{
                    scriptObj.cb&&scriptObj.cb();
                    this._run();
                })
            }else{
                this.running=false;
            }

        }
    },
    element:{
        getLeft(e){
            var offset=e.offsetLeft;
            if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent);
            return offset;
        },
        getTop(e){
            var offset=e.offsetTop;
            if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
            return offset;
        },
        /**
         * 适用于从外边拖拽进列表时获取鼠标进入哪个item的index,列表选项高度可以不相同
         * @param offsetY 距离列表上边框的y轴像素
         * @param lis 列表
         * @param range 表示鼠标进入列表选项的百分之几范围触发有效(中线重叠)
         * @returns {i:'就是index',less:'鼠标在整个列表上面',more:'鼠标在整个列表下面',upToCenter:'是否在选项中线上面'}
         */
        toIndex(offsetY, lis,range){
            if (offsetY < 0) {
                return {less:true,i:0,upToCenter:true};
            }
            let y = 0;
            for (let i = 0; i < lis.length; i++) {
                let h=lis[i].offsetHeight;
                y += h;
                let centerY = y - h / 2;
                if (offsetY >= centerY - h*(range/2) && offsetY <=centerY + h*(range/2)) {
                    return {i:i,upToCenter:offsetY<centerY};
                }
            }
            if(offsetY>=y){
                return {more:true,i:lis.length-1,upToCenter:false};
            }
            return null;
        },
        /**
         * 适用于拖拽列表某个选项，计算出拖拽哪个index,列表选项高度可以不相同
         * @param offsetY 距离列表上边框的y轴像素
         * @param lis 列表
         * @returns {i:'就是index',less:'鼠标在整个列表上面',more:'鼠标在整个列表下面',upToCenter:'是否在选项中线上面'}
         */
        translateToIndex(offsetY,lis,target){
            if (offsetY < 0) {
                return {less:true,i:0,upToCenter:true};
            }
            //考虑被translate后，重排序的问题
            let heightArr=[];
            let height=target.offsetHeight;

            for (let i = 0; i < lis.length; i++) {
                if(lis[i]!==target){
                    let transform=lis[i].style.transform;
                    if(transform){
                        let translateY=parseFloat(transform.match(/translateY\(.*\)/)[0].replace(/translateY\(/,'').replace('\)',''))/height;
                        heightArr.push({i:i+translateY,h:lis[i].offsetHeight})
                    }else{
                        heightArr.push({i:i,h:lis[i].offsetHeight});
                    }
                }
            }

            heightArr.sort((a,b)=>{
                if(a.i<b.i){
                    return -1;
                }
                if(a.i>b.i){
                    return 1;
                }
                return 0;
            });

            let last=-1;
            for (let i = 0; i <heightArr.length ; i++) {
                if(heightArr[i].i!==last+1){
                    if(i===heightArr.length){
                        heightArr.push({i:i, h: height});
                    }else{
                        heightArr.splice(i,0,{i:i, h: height});
                    }
                    break;
                }
                last=heightArr[i].i;
            }
            let y = 0;
            for (let i = 0; i < heightArr.length; i++) {
                let h=heightArr[i].h;
                y += h;
                let centerY = y - h / 2;
                let offset=Math.min(height,h)/2;
                if (offsetY >= centerY - offset && offsetY <=centerY + offset) {
                    return {i:i,upToCenter:offsetY<centerY};
                }


            }
            if(offsetY>=y){
                return {more:true,i:lis.length-1,upToCenter:false};
            }
            return null;
        },
        /**
         * 适用于每行高度一致的计算
         * @param fromIndex
         * @param disY
         * @param h
         * @param range
         * @param length
         * @returns {*}
         */
        plainToIndex(fromIndex, disY,h,range,length){
            // disY>90n-20; disY<90n+20
            let n1 = Math.floor((Math.abs(disY) + h/2*range) / h);
            let n2=Math.ceil((Math.abs(disY)-h/2*range)/h);
            if(n1===n2){
                if(disY>=0){
                    return Math.min(fromIndex+n1,length-1);
                }else{
                    return Math.max(fromIndex-n1,0);
                }
            }else{
                return null;
            }
        },
        downloadQiniuFile(url,name){
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url+"?attname="+encodeURIComponent(name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        //获取页面上最大的z-index
        getMaxZIndex(){
            return [...document.body.querySelectorAll('*')].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0);
        }
    },
    file:{
        isImg(name){
            let ext=name.substring(name.lastIndexOf('.'),name.length+1).toLowerCase();
            return !!imgExts.find(v=>v===ext);
        }
    },
    array:{
        /**
         * 用来验证数组里的选项是否重复
         * @param arr
         * @param key 如果元素是个对象时，指定哪个属性,否则不传
         */
        isRepeat(arr,key){
            var hash = {};
            for (let i = 0; i < arr.length; i++) {
                if(key){
                    if (hash[arr[i][key]]){
                        return arr[i];
                    }
                    hash[arr[i][key]] = true;
                }else{
                    if (hash[arr[i]]){
                        return arr[i];
                    }
                    hash[arr[i]] = true;
                }
            }
            return false;
        }
    },
    uuid:function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    urlKey(name){
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dOfMonth=date.getDate();
        let d=(month<10?('0'+month):month)+(dOfMonth<10?('0'+dOfMonth):dOfMonth);
        return `${year}/${d}/${this.uuid()}/${name}`;
    }
}
