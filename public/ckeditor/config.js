/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
//CKEDITOR.plugins.addExternal('ckeditor_wiris', 'https://www.wiris.net/demo/plugins/ckeditor/', 'plugin.js');
CKEDITOR.editorConfig = function (config) {

    config.toolbarGroups = [{
        name: 'styles',
        groups: ['styles']
    },
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup']
        },
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
        },
        {
            name: 'wiris',
            groups: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_formulaEditorChemistry']
        },
        {
            name: 'insert',
            groups: ['insert']
        },
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo']
        },
        {
            name: 'document',
            groups: ['mode', 'document', 'doctools']
        },
        {
            name: 'editing',
            groups: ['find', 'selection', 'spellchecker', 'editing']
        },
        {
            name: 'forms',
            groups: ['forms']
        },
        {
            name: 'links',
            groups: ['links']
        },
        {
            name: 'colors',
            groups: ['colors']
        },
        {
            name: 'tools',
            groups: ['tools']
        },
        {
            name: 'others',
            groups: ['others']
        },
        {
            name: 'about',
            groups: ['about']
        }
    ];

    config.removeButtons = 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,CreateDiv,Blockquote,JustifyBlock,Language,BidiRtl,BidiLtr,Link,Unlink,Anchor,Iframe,PageBreak,Smiley,Flash,HorizontalRule,Font,Format,Styles,BGColor,TextColor,Maximize,ShowBlocks';
    config.coreStyles_underline = {
        element: 'u',
        attributes: {
            style: 'border-bottom: 1px solid; text-decoration: none;'
        }
    };
    config.fontSize_sizes =
        '??????/9pt;??????/10.5pt;??????/12pt;??????/14pt;??????/15pt;??????/16pt;??????/18pt;';
    config.fontSize_defaultLabel = '';
    config.line_height = "4mm;5mm;6mm;7mm;8mm;9mm;10mm;11mm;12mm;13mm;14mm;15mm";
    config.mathJaxLib = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_BR;
    // Add[MT]to the integration list
    // config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'ckeditor_wiris';
    // config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'wirisDialog,html5video,html5audio';
    // config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'wirisDialog,html5video,html5audio';
    config.allowedContent = true;
    // ??????????????????
    config.image_previewText = '';
    config.extraPlugins = 'colorbutton,panelbutton,floatpanel,panel,colordialog,dialog,dialogui,pastefromexcel,justify,font,richcombo,listblock,button,clipboard,html5video,html5audio,imageBox,wirisDialog';
    //config.filebrowserImageUploadUrl = "https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json";
    config.filebrowserImageUploadUrl = home + '/upload/uploadImgForCk';
    config.filebrowserHtml5videoUploadUrl = home + '/upload/uploadVideo';//?????????????????????
    config.filebrowserHtml5audioUploadUrl = home + '/upload/uploadAudio';//??????????????????

};
CKEDITOR.config.line_height =
    '4mm;5mm;6mm;7mm;8mm;9mm;10mm;11mm;12mm;13mm;14mm;15mm;';
CKEDITOR.config.lineHeight_style = {
    element: 'p',
    styles: {
        'line-height': '#(size)'
    }, //,'display':'inline-block'
    overrides: [{
        element: 'line-height',
        attributes: {
            size: null
        }
    }]
};