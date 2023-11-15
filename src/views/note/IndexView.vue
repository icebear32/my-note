<script setup>
import { ref } from "vue"

// 笔记列表容器是否被收缩
const collapsed = ref(false)
</script>

<template>
    <!-- 笔记页面容器 -->
    <n-layout has-sider>
        <!-- 笔记列表容器（可收缩的） -->
        <n-layout-sider bordered show-trigger :width="340" class="note-list" :class="{ collapsed }" collapse-mode="width"
            :collapsed-width="0" :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
        </n-layout-sider>
    </n-layout>
</template>

<style>
.n-layout.n-layout--static-positioned {
    height: 100%;
}

/* 只有将笔记列表容器收起来时，切换按钮的位置才会在右边 */
.n-layout-sider.note-list.collapsed .n-layout-toggle-button {
    right: -30px;
}

.n-layout-sider.note-list .n-layout-toggle-button {
    transition: right 1s;
}
</style>