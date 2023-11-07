<script setup>
import { ref } from 'vue'
import { storeToRefs } from "pinia"
import { useMessage, useLoadingBar } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { noteBaseRequest } from "@/request/note_request"
import { SubtitlesOffOutlined } from '@vicons/material'
import ThingCard from "@/components/thing/ThingCard.vue"
import gsap from "gsap"

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()
// 主题 store 对象
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore) // 是否为暗系主题

// ===== 获取小记列表 =====
// 是否处于加载中，true显示小记列表骨架屏，false显示小记列表
const loading = ref(true)
// 小记列表
const things = ref([])
/**
 * 获取小记列表
 * @returns {Promise<void>}
 */
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

        loading.value = false // 小记列表不处于记载状态
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}
getThingList()

// 执行动画之前的初始位置
const beforeEnter = (el) => {
    gsap.set(el, {
        x: 30,
        opacity: 0
    })
}

// 执行动画
const enterEvent = (el, done) => {
    gsap.to(el, {
        x: 0, // 偏移量
        opacity: 1, // 透明度
        duration: 3, //秒
        delay: el.dataset.index * 0.2, // 延迟动画
        onComplete: done // 动画执行完毕后调用的函数
    })
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
            <!-- 小记列表骨架屏 -->
            <n-space v-if="loading">
                <n-card embedded size="small" :bordered="isDarkTheme" :segmented="{ 'content': 'soft' }" v-for="n in 9">
                    <template #header>
                        <n-skeleton :width="180" size="small"></n-skeleton>
                    </template>
                    <template #header-extra>
                        <n-skeleton :width="20" repeat="3" circle style="margin-left: 6px;"></n-skeleton>
                    </template>
                    <template #default>
                        <n-space>
                            <n-skeleton :width="50" :height="22"></n-skeleton>
                            <n-skeleton :width="80" :height="22"></n-skeleton>
                            <n-skeleton :width="50" :height="22"></n-skeleton>
                        </n-space>
                    </template>
                    <template #footer>
                        <n-skeleton text :width="140"></n-skeleton>
                    </template>
                </n-card>
            </n-space>
            <!-- 小记列表 -->
            <n-space :wrap-item="false">
                <TransitionGroup @before-enter="beforeEnter" @enter="enterEvent">
                    <template v-if="!loading && things.length > 0">
                        <ThingCard class="thing-cards" v-for="thing in things" :key="thing.id" :id="thing.id"
                            :data-index="index" :title="thing.title" :finished="!!thing.finished" :top="!!thing.top"
                            :tags="thing.tags.split(',')" :time="thing.updateTime" @changeStatus="getThingList(false)">
                        </ThingCard>
                    </template>
                </TransitionGroup>
            </n-space>
            <!-- 暂无小记列表的描述 -->
            <n-empty v-if="!loading && things.length === 0" style="margin: 20px auto;" size="huge"
                description="暂无小记列表，创建新的小记">
                <template #icon>
                    <n-icon :component="SubtitlesOffOutlined"></n-icon>
                </template>
                <template #extra>
                    <n-button dashed>创建小记</n-button>
                </template>
            </n-empty>
        </n-card>
    </n-layout>
</template>

<style scoped>
.n-card .thing-cards {
    transition: all 0.5s;
}
</style>