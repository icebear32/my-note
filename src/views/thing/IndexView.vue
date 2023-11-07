<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from "pinia"
import { DeleteOutlineRound, ArrowCircleUpRound, ArrowCircleDownRound, EditNoteRound } from '@vicons/material'
import { useMessage, useLoadingBar } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
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
// 小记列表
const things = ref([])
/**
 * 小记置顶对象
 * @param top 是否置顶
 */
const thingCardTopIconText = top => {
    if (top) {
        return {
            icon: ArrowCircleDownRound,
            text: '取消置顶'
        }
    } else {
        return {
            icon: ArrowCircleUpRound,
            text: '置顶'
        }
    }
}
// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 获取小记列表
const getThingList = async () => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    // console.log(userToken)
    loadingBar.start() // 加载条开始

    // 发送获取小记列表请求
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
        things.value = responseData.data // 小记列表
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}

getThingList()

/**
 * 置顶小记
 * @param {Boolean} isTop 是否为置顶请求
 * @param {Number} thingId 小记编号
 * @param {Number} index 小记索引
 */
const topThing = async (isTop, thingId, index) => {

    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    const thing = things.value[index]; // 当前小记对象
    thing.toTop = true // 禁用小记的置顶按钮

    // 发送置顶小记请求
    const { data: responseData } = await noteBaseRequest.get(
        "/thing/top",
        {
            params: { isTop, thingId },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        thing.toTop = false // 解除禁用小记的置顶按钮
        throw message.error(isTop ? "置顶小记请求失败" : "取消置顶小记请求失败") // 请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 显示发送请求成功的通知 
        getThingList() // 重新获取小记列表
    } else {
        loadingBar.error() // 加载条异常结束 
        thing.toTop = false // 解除禁用小记的置顶按钮
        message.error(responseData.message) // 显示发送请求失败的通知
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}
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
                <n-card style="min-width: 220px;" v-for="(t, index) in things" :key="t.id" embedded
                    :class="{ 'thing-card-finished': t.finished }" size="small" :bordered="isDarkTheme"
                    :segmented="{ 'content': true }" :title="t.title">
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
                        <!-- 置顶按钮/取消置顶按钮 -->
                        <n-popover>
                            <template #trigger>
                                <!-- 0 false -> true -->
                                <!-- 1 true -> false -->
                                <n-button :disabled="t.toTop" text style="margin-left: 8px;"
                                    @click="topThing(!!!t.top, t.id, index)">
                                    <n-icon :size="18" :component="thingCardTopIconText(t.top).icon"></n-icon>
                                </n-button>
                            </template>
                            {{ thingCardTopIconText(t.top).text }}
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
                            <n-tag v-for="tag in t.tags.split(',')" :key="tag" size="small" :bordered="false">{{ tag
                            }}</n-tag>
                        </n-space>
                    </template>
                    <!-- 置顶标签、最后一次操作时间 -->
                    <template #footer>
                        <n-space align="center" :size="3">
                            <n-tag v-if="t.top" size="small" :bordered="false" type="success">置顶</n-tag>
                            <n-divider v-if="t.top" vertical></n-divider>
                            <n-text depth="3">{{ t.updateTime }}</n-text>
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