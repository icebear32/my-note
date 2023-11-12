<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from "pinia"
import { useMessage, useLoadingBar } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { noteBaseRequest } from "@/request/note_request"
import { SubtitlesOffOutlined } from '@vicons/material'
import ThingCard from "@/components/thing/ThingCard.vue"
import gsap from "gsap"
import DeleteRemindDialog from '@/components/remind/DeleteRemindDialog.vue'
import EditThingModel from '@/components/thing/EditThingModel.vue'

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()
// 主题 store 对象
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore) // 是否为暗系主题

// ===== 搜索输入框、过滤 =====
// 搜索关键字
const search = ref(null)

// 过滤选择器值
const filter = ref(null)

// 过滤选项
const filterOptions = [
    {
        label: '默认',
        value: null
    },
    {
        label: '未完成',
        value: 0
    },
    {
        label: '已完成',
        value: 1
    }
]

// 显示小记卡片是否需要延迟动画
let enterDelay = true
// 隐藏小记卡片是否需要动画
let hiddemAnimation = true

// ===== 获取小记列表 =====
// 是否处于加载中，true显示小记列表骨架屏，false显示小记列表
const loading = ref(true)
// 小记列表
const things = ref([])

/**
 * 获取小记列表
 * 
 * @param {Boolean} ed 显示小记卡片是否需要延迟动画
 * @param {Boolean} ha 隐藏小记卡片是否需要动画
 * @returns {Promise<void>}
 */
const getThingList = async (ed, ha) => {
    enterDelay = ed // 显示小记卡片是否需要延迟动画
    hiddemAnimation = ha // 隐藏小记卡片是否需要动画

    // 判断用户的登录状态
    const userToken = await getUserToken()
    // console.log(userToken)
    loadingBar.start() // 加载条开始

    // 发送获取小记列表请求
    const { data: responseData } = await noteBaseRequest.get(
        "/thing/list",
        {
            params: {
                search: search.value,
                filter: filter.value
            },
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

// 首次进入页面：获取小记列表(需要有显示的延迟动画)
getThingList(true, false)

// ===== 执行动画 =====
// 执行显示动画之前的初始位置
const beforeEnter = (el) => {
    gsap.set(el, {
        x: 30,
        opacity: 0
    })
}

// 执行显示动画
const enterEvent = (el, done) => {
    gsap.to(el, {
        x: 0, // 偏移量
        opacity: 1, // 透明度
        duration: 3, //秒
        delay: () => (enterDelay ? el.dataset.index * 0.2 : 0), // 延迟动画
        onComplete: done // 动画执行完毕后调用的函数
    })
}

// 执行隐藏动画之前的初始位置
const beforeLeave = (el) => {
    if (hiddemAnimation) {
        // 获取删除的元素距离父组件的左和上位置
        const left = el.offsetLeft
        const top = el.offsetTop
        // 设置删除组件的属性（需要脱离文档里）
        gsap.set(el, {
            position: 'absolute',
            boxShadow: '0 0 5px black',
            zIndex: 1,
            top,
            left
        })
    }
}

// 执行隐藏动画
const leaveEvent = (el, done) => {
    if (hiddemAnimation) {
        let tl = gsap.timeline() // 创建时间线动画
        tl.to(el, {
            scale: 1.3, // 缩放
            duration: 0.25, //动画时间（秒）
        }).to(el, {
            scale: 0, // 缩放
            duration: 0.25, //动画时间（秒）
            onComplete: done // 动画执行完毕后调用的函数
        })
    } else {
        gsap.to(el, {
            duration: 0, //动画时间（秒）
            onComplete: done // 动画执行完毕后调用的函数
        })
    }

}

// ===== 删除小记提醒框 =====
// 删除提醒框的对象
const deleteRemind = ref({
    show: false, // 是否显示
    id: null, // 小记编号
    desc: null, // 提醒框的描述内容
})
// 显示删除小记提醒框
const showDeleteRemindDialog = ({ id, title }) => {
    deleteRemind.value.id = id // 将要删除的小记编号
    deleteRemind.value.desc = "删除《" + title + "》将会在回收站中恢复，彻底删除则无法恢复！" // 删除提醒框的描述内容
    deleteRemind.value.show = true // 显示删除提醒框
}
/**
 * 删除小记
 * @param {Boolean} complete 是否彻底删除
 */
const toDeleteThing = async complete => {
    deleteRemind.value.show = false // 关闭提醒框

    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送删除小记请求
    const { data: responseData } = await noteBaseRequest.delete(
        "/thing/delete",
        {
            params: {
                complete,
                isRecycleBin: false,
                thingId: deleteRemind.value.id
            },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error(complete ? "彻底删除小记请求失败" : "删除小记请求失败") // 请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)

    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 显示发送请求成功的通知 
        getThingList(false, true) // 重新获取小记列表(需要有删除动画)
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}

// ===== 待办事项列表 =====
// 创建一个待办事项的
const onCreateTuDoThing = () => ({
    checked: false, // 是否已完成
    thing: '' // 待办事项
})

// 待办事项内容
const toDuThingContent = ref([])

// 小记是否已完成所有的待办事项
const isFinished = computed(() => {
    if (toDuThingContent.value.length === 0) return false
    return toDuThingContent.value.every(item => item.checked)
})

// 编辑小记模态框组件的引用
const editThingModalRef = ref(null)
</script>

<template>
    <!-- 小记页 -->
    <n-layout embedded content-style="padding: 24px">
        <!-- 小记列表页的标头 -->
        <n-card size="small" :bordered="false">
            <!-- 小记页面标题 -->
            <template #header>
                <h3>小记列表</h3>
            </template>
            <!-- 新增小记按钮 -->
            <template #header-extra>
                <n-space>
                    <!-- 搜索输入框 -->
                    <n-input-group>
                        <n-input v-model:value="search" placeholder="搜索" />
                        <n-button @click="getThingList(false)">搜索</n-button>
                    </n-input-group>
                    <!-- 过滤选项 -->
                    <n-select v-model:value="filter" :options="filterOptions" @update:value="getThingList(false)"
                        placeholder="过滤" style="width: 130px;" />
                    <!-- 新增小记按钮 -->
                    <n-button dashed @click="editThingModalRef.showEditModal(null)">新增小记</n-button>
                </n-space>
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
                <TransitionGroup @before-enter="beforeEnter" @enter="enterEvent" @before-leave="beforeLeave"
                    @leave="leaveEvent" move-class="move-transition">
                    <template v-if="!loading && things.length > 0">
                        <ThingCard v-for="thing in things" :key="thing.id" :id="thing.id" :data-index="index"
                            :title="thing.title" :finished="!!thing.finished" :top="!!thing.top"
                            :tags="thing.tags.split(',')" :time="thing.updateTime"
                            @changeStatus="getThingList(false, false)" @delete="showDeleteRemindDialog"
                            @edit="editThingModalRef.showEditModal(thing.id)">
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
                    <n-button dashed @click="editThingModalRef.showEditModal(null)">创建小记</n-button>
                </template>
            </n-empty>
        </n-card>
    </n-layout>
    <!-- 删除提醒框 -->
    <DeleteRemindDialog :show="deleteRemind.show" :describe="deleteRemind.desc" @delete="toDeleteThing"
        @cancel="deleteRemind.show = false"></DeleteRemindDialog>
    <!-- 编辑小记窗口 -->
    <EditThingModel ref="editThingModalRef" @save="getThingList"></EditThingModel>
</template>

<style>
.move-transition {
    transition: all 0.5s;
}
</style>