<script setup>
import { htmlToText } from "html-to-text"

defineProps({
    id: { type: Number, required: true }, // 编号
    title: { type: String, required: true }, // 标题
    desc: { type: String, default: () => "暂无内容" }, // 简介
    top: { type: Boolean, default: false }, // 是否置顶
    time: { type: String, required: true }, // 时间（最后一次操作的时间）
})
</script>

<template>
    <n-thing class="note-card">
        <template #header>
            <n-ellipsis line-clamp="1">{{ title }}</n-ellipsis>
        </template>
        <template #description>
            <n-ellipsis line-clamp="2" :tooltip="false">
                <n-text depth="3">{{ htmlToText(desc) }}</n-text>
            </n-ellipsis>
        </template>
        <template #default>
            <n-space align="center" :size="8">
                <n-tag v-if="top" type="primary" size="small" :bordered="false">置顶</n-tag>
                <n-divider v-if="top" vertical />
                <n-text depth="3">{{ time }}</n-text>
            </n-space>
        </template>
    </n-thing>
</template>

<style>
.n-thing.note-card {
    word-break: break-all;
}
</style>