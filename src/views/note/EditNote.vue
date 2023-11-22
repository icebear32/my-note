<script setup>
import { watch, ref } from "vue"
import CKEditor from '@ckeditor/ckeditor5-vue'
import { useMessage, useLoadingBar } from 'naive-ui'
import { editorType, getEditorConfigs } from "@/editor"
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { FiberManualRecordRound, StarBorderRound, MoreHorizRound } from "@vicons/material"
import { onMounted } from "vue"

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

const propsData = defineProps({
    id: { type: Number, required: true }
})

const ckeditor5 = CKEditor.component // 注册 ckleditor5 组件

const loading = ref(true) // 是否处于加载中

// 编辑的笔记
const note = ref({})

// 获取编辑的笔记信息
const getEditNote = async () => {
    loading.value = true // 处于加载中

    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送获取编辑的笔记请求
    const { data: responseData } = await noteBaseRequest.get(
        "/note/edit",
        {
            params: { noteId: propsData.id },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("获取编辑笔记的请求失败") // 获取失败的通知
    })
    // 得到服务器返回的数据，进行处理
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        // console.log(responseData.data)
        note.value = responseData.data
        loading.value = false // 加载已完毕
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}

// 如果笔记编号发生变化，重新获取编辑的笔记信息
watch(
    () => propsData.id,
    () => {
        getEditNote()
    }
)

// 获取编辑的笔记信息
getEditNote()

let editor = null // 编辑器对象

/**
 * 富文本编辑器初始化完毕
 * @param {*} editorObj 编辑器的对象
 */
const readyEditor = (editorObj) => {
    editor = editorObj // 编辑器对象
    // 在编辑器区域插入工具栏
    editorObj.ui.getEditableElement().parentElement.insertBefore(
        editorObj.ui.view.toolbar.element,
        editorObj.ui.getEditableElement()
    )
}

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 83 && e.ctrlKey) {
            // console.log(e)
            e.preventDefault()
            e.returnValue = false
            saveNote() // 保存笔记
        }
    })
})

const saveNote = async () => {
    const noteId = propsData.id // 编号
    const title = editor.plugins.get('Title').getTitle() // 文档标题
    const body = editor.plugins.get('Title').getBody() // 文档内容
    const content = note.value.content // 文档完整内容

    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送保存的笔记请求
    const { data: responseData } = await noteBaseRequest.post(
        "/note/save",
        { noteId, title, body, content },
        {
            params: { noteId: propsData.id },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("保存笔记的请求失败") // 请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 请求发送成功的通知
        note.updateTime = responseData.data
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}
</script>

<template>
    <!-- 骨架屏 -->
    <n-space vertical :wrap-item="false" v-if="loading">
        <n-skeleton :height="36" width="100%"></n-skeleton>
        <n-skeleton text width="30%"></n-skeleton>
        <n-skeleton text width="60%"></n-skeleton>
        <n-skeleton text width="40%"></n-skeleton>
        <n-skeleton text width="80%"></n-skeleton>
        <n-skeleton text width="40%"></n-skeleton>
        <n-skeleton text width="66%"></n-skeleton>
    </n-space>
    <n-space vertical v-else>
        <!-- 发布时间、分享、收藏、更多操作 -->
        <n-card :bordered="false" size="small">
            <n-space justify="space-between" align="center">
                <!-- 发布时间 -->
                <n-space align="center" :wrap-item="false">
                    <n-icon color="#18a058" :component="FiberManualRecordRound"></n-icon>
                    <n-text depth="3">保存并发布于：{{ note.updateTime }}</n-text>
                </n-space>
                <!-- 功能按钮：分享、收藏、更多功能按钮 -->
                <n-space align="center" :wrap-item="false" :size="8">
                    <n-button round dashed>分享</n-button>
                    <!-- 收藏按钮 -->
                    <n-popover>
                        <template #trigger>
                            <n-button quaternary circle>
                                <n-icon size="20" :component="StarBorderRound"></n-icon>
                            </n-button>
                        </template>
                        收藏
                    </n-popover>
                    <n-button quaternary circle>
                        <n-icon size="20" :component="MoreHorizRound"></n-icon>
                    </n-button>
                </n-space>
            </n-space>
        </n-card>
        <!-- 编辑器 -->
        <n-card :bordered="false" size="small">
            <!-- 富文本编辑器 -->
            <ckeditor5 :editor="editorType" @ready="readyEditor" v-model="note.content" :config="getEditorConfigs()" />
        </n-card>
    </n-space>
</template>

<style>
/* 编辑器右下角的 logo 需要隐藏 */
.ck.ck-balloon-panel.ck-balloon-panel_visible {
    display: none;
}

/* 去掉编辑器的边框 */
.ck.ck-editor__editable_inline {
    border: none;
}

/* 编辑器聚焦时,去掉边框和盒子阴影 */
.ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
    border: none;
    box-shadow: none;
}
</style>