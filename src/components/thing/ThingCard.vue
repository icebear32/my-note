<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from "pinia"
import { useThemeStore } from '@/stores/themeStore'
import { useMessage, useLoadingBar } from 'naive-ui'
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { DeleteOutlineRound, ArrowCircleUpRound, ArrowCircleDownRound, EditNoteRound } from '@vicons/material'

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 主题 store 对象
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore) // 是否为暗系主题

// ===== 小记卡片的效果 =====
// 小记已完成图像的影子的颜色
const thingFinishShadowColor = computed(() => {
    return isDarkTheme.value ? "#abaaaa" : "#676767"
})

// 自定义属性
const propsData = defineProps({
    id: { type: Number, required: true }, //编号
    finished: { type: Boolean, default: false }, //是否已完成
    title: { type: String, required: true }, //标题
    top: { type: Boolean, default: false }, //是否置顶
    tags: { type: Array, default: ['暂无标签'] }, // 标签
    time: { type: String, required: true } //最后一次操作的时间
})

// 自定义事件
const emits = defineEmits(['changeStatus'])

// 置顶按钮是否被禁用
const topBtnDisabled = ref(false)

/**
 * 小记置顶对象
 * @param top 是否置顶
 */
const thingCardTopIconText = computed(() => {
    if (propsData.top) {
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
})

/**
 * 置顶小记
 * @param {Boolean} isTop 是否为置顶请求
 */
const topThing = async (isTop) => {

    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    topBtnDisabled.value = true // 禁用小记的置顶按钮

    // 发送置顶小记请求
    const { data: responseData } = await noteBaseRequest.get(
        "/thing/top",
        {
            params: { isTop, thingId: propsData.id },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        topBtnDisabled.value = false // 解除禁用小记的置顶按钮
        throw message.error(isTop ? "置顶小记请求失败" : "取消置顶小记请求失败") // 请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    topBtnDisabled.value = false // 解除禁用小记的置顶按钮
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 显示发送请求成功的通知 

        // getThingList(false) // 重新获取小记列表
        emits('changeStatus') // 告诉父组件改变了状态，让其重新获取小记列表
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
    <n-card style="min-width: 220px;" embedded :class="{ 'thing-card-finished': finished }" size="small"
        :bordered="isDarkTheme" :segmented="{ 'content': true }" :title="title">
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
                    <n-button :disabled="topBtnDisabled" text style="margin-left: 8px;" @click="topThing(!top)">
                        <n-icon :size="18" :component="thingCardTopIconText.icon"></n-icon>
                    </n-button>
                </template>
                {{ thingCardTopIconText.text }}
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
                <n-tag v-for="tag in tags" size="small" :bordered="false">
                    {{ tag }}
                </n-tag>
            </n-space>
        </template>
        <!-- 置顶标签、最后一次操作时间 -->
        <template #footer>
            <n-space align="center" :size="3">
                <n-tag v-if="top" size="small" :bordered="false" type="success">置顶</n-tag>
                <n-divider v-if="top" vertical></n-divider>
                <n-text depth="3">{{ time }}</n-text>
            </n-space>
        </template>
    </n-card>
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