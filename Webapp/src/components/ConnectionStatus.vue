<script setup lang="ts">
import { computed } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'

const commStore = useCommunicationStore()

const wsStatus = computed(() => commStore.wsConnected ? 'success' : 'danger')
const mqttStatus = computed(() => commStore.mqttConnected ? 'success' : 'danger')
const wsText = computed(() => commStore.wsConnected ? 'Connected' : 'Disconnected')
const mqttText = computed(() => commStore.mqttConnected ? 'Connected' : 'Disconnected')
</script>

<template>
    <div class="connection-status">
        <el-card shadow="hover">
            <template #header>
                <div class="card-header">
                    <span>Connection Status</span>
                </div>
            </template>
            <div class="status-grid">
                <div class="status-item">
                    <span class="status-label">WebSocket:</span>
                    <el-tag :type="wsStatus" size="large">
                        {{ wsText }}
                    </el-tag>
                </div>
                <div class="status-item">
                    <span class="status-label">MQTT:</span>
                    <el-tag :type="mqttStatus" size="large">
                        {{ mqttText }}
                    </el-tag>
                </div>
            </div>
            <el-divider />
            <div class="status-summary">
                <el-badge :value="commStore.isFullyConnected ? '✓' : '✗'"
                    :type="commStore.isFullyConnected ? 'success' : 'danger'">
                    <span class="summary-text">
                        {{ commStore.isFullyConnected ? 'All Systems Online' : 'Connection Issues' }}
                    </span>
                </el-badge>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.connection-status {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
}

.status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 12px;
}

.status-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.status-label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

.status-summary {
    text-align: center;
    padding: 8px 0;
}

.summary-text {
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
}
</style>
