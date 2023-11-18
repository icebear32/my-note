<script setup>
import { watch } from "vue"
import { noteBaseRequest } from "@/request/note_request"
import { useMessage, useLoadingBar } from 'naive-ui'
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'


// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

const propsData = defineProps({
    id: { type: Number, required: true }
})

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
        console.log(responseData.data)
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
    <n-button>笔记编辑容器{{ id }}</n-button>
</template>