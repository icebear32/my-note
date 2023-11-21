import {Link} from '@ckeditor/ckeditor5-link' // 链接插件
import { CodeBlock } from '@ckeditor/ckeditor5-code-block' // 代码块插件
import { Heading, Title } from '@ckeditor/ckeditor5-heading' // 标题样式插件，文档标题插件
import { Alignment } from '@ckeditor/ckeditor5-alignment' // 文本对齐插件
import { Paragraph } from '@ckeditor/ckeditor5-paragraph' // 段落插件
import { Essentials } from '@ckeditor/ckeditor5-essentials' // 基本功能插件
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote' // 块引用插件
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace' // 查找替换插件
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line' // 水平线插件
import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled' // 引入编辑器
import { FontSize, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font' // 字体插件
import {
    TodoList, // 待办事项列表插件
    ListProperties, // 列表插件
} from '@ckeditor/ckeditor5-list'
import {
    Indent, // 缩进插件（列表）
    IndentBlock, // 缩进插件（块：段落，标题）
} from '@ckeditor/ckeditor5-indent'
import {
    Bold, // 加粗
    Italic, // 斜体
    Strikethrough, // 删除线
    Underline, // 下划线
    Subscript, // 下标
    Superscript, // 上标
    Code // 行内代码
} from '@ckeditor/ckeditor5-basic-styles'
import {
    Table, // 表格插件
    TableToolbar, // 表格工具栏插件
    TableProperties, // 表属性插件
    TableCellProperties, // 单元格属性插件
    TableColumnResize, // 调整表列宽度插件
    TableCaption // 表标题插件
} from '@ckeditor/ckeditor5-table'

// 编辑器的类型
export const editorType = DecoupledEditor

// 获取编辑器的配置
export const getEditorConfigs = () => ({
    // 插件
    plugins: [
        Paragraph, // 段落插件
        Essentials, // 基本功能插件（插件支持剪贴板、输入、全选、ShiftEnter、键入和撤消支持）
        Bold, // 加粗
        Italic,  // 斜体
        Strikethrough, // 删除线
        Underline, // 下划线
        Superscript, // 上标
        Subscript, // 下标
        Code, // 行内代码
        BlockQuote, // 块引用插件
        // FontFamily, // 字体
        FontSize, // 字体大小
        FontColor, // 字体颜色
        FontBackgroundColor, // 字体背景色
        Alignment, // 文本对齐插件
        HorizontalLine, // 水平线插件
        Heading, // 标题样式插件
        Title, // 文档标题插件
        ListProperties, // 列表插件（有序和无序）
        TodoList, // 待办事项列表插件
        Paragraph, // 段落插件
        Essentials, // 基础插件
        ListProperties, // 列表插件
        TodoList, // 标题插件
        Indent, // 缩进插件（列表）
        IndentBlock, // 缩进插件（块：段落，标题）
        CodeBlock, // 代码块插件
        FindAndReplace, // 查找替换插件
        Table, // 表格插件
        TableToolbar, // 表工具栏
        TableProperties, // 表属性插件
        TableCellProperties, // 单元格属性插件
        TableColumnResize, // 调整表列宽度插件
        TableCaption, // 表标题插件
        Link, // 链接插件
    ],
    fontSize: {
        supporAllValues: true,
        options: [12, 14, 'default', 25, 30]
    },
    fontColor: {
        columns: 10, // 颜色展示的列数
        documentColors: 6, // 文档中使用的颜色数量
        colors: [
            { color: '#000000', label: '黑色' },
            { color: '#262626', label: '深灰 3' },
            { color: '#585A5A', label: '深灰 2' },
            { color: '#8A8F8D', label: '深灰 1' },
            { color: '#D8DAD9', label: '灰色' },
            { color: '#E7E9E8', label: '浅灰 4' },
            { color: '#EFF0F0', label: '浅灰 3' },
            { color: '#F4F5F5', label: '浅灰 2' },
            { color: '#FAFAFA', label: '浅灰 1' },
            { color: '#FFFFFF', label: '白色' },

            { color: '#DF2A3F', label: '红色' },
            { color: '#ED740C', label: '橘橙' },
            { color: '#ECAA04', label: '金盏黄' },
            { color: '#FBDE28', label: '柠檬黄' },
            { color: '#74B602', label: '绿色' },
            { color: '#1DC0C9', label: '青色' },
            { color: '#117CEE', label: '浅蓝' },
            { color: '#2F4BDA', label: '蓝色' },
            { color: '#601BDE', label: '紫色' },
            { color: '#D22D8D', label: '玫红' },

            { color: '#FBE4E7', label: '红色 1' },
            { color: '#FDE6D3', label: '橘橙 1' },
            { color: '#F9EFCD', label: '金盏黄 1' },
            { color: '#FBF5CB', label: '柠檬黄 1' },
            { color: '#E8F7CF', label: '绿色 1' },
            { color: '#CEF5F7', label: '青色 1' },
            { color: '#D9EAFC', label: '浅蓝 1' },
            { color: '#D9DFFC', label: '蓝色 1' },
            { color: '#E6DCF9', label: '紫色 1' },
            { color: '#FBDFEF', label: '玫红 1' },

            { color: '#F1A2AB', label: '红色 2' },
            { color: '#F8B881', label: '橘橙 2' },
            { color: '#F5D480', label: '金盏黄 2' },
            { color: '#FCE75A', label: '柠檬黄 2' },
            { color: '#C1E77E', label: '绿色 2' },
            { color: '#81DFE4', label: '青色 2' },
            { color: '#81BBF8', label: '浅蓝 2' },
            { color: '#96A7FD', label: '蓝色 2' },
            { color: '#BA9BF2', label: '紫色 2' },
            { color: '#F297CC', label: '玫红 2' },

            { color: '#E4495B', label: '红色 3' },
            { color: '#F38F39', label: '橘橙 3' },
            { color: '#F3BB2F', label: '金盏黄 3' },
            { color: '#EDCE02', label: '柠檬黄 3' },
            { color: '#8CCF17', label: '绿色 3' },
            { color: '#01B2BC', label: '青色 3' },
            { color: '#2F8EF4', label: '浅蓝 3' },
            { color: '#4861E0', label: '蓝色 3' },
            { color: '#7E45E8', label: '紫色 3' },
            { color: '#E746A4', label: '玫红 3' },

            { color: '#AD1A2B', label: '红色 4' },
            { color: '#C75C00', label: '橘橙 4' },
            { color: '#C99103', label: '金盏黄 4' },
            { color: '#A58F04', label: '柠檬黄 4' },
            { color: '#5C8D07', label: '绿色 4' },
            { color: '#07787E', label: '青色 4' },
            { color: '#0C68CA', label: '浅蓝 4' },
            { color: '#213BC0', label: '蓝色 4' },
            { color: '#4C16B1', label: '紫色 4' },
            { color: '#AE146E', label: '玫红 4' },

            { color: '#70000D', label: '红色 5' },
            { color: '#663000', label: '橘橙 5' },
            { color: '#664900', label: '金盏黄 5' },
            { color: '#665800', label: '柠檬黄 5' },
            { color: '#2A4200', label: '绿色 5' },
            { color: '#004347', label: '青色 5' },
            { color: '#00346B', label: '浅蓝 5' },
            { color: '#101E60', label: '蓝色 5' },
            { color: '#270070', label: '紫色 5' },
            { color: '#5C0036', label: '玫红 5' }
        ]
    },
    fontBackgroundColor: {
        columns: 10, // 颜色展示的列数
        documentColors: 6, // 文档中使用的颜色数量
        colors: [
            { color: '#000000', label: '黑色' },
            { color: '#262626', label: '深灰 3' },
            { color: '#585A5A', label: '深灰 2' },
            { color: '#8A8F8D', label: '深灰 1' },
            { color: '#D8DAD9', label: '灰色' },
            { color: '#E7E9E8', label: '浅灰 4' },
            { color: '#EFF0F0', label: '浅灰 3' },
            { color: '#F4F5F5', label: '浅灰 2' },
            { color: '#FAFAFA', label: '浅灰 1' },
            { color: '#FFFFFF', label: '白色' },

            { color: '#DF2A3F', label: '红色' },
            { color: '#ED740C', label: '橘橙' },
            { color: '#ECAA04', label: '金盏黄' },
            { color: '#FBDE28', label: '柠檬黄' },
            { color: '#74B602', label: '绿色' },
            { color: '#1DC0C9', label: '青色' },
            { color: '#117CEE', label: '浅蓝' },
            { color: '#2F4BDA', label: '蓝色' },
            { color: '#601BDE', label: '紫色' },
            { color: '#D22D8D', label: '玫红' },

            { color: '#FBE4E7', label: '红色 1' },
            { color: '#FDE6D3', label: '橘橙 1' },
            { color: '#F9EFCD', label: '金盏黄 1' },
            { color: '#FBF5CB', label: '柠檬黄 1' },
            { color: '#E8F7CF', label: '绿色 1' },
            { color: '#CEF5F7', label: '青色 1' },
            { color: '#D9EAFC', label: '浅蓝 1' },
            { color: '#D9DFFC', label: '蓝色 1' },
            { color: '#E6DCF9', label: '紫色 1' },
            { color: '#FBDFEF', label: '玫红 1' },

            { color: '#F1A2AB', label: '红色 2' },
            { color: '#F8B881', label: '橘橙 2' },
            { color: '#F5D480', label: '金盏黄 2' },
            { color: '#FCE75A', label: '柠檬黄 2' },
            { color: '#C1E77E', label: '绿色 2' },
            { color: '#81DFE4', label: '青色 2' },
            { color: '#81BBF8', label: '浅蓝 2' },
            { color: '#96A7FD', label: '蓝色 2' },
            { color: '#BA9BF2', label: '紫色 2' },
            { color: '#F297CC', label: '玫红 2' },

            { color: '#E4495B', label: '红色 3' },
            { color: '#F38F39', label: '橘橙 3' },
            { color: '#F3BB2F', label: '金盏黄 3' },
            { color: '#EDCE02', label: '柠檬黄 3' },
            { color: '#8CCF17', label: '绿色 3' },
            { color: '#01B2BC', label: '青色 3' },
            { color: '#2F8EF4', label: '浅蓝 3' },
            { color: '#4861E0', label: '蓝色 3' },
            { color: '#7E45E8', label: '紫色 3' },
            { color: '#E746A4', label: '玫红 3' },

            { color: '#AD1A2B', label: '红色 4' },
            { color: '#C75C00', label: '橘橙 4' },
            { color: '#C99103', label: '金盏黄 4' },
            { color: '#A58F04', label: '柠檬黄 4' },
            { color: '#5C8D07', label: '绿色 4' },
            { color: '#07787E', label: '青色 4' },
            { color: '#0C68CA', label: '浅蓝 4' },
            { color: '#213BC0', label: '蓝色 4' },
            { color: '#4C16B1', label: '紫色 4' },
            { color: '#AE146E', label: '玫红 4' },

            { color: '#70000D', label: '红色 5' },
            { color: '#663000', label: '橘橙 5' },
            { color: '#664900', label: '金盏黄 5' },
            { color: '#665800', label: '柠檬黄 5' },
            { color: '#2A4200', label: '绿色 5' },
            { color: '#004347', label: '青色 5' },
            { color: '#00346B', label: '浅蓝 5' },
            { color: '#101E60', label: '蓝色 5' },
            { color: '#270070', label: '紫色 5' },
            { color: '#5C0036', label: '玫红 5' }
        ]
    },
    alignment: {
        options: [
            'left', // 左对齐
            'right', // 右对齐
            'center', // 水平居中对齐
        ]
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            // 自定义
            {
                model: 'customParagraph',
                title: '段落 - 蓝色 - 斜体', // 下拉框的选项显示文本
                class: 'custom_p_blue_italic', // 下拉框的选项显示文本样式
                converterPriority: 'high', // 转换级别高
                // 渲染后的元素 
                view: {
                    name: 'p', // 段落元素
                    styles: {
                        'font-size': '9px',
                        'color': '#3058cf',
                        'font-style': 'italic'
                    }
                }
            }
        ]
    },
    title: {
        placeholder: '请输入文档标题',
    },
    placeholder: '请在此处输入文章内容',
    list: {
        properties: {
            styles: true, // 是否显示列表样式，默认为 true，false 时无法创建有序和无序列表
            startIndex: true, // 列表序号开始值
            reversed: true, // 是否反转有序列表序号
        }
    },
    // 工具栏
    toolbar: [
        'undo', // 撤消
        'redo', // 重做
        'selectAll', // 全选
        'bold', // 加粗
        'Ttalic', // 斜体
        'Strikethrough', // 删除线
        'Underline', // 下划线
        'Superscript', // 上标
        'Subscript', // 下标
        'Code', // 行内代码
        'BlockQuote', // 块引用
        // 'FontFamily', // 字体
        'FontSize', // 字体大小
        'FontColor', // 字体颜色
        'FontBackgroundColor', // 字体背景色
        'Alignment', // 文本对齐
        'HorizontalLine', // 水平线
        'Heading', // 标题
        'BulletedList', // 无序列表
        'NumberedList', // 有序列表
        'Todolist', // 待办事项列表
        'Outdent', // 减少缩进
        'Indent', // 增加缩进
        'Codeblock', // 代码块
        'FindAndReplace', // 查找替换
        'InsertTable', // 插入表格
        'Link', // 链接
    ]
})