<template>
    <div class="my-ckeditor">
    <textarea
            :name="editorName"
            v-model="html"
    ></textarea>

    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'myCkeditor',
        props: {
            value: {
                type: String,
                default: ''
            },
            defaultRemoveButtons: {
                type: String,
                default: ''//可能的值有Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,CreateDiv,Blockquote,JustifyBlock,Language,BidiRtl,BidiLtr,Link,Unlink,Anchor,Iframe,PageBreak,Smiley,Flash,HorizontalRule,Font,Format,Styles,BGColor,TextColor,Maximize,ShowBlocks,Mathjax
            },
            defaultHeight: {
                type: Number,
                default: 300
            }
        },
        data() {
            let editorName = `myCkeditor${(Math.random() * 10e18)}`;
            return {
                inited: false,
                editorName,
                objEditor: null,
                editorHeight: 400,
                removeButtons: 'Iframe,Mathjax,Image',
                changeHeight: {
                    curHeight: 0,
                    editorHeight: 0,
                    moveFlag: false,
                    start: 0
                },
                actionFlag: false
            }
        },
        computed: {
            html() {
                return this.value;
            }
        },
        watch: {
            html(newValue) {
                if (this.inited && this.objEditor.document.getBody().$) {
                    if (newValue !== this.objEditor.getData()) {
                        this.objEditor.setData(newValue);
                    }
                } else {
                    const timer = setInterval(() => {
                        if (this.inited && this.objEditor.document.getBody().$) {
                            clearInterval(timer);
                            if (newValue !== this.objEditor.getData()) {
                                this.objEditor.setData(newValue);
                            }
                        }
                    }, 50)
                }

            }
        },
        methods: {
            setHtml(html) {
                this.objEditor.setData(html);
            },
            getHtml() {
                return this.objEditor.getData();
            },
            getText() {
                return this.objEditor.document.getBody().getText();
            },
            initMe() {
                this.objEditor = CKEDITOR.replace(this.editorName, {
                    removeButtons: this.removeButtons,
                    height: this.editorHeight
                });
                this.objEditor.config.token = this.$store.getters.getToken;
                // 添加隐藏的按钮
                if (this.defaultRemoveButtons.length > 0) {
                    // this.removeButtons += ',' + this.defaultRemoveButtons;
                    this.removeButtons = this.defaultRemoveButtons;
                }
                // 设置高度
                this.editorHeight = this.defaultHeight;
                this.objEditor.on('instanceReady', evt => {
                    this.inited = true;
                    this.objEditor.setData(this.html);
                });
                this.objEditor.on('change', (evt) => {
                    this.$emit('input', CKEDITOR.instances[this.editorName].getData());
                });
                this.objEditor.on('getMathML', e => {
                    axios({
                        url: `${home}/upload/convertMmlToImage`,
                        method: 'POST',
                        headers: {'Content-Type': 'text/plain'},
                        loading: true,
                        data: e.data
                    }).then(res => {
                        let image = CKEDITOR.dom.element.createFromHtml(`<img src="${config.resPre + res.data}" style="vertical-align: middle;"  />`);
                        CKEDITOR.instances[this.editorName].insertElement(image);
                    });

                });
                this.objEditor.on('fileUploadRequest', (evt) => {
                    var xhr = evt.data.fileLoader.xhr;
                    xhr.setRequestHeader('token', this.$store.getters.getToken);
                });
            }
        },
        created() {
        },
        beforeMount() {

        },
        mounted() {
            this.initMe();
        },
        activated() {
            this.initMe();
        },
        deactivated() {
            try {
                this.objEditor.destroy();
                this.inited = false;
            } catch (error) {
            }
        },
        beforeDestroy() {
            try {
                this.objEditor.destroy();
                this.inited = false;
            } catch (error) {
            }
        }
    }

</script>