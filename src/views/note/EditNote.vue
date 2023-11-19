<script setup>
import { watch, ref } from "vue"
import { useMessage, useLoadingBar } from 'naive-ui'
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { FiberManualRecordRound, StarBorderRound, MoreHorizRound } from "@vicons/material"

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

const propsData = defineProps({
    id: { type: Number, required: true }
})

// 编辑的笔记
const note = ref({})

// 获取编辑的笔记信息
const getEditNote = async () => {
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
</script>

<template>
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
                <n-button quaternary circle>
                    <n-icon size="20" :component="StarBorderRound"></n-icon>
                </n-button>
                <n-button quaternary circle>
                    <n-icon size="20" :component="MoreHorizRound"></n-icon>
                </n-button>
            </n-space>
        </n-space>
    </n-card>
</template>