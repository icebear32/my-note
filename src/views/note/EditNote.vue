<script setup>
defineProps({
    id: { type: Number, required: true }
})
</script>

<template>
    <n-button>笔记编辑容器{{ id }}</n-button>
</template>