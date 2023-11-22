<script setup>
import bus from 'vue3-eventbus'
import { h, inject } from "vue"
import { useRouter } from "vue-router"
import { NIcon } from "naive-ui"
import { AccessTimeRound, AddBoxRound, DeleteOutlineRound, EventNoteRound, SearchRound, ShoppingBagOutlined, StarBorderRound, StickyNote2Outlined } from "@vicons/material"

// 路由对象
const router = useRouter() // 路由对象
const routerPath = inject('routerPath') // 路由地址

// 读图标
const renderIcon = (icon, size, color) => {
    return () => h(NIcon, { size, color }, { default: () => h(icon) })
}

// 新增笔记小记菜单选项
const addBoxOptions = [
    {
        label: "新增笔记",
        key: "note",
        icon: renderIcon(StickyNote2Outlined, 22, "#18a058")
    },
    {
        label: "新增小记",
        key: "thing",
        icon: renderIcon(EventNoteRound, 22, "#2080f0"),
        props: {
            onClick: () => {
                // 跳转至路由为 /thing
                router.push("/thing").then(() => {
                    bus.emit('newCreateThing')
                })
            }
        }
    },
]

// 主要菜单
const mainMenus = [
    {
        label: '最近操作', // 弹出信息
        icon: AccessTimeRound, // 图标
        icon_size: 24, // 图标大小
        to: '' // 路由地址
    },
    {
        label: '笔记',
        icon: StickyNote2Outlined,
        icon_size: 24,
        to: '/note'
    },
    {
        label: '小记',
        icon: EventNoteRound,
        icon_size: 24,
        to: '/thing'
    },
    {
        label: '收藏',
        icon: StarBorderRound,
        icon_size: 28,
        to: ''
    },
    {
        label: '商城',
        icon: ShoppingBagOutlined,
        icon_size: 24,
        to: ''
    },
    {
        label: '回收站',
        icon: DeleteOutlineRound,
        icon_size: 28,
        to: ''
    }
]

/**
 * 是否高亮显示菜单按钮
 * @param {String} toRouterPath 菜单跳转的路由地址
 */
const isHighlightMenu = (toRouterPath) => {
    if (!toRouterPath) return false
    return routerPath.value.startsWith(toRouterPath) // 判断路由地址是否以（菜单跳转的路由地址）为开头
}
</script>

<template>
    <n-space vertical>
        <!-- 添加文件图标 -->
        <n-dropdown :options="addBoxOptions" placement="right-start">
            <n-button text type="primary">
                <n-icon size="34" :component="AddBoxRound"></n-icon>
            </n-button>
        </n-dropdown>
        <!-- 搜索文件图标 -->
        <n-button text>
            <n-icon size="26" :component="SearchRound"></n-icon>
        </n-button>
    </n-space>
    <!-- 分割线 -->
    <n-divider style="width: 34px; margin: 15px auto;"></n-divider>
    <n-space vertical :size="16">
        <n-popover v-for="menu in mainMenus" :key="menu.label" placement="right" :show-arrow="false">
            <template #trigger>
                <n-button style="width: 34px;padding: 0;" :quaternary="!isHighlightMenu(menu.to)"
                    :type="isHighlightMenu(menu.to) ? 'primary' : 'default'" :tertiary="isHighlightMenu(menu.to)"
                    @click="router.push(menu.to)">
                    <n-icon :size="menu.icon_size" :component="menu.icon"></n-icon>
                </n-button>
            </template>
            <span>{{ menu.label }}</span>
        </n-popover>
    </n-space>
</template>

<style></style>