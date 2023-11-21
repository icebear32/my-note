import { Paragraph } from '@ckeditor/ckeditor5-paragraph' // 段落插件
import { Essentials } from '@ckeditor/ckeditor5-essentials' // 基本功能插件
import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled' // 引入编辑器

// 编辑器的类型
export const editorType = DecoupledEditor

// 获取编辑器的配置
export const getEditorConfigs = () => ({
    // 插件
    plugins: [
        Paragraph, // 段落插件
        Essentials, // 基本功能插件（插件支持剪贴板、输入、全选、ShiftEnter、键入和撤消支持）
    ],
    // 工具栏
    toolbar: [
        'undo', // 撤消
        'redo', // 重做
        'selectAll', // 全选
    ]
})