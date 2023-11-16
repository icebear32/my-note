<script setup>
import gsap from "gsap"
import { ref, h, computed } from "vue"
import { useMessage, useLoadingBar, NIcon } from 'naive-ui'
import NoteCard from "@/components/note/NoteCard.vue"
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { PlusRound, SubtitlesOffOutlined, DriveFileRenameOutlineOutlined, DeleteOutlineRound, ArrowCircleUpRound, ArrowCircleDownRound } from "@vicons/material"

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 是否处于加载状态
const loading = ref(true)

// 笔记列表
const noteList = ref([])

// ===== 执行动画 =====
// 显示笔记卡片是否需要延迟动画
let enterDelay = true
// 隐藏笔记卡片是否需要动画
let hiddemAnimation = true

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
        duration: 0.5, //秒
        delay: () => (enterDelay ? el.dataset.index * 0.12 : 0), // 延迟动画
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
            width: 'calc(100% - 24px)',
            zIndex: 1,
            top,
            left,
            backdropFilter: 'blur(5px)'
        })
    }
}

// 执行隐藏动画
const leaveEvent = (el, done) => {
    if (hiddemAnimation) {
        gsap.to(el, {
            scale: 0, // 缩放
            duration: 0.5, //动画时间（秒）
            onComplete: done // 动画执行完毕后调用的函数
        })
    } else {
        gsap.to(el, {
            duration: 0, //动画时间（秒）
            onComplete: done // 动画执行完毕后调用的函数
        })
    }
}

/**
 * 获取笔记列表
 * @param {Boolean} ed 显示笔记卡片是否需要延迟动画
 * @param {Boolean} ha 隐藏笔记卡片是否需要动画
 * 
 * @returns {Promise<void>}
 */
const getNoteList = async (ed, ha) => {
    enterDelay = ed // 显示笔记卡片是否需要延迟动画
    hiddemAnimation = ha // 隐藏笔记卡片是否需要动画

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
        loading.value = false // 加载状态已结束
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}
// 获取笔记列表
getNoteList(true, true)

// ===== 右击菜单 =====
// 读取图标
const renderIcon = icon => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

// 右击菜单对象
const contextMenu = ref({
    show: false, // 是否显示右键菜单
    id: null, // 笔记编号
    title: '', // 笔记标题
    top: false, // 笔记是否置顶
    x: 0, // x 坐标
    y: 0, // y 坐标
    options: computed(() => {
        return [
            {
                label: "重命名",
                key: "rename",
                icon: renderIcon(DriveFileRenameOutlineOutlined)
            },
            {
                label: "删除",
                key: "delete",
                icon: renderIcon(DeleteOutlineRound)
            },
            {
                label: "取消置顶",
                key: "cancel-top",
                icon: renderIcon(ArrowCircleDownRound),
                show: contextMenu.value.top
            },
            {
                label: "置顶",
                key: "top",
                icon: renderIcon(ArrowCircleUpRound),
                show: !contextMenu.value.top
            }
        ]
    })
})

// 展示右键菜单
const showContextMenu = (e, id, top, title) => {
    e.preventDefault()
    contextMenu.value.show = false
    nextTick().then(() => {
        contextMenu.value.show = true
        contextMenu.value.id = id
        contextMenu.value.top = top
        contextMenu.value.title = title
        contextMenu.value.x = e.clientX
        contextMenu.value.y = e.clientY
    })
}

// 点击右击菜单的外界
const clickContextMenuOutside = () => {
    contextMenu.value.show = false
}

// 选择了右键菜单选项
const selectContextMenu = (key) => {
    contextMenu.value.show = false // 关闭右键菜单
    // message.info(String(key))
    // console.log(key)
    if (key === 'cancel-top') {
        topNote(false) // 取消置顶
    } else if (key === 'top') {
        topNote(true) // 置顶
    }
}

/**
 * 置顶笔记
 * @param {Boolean} isTop 是否为置顶请求
 */
const topNote = async isTop => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送置顶笔记请求
    const { data: responseData } = await noteBaseRequest.get(
        "/note/top",
        {
            params: { isTop, noteId: contextMenu.value.id },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error(isTop ? "置顶笔记请求失败" : "取消置顶笔记请求失败") // 请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 显示发送请求成功的通知
        getNoteList(false, false) // 重新获取笔记列表
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
                <!-- 笔记列表骨架屏 -->
                <n-space v-if="loading" vertical style="margin: 12px;">
                    <n-card size="small" v-for="n in 3" :key="n">
                        <n-space vertical>
                            <n-skeleton :height="26" :width="120"></n-skeleton>
                            <n-skeleton text :repeat="2"></n-skeleton>
                            <n-skeleton :height="23" :width="200"></n-skeleton>
                        </n-space>
                    </n-card>
                </n-space>
                <!-- 笔记列表 -->
                <n-list hoverable clickable style="margin: 5px;">
                    <TransitionGroup @before-enter="beforeEnter" @enter="enterEvent" @before-leave="beforeLeave"
                        @leave="leaveEvent" move-class="move-transition">
                        <template v-if="!loading && noteList.length > 0">
                            <n-list-item v-for="(n, index) in noteList" :key="n.id" :data-index="index"
                                @contextmenu="showContextMenu($event, n.id, !!n.top, n.title)"
                                :class="{ 'contexting': contextMenu.id === n.id && contextMenu.show }">
                                <NoteCard :id="n.id" :title="n.title" :desc="n.body" :top="!!n.top" :time="n.updateTime">
                                </NoteCard>
                            </n-list-item>
                        </template>
                    </TransitionGroup>
                </n-list>
                <!-- 暂无笔记列表的描述 -->
                <n-empty v-if="!loading && noteList.length === 0"
                    style="width: max-content;position: absolute;top: 50%;left: 50%;transform: translate(-105px, -79px);"
                    size="huge" description="暂无笔记列表，创建新的笔记">
                    <template #icon>
                        <n-icon :component="SubtitlesOffOutlined"></n-icon>
                    </template>
                    <template #extra>
                        <n-button dashed>创建笔记</n-button>
                    </template>
                </n-empty>
            </n-scrollbar>
        </n-layout-sider>
    </n-layout>
    <!-- 右键菜单 -->
    <n-dropdown :options="contextMenu.options" placement="bottom-start" trigger="manual" :x="contextMenu.x"
        :y="contextMenu.y" :show="contextMenu.show" :on-clickoutside="clickContextMenuOutside"
        @select="selectContextMenu" />
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

.n-list .n-list-item.move-transition {
    transition: all 0.5s;
}

.n-list .n-list-item.contexting {
    box-shadow: 0 0 5px #18A058;
}
</style>