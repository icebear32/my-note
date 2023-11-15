<script setup>
import { ref } from "vue"
import { PlusRound } from "@vicons/material"
import { useMessage, useLoadingBar } from 'naive-ui'
import NoteCard from "@/components/note/NoteCard.vue"
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 笔记列表
const noteList = ref([])

/**
 * 获取笔记列表
 * 
 * @returns {Promise<void>}
 */
const getNoteList = async () => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送获取小记列表请求
    const { data: responseData } = await noteBaseRequest.get(
        "/note/list",
        {
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("获取笔记列表请求失败") // 获取笔记列表请求失败的通知
    })

    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        noteList.value = responseData.data // 封装笔记列表
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}
// 获取笔记列表
getNoteList()
</script>

<template>
    <!-- 笔记页面容器 -->
    <n-layout has-sider>
        <!-- 笔记列表容器（可收缩的） -->
        <n-layout-sider bordered show-trigger :width="340" class="note-list" :collapsed-width="0" :collapsed="collapsed">

            <n-scrollbar style="max-height: 100%;">
                <!-- 标题区域，新增笔记按钮 -->
                <n-card :bordered="false" style="position: sticky;top: 0;z-index: 1;">
                    <template #action>
                        <n-space align="center" justify="space-between">
                            <h3 style="margin: 0;">笔记列表</h3>
                            <n-button circle type="primary">
                                <n-icon size="22" :component="PlusRound">新增</n-icon>
                            </n-button>
                        </n-space>
                    </template>
                </n-card>
                <!-- 笔记列表 -->
                <n-list hoverable clickable style="margin: 5px;">
                    <n-list-item v-for="n in noteList" :key="n.id">
                        <NoteCard :id="n.id" :title="n.title" :desc="n.body" :top="!!n.top" :time="n.updateTime"></NoteCard>
                    </n-list-item>
                </n-list>
            </n-scrollbar>

        </n-layout-sider>
    </n-layout>
</template>

<style>
.n-layout.n-layout--static-positioned {
    height: 100%;
}

/* 只有将笔记列表容器收起来时，切换按钮的位置才会在右边 */
.n-layout-sider.n-layout-sider--collapsed.note-list .n-layout-toggle-button {
    right: -30px;
}

.n-layout-sider.note-list .n-layout-toggle-button {
    transition: right 1s;
}
</style>