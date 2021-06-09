/**
 * Created by Wangtj on 2019/3/5.
 */
function loadWirisScript(callback){
    if(!document.querySelector('#wirisEditor')){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.id='wirisEditor';
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
        script.src= 'https://www.wiris.net/demo/editor/editor';
        head.appendChild(script);
    }else{
        callback();
    }
}
function insertStyle(){
    if(!document.querySelector('#wirisEditorStyle')){
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id='wirisEditorStyle';
        var arr=['.cke_reset_all .wrs_toolbar *{box-sizing:border-box;}'];
        style.innerHTML=arr.join(' ');
        head.appendChild(style);
    }
}
function buildDialog (type) {
    return function (ck) {
        var wiriEditor;
        return {
            title:'数学公式',
            resizable:CKEDITOR.DIALOG_RESIZE_NONE,
            width:640,
            height:300,
            minHeight:300,
            contents:[{
                elements:[]
            }],
            onLoad:function(){
                // this=dialog
                var content=this.parts.contents.$.parentNode.parentNode.parentNode;
                content.style.marginTop='0';
                content.style.borderTop='none';
                var div=document.createElement('div');
                div.style.height='290px';
                this.parts.contents.$.appendChild(div);
                insertStyle();
                CKEDITOR.scriptLoader.load('https://www.wiris.net/demo/editor/editor',function(){
                    //删除多余的script和link标签
                    var scripts=document.querySelectorAll('script');
                    for (var i = 0; i < scripts.length; i++) {
                        var s=scripts[i];
                        if(s.src.indexOf('www.wiris.net/demo/hand/hand.js')!==-1){
                            s.parentNode.removeChild(s);
                            break;
                        }
                    }
                    var links=document.querySelectorAll('link');
                    for (var j = 0; j < links.length; j++) {
                        var l=links[j];
                        if(l.href.indexOf('www.wiris.net/demo/hand/resources/hand.css')!==-1){
                            l.parentNode.removeChild(l);
                            break;

                        }
                    }
                    var links2=document.querySelectorAll('link');
                    for (var j = 0; j < links2.length; j++) {
                        var l2=links2[j];
                        if(l2.href.indexOf('www.wiris.net/demo/editor/resources/template.css')!==-1){
                            l2.parentNode.removeChild(l2);
                            break;
                        }
                    }
                    wiriEditor = com.wiris.jsEditor.JsEditor.newInstance({'language': 'zh',toolbar:type});
                    wiriEditor.insertInto(div);
                });



            },
            onOk:function () {
                var me=this;
                var mathML=wiriEditor.getMathML();
                if(mathML.length<='<math xmlns="http://www.w3.org/1998/Math/MathML"></math>'.length){
                    return false;
                }
                //直接fire到事件去,从自己服务端请求转换成图片，生产https里请求http似乎一定报 Provisional headers are shown
                ck.fire('getMathML',wiriEditor.getMathML());
            },
            onCancel:function () {

            },
            onShow:function () {
                //暂时清空
                wiriEditor&&wiriEditor.setMathML('<math xmlns="http://www.w3.org/1998/Math/MathML"></math>');
            }
        }
    }
}
CKEDITOR.plugins.add(
    'wirisDialog',
    {
        requires:['dialog'],
        init:function (editor) {
            //数学公式
            editor.addCommand('mathDialog',new CKEDITOR.dialogCommand('mathDialog'));
            editor.ui.addButton('mathDialog',{
                label:'数学公式',
                command:'mathDialog',
                icon:this.path+'images/formula.png'
            });
            CKEDITOR.dialog.add('mathDialog',buildDialog('general'));


            //化学公式
            editor.addCommand('chemDialog',new CKEDITOR.dialogCommand('chemDialog'));
            editor.ui.addButton('chemDialog',{
                label:'化学公式',
                command:'chemDialog',
                icon:this.path+'images/chem.png'
            });
            CKEDITOR.dialog.add('chemDialog',buildDialog('chemistry'));
        }
    }
)