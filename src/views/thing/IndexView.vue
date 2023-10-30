<script setup>
import { computed } from 'vue'
import { storeToRefs } from "pinia"
import { DeleteOutlineRound, ArrowCircleUpRound, ArrowCircleDownRound, EditNoteRound } from '@vicons/material'
import { useMessage, useLoadingBar } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
import { getUserToken } from '@/utils/userLoginUtil'
import { noteBaseRequest } from "@/request/note_request"

// ===== 小记卡片的效果 =====
// 主题 store 对象
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore) // 是否为暗系主题
// 小记已完成图像的影子的颜色
const thingFinishShadowColor = computed(() => {
    return isDarkTheme.value ? "#abaaaa" : "#676767"
})

// ===== 获取小记列表 =====
// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()
// 获取小记列表
const getThingList = async () => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    // console.log(userToken)

    // 发送获取小记列表请求
    loadingBar.start() // 加载条开始
    // 发送登录请求
    const { data: responseData } = await noteBaseRequest.get(
        "/thing/list",
        {
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("获取小记列表请求失败") // 获取小记列表请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        console.log(responseData.data)
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示请求失败的通知 
    }
}

getThingList()
</script>

<template>
    <n-layout embedded content-style="padding: 24px">
        <!-- 小记列表页的标头 -->
        <n-card size="small" :bordered="false">
            <!-- 小记页面标题 -->
            <template #header>
                <h3>小记列表</h3>
            </template>
            <!-- 新增小记按钮 -->
            <template #header-extra>
                <n-button dashed>新增小记</n-button>
            </template>
        </n-card>
        <!-- 小记列表容器 -->
        <n-card size="small" :bordered="false" style="margin-top: 20px;">
            <n-space>
                <n-card embedded class="thing-card-finished" size="small" :bordered="isDarkTheme"
                    :segmented="{ 'content': true }" title="2023 年开学第一周作业">
                    <template #header-extra>
                        <!-- 删除按钮 -->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left: 16px;">
                                    <n-icon :size="18" :component="DeleteOutlineRound"></n-icon>
                                </n-button>
                            </template>
                            删除
                        </n-popover>
                        <!-- 置顶按钮 -->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left: 8px;">
                                    <n-icon :size="18" :component="ArrowCircleUpRound"></n-icon>
                                </n-button>
                            </template>
                            置顶
                        </n-popover>
                        <!-- 取消置顶按钮 -->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left: 8px;">
                                    <n-icon :size="18" :component="ArrowCircleDownRound"></n-icon>
                                </n-button>
                            </template>
                            取消置顶
                        </n-popover>
                        <!-- 编辑按钮 -->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left: 8px;">
                                    <n-icon :size="18" :component="EditNoteRound"></n-icon>
                                </n-button>
                            </template>
                            编辑
                        </n-popover>

                    </template>
                    <!-- 小记标签 -->
                    <template #default>
                        <n-space>
                            <n-tag size="small" :bordered="false">作业</n-tag>
                            <n-tag size="small" :bordered="false">大学生</n-tag>
                        </n-space>
                    </template>
                    <!-- 置顶标签、最后一次操作时间 -->
                    <template #footer>
                        <n-space align="center" :size="3">
                            <n-tag size="small" :bordered="false" type="success">置顶</n-tag>
                            <n-divider vertical></n-divider>
                            <n-text depth="3">2023-10-29 23:57:10</n-text>
                        </n-space>
                    </template>
                </n-card>
            </n-space>
        </n-card>
    </n-layout>
</template>

<style scoped>
.n-card.thing-card-finished::after {
    position: absolute;
    content: '';
    width: 100px;
    height: 100px;
    /* border: 1px solid black; */
    bottom: 50%;
    left: 40px;
    transform: translateY(50px);
    background-image: url("@/assets/finish.png");
    background-size: 100px 100px;
    background-repeat: no-repeat;
    filter: drop-shadow(5px 5px 2px v-bind(thingFinishShadowColor));
}
</style>