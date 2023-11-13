<script setup>
import bus from 'vue3-eventbus'
import { h } from "vue"
import { useRouter } from "vue-router"
import { NIcon } from "naive-ui"
import { AddBoxRound, EventNoteRound, StickyNote2Outlined } from "@vicons/material"

// 路由对象
const router = useRouter() // 路由对象

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
</script>

<template>
    <n-dropdown :options="addBoxOptions" placement="right-start">
        <n-button text type="primary">
            <n-icon size="34" :component="AddBoxRound"></n-icon>
        </n-button>
    </n-dropdown>
</template>

<style></style>