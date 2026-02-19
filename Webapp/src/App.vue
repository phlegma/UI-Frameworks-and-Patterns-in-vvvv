<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCommunicationStore } from '@/stores/communication.store'

const commStore = useCommunicationStore()

onMounted(() => {
    // Initialize WebSocket and MQTT connections
    commStore.initializeConnections()
})
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
