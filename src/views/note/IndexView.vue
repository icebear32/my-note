<script setup>
import { ref } from "vue"
import NoteCard from "@/components/note/NoteCard.vue"
import { PlusRound } from "@vicons/material"

// 笔记列表容器是否被收缩
const collapsed = ref(false)
</script>

<template>
    <!-- 笔记页面容器 -->
    <n-layout has-sider>
        <!-- 笔记列表容器（可收缩的） -->
        <n-layout-sider bordered show-trigger :width="340" class="note-list" collapse-mode="width" :collapsed-width="0"
            :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
            <!-- 标题区域，新增笔记按钮 -->
            <n-card :bordered="false">
                <template #action>
                    <n-space align="center" justify="space-between">
                        <h3 style="margin: 0;">笔记列表</h3>
                        <n-button circle type="primary">
                            <n-icon size="22" :component="PlusRound">新增</n-icon>
                        </n-button>
                    </n-space>
                </template>
            </n-card>
            <n-list hoverable clickable style="margin: 5px;">
                <n-list-item>
                    <NoteCard desc="1" time="2022-10-22" title="vue3"></NoteCard>
                </n-list-item>
            </n-list>
            <!-- 笔记列表 -->
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