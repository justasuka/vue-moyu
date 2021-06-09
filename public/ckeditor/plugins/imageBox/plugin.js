CKEDITOR.plugins.add(
    'imageBox',
    {
        requires:['dialog'],
        init:function (editor) {
            var ul;
            editor.addCommand('imageDialog',new CKEDITOR.dialogCommand('imageDialog'));
            editor.ui.addButton('imageDialog',{
                label:'上传图片',
                command:'imageDialog',
                icon:this.path+'images/image.png'
            });
            CKEDITOR.dialog.add('imageDialog',buildImageBoxDialog());
            insertStyle(this.path);
            //函数定义
            function buildImageBoxDialog () {
                return function (ck) {
                    return {
                        title:'上传图片',
                        resizable:CKEDITOR.DIALOG_RESIZE_NONE,
                        width:815,
                        height:540,
                        minHeight:300,
                        contents:[{
                            elements:[]
                        }],
                        onLoad:function(){
                            var content=this.parts.contents.$.parentNode.parentNode.parentNode;
                            content.style.marginTop='0';
                            content.style.borderTop='none';
                            this.parts.contents.$.style.padding='0';
                            this.parts.contents.$.removeChild(this.parts.contents.$.querySelector('.cke_dialog_page_contents'));
                            createToolBar(this.parts.contents.$);
                            ul=createImageList(this.parts.contents.$);
                        },
                        onOk:function () {
                            var lis=this.parts.contents.$.querySelectorAll('.image-box-body>li');
                            if(!lis){
                                alert('请选择图片上传');
                                return false;
                            }
                            var html='';
                            for (var i = 0; i < lis.length; i++) {
                                if(!lis[i].getAttribute('ready')){
                                    alert('请等待图片上传完毕');
                                    return false;
                                }else{
                                    html+=convert(lis[i]);
                                }
                            }
                            ck.insertHtml(html);
                            ul.innerHTML='';
                            return true;

                        },
                        onCancel:function () {

                        },
                        onShow:function () {

                        }
                    }
                }
            }
            //插入css文件
            function insertStyle(path){
                if(!document.querySelector('#__imageBoxStyle')){
                    var head = document.getElementsByTagName('head')[0];
                    var link = document.createElement('link');
                    link.type = 'text/css';
                    link.id='__imageBoxStyle';
                    link.rel='stylesheet';
                    link.href=path+'styles/imageBox.css';
                    head.appendChild(link);
                }
            }
            //创建工具bar
            function createToolBar(con) {
                var head=document.createElement('div');
                head.className='image-box-head';
                con.appendChild(head);
                //选择文件按钮
                var selectFile=document.createElement('div');
                selectFile.className='select-file';
                selectFile.onclick=function () {
                    this.lastChild.click();
                };
                var span=document.createElement('span');
                span.innerText='选择图片';
                selectFile.appendChild(span);
                var fileInput=document.createElement('input');
                fileInput.type='file';
                fileInput.multiple='multiple';
                fileInput.name='file';
                fileInput.onchange=function(e){
                    for (var i = 0; i < fileInput.files.length; i++) {
                        var file = fileInput.files[i];
                        var ext=file.name.substring(file.name.lastIndexOf('.'),file.name.length);
                        if(ext==='.jpg'||ext==='.png'||ext==='.gif'||ext==='.bmp'||ext==='.jpeg'){
                            if(file.size>10*1024*1024){
                                alert('图片大小请控制在10MB以内');
                                return;
                            }
                        }else{
                            alert('请选择图片');
                            return;
                        }
                    }
                    for (var j = 0; j < fileInput.files.length; j++) {
                        uploadFile(fileInput.files[j],createImageItem());
                    }
                    fileInput.value='';
                };
                selectFile.appendChild(fileInput);
                head.appendChild(selectFile);
            }
            //创建图片容器
            function createImageList(con) {
                var body=document.createElement('ul');
                body.className='image-box-body';
                con.appendChild(body);
                return body;
            }
            //创建图片项
            function createImageItem() {
                var li=document.createElement('li');
                li.className='uploading';
                var img=new Image();
                var progress=document.createElement('div');
                progress.className='progress';
                var indicator=document.createElement('div');
                indicator.className='indicator';
                progress.appendChild(indicator);
                var remove=document.createElement('div');
                remove.className='remove';
                remove.innerText='X';
                remove.onclick=function(){
                    remove.parentNode.parentNode.removeChild(li);
                };
                li.appendChild(img);
                li.appendChild(progress);
                li.appendChild(remove);
                ul.appendChild(li);
                return li;
            }
            //li转成image字符串
            function convert(li) {
                var image=new Image();
                // image.width=li.firstChild.naturalWidth||li.firstChild.width;
                // image.height=li.firstChild.naturalHeight||li.firstChild.height;
                image.src=li.firstChild.src;
                return image.outerHTML;

            }
            //上传图片
            function uploadFile(file,li) {
                console.log(editor.config,"editor.config");
                var formData = new FormData();
                formData.append("file", file);
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(e){uploadProgress(e,li)}, false);
                xhr.addEventListener("load", function(e){uploadComplete(e,li)}, false);
                xhr.addEventListener("error", function(e){uploadFailed(li)}, false);
                xhr.addEventListener("abort", function(e){uploadCanceled(li)}, false);
                xhr.open("POST", home+'/upload/uploadImgForImageBox');
                xhr.setRequestHeader('token', sessionStorage.getItem('token'));
                xhr.send(formData);
            }
            function uploadProgress(e,li) {
                var percent=Math.round(e.loaded * 100 / e.total)+'%';
                li.querySelector('.progress').lastChild.style.width=percent;
            }
            function uploadComplete(e,li) {
                li.className='';
                li.setAttribute('ready',true);
                li.firstChild.src=JSON.parse(e.target.responseText).data;
            }
            function uploadFailed(li) {
                alert('上传失败');
            }
            function uploadCanceled(li) {
            }
        }
    }
);

