<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ConnectionStatus from '@/components/ConnectionStatus.vue'

const wsUrl = import.meta.env.VITE_WEBSOCKET_URL
const mqttBroker = import.meta.env.VITE_MQTT_BROKER
const mqttTopicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX
</script>

<template>
    <div class="home-view">
        <el-container>
            <el-header height="80px">
                <div class="header-content">
                    <h1>vvvv Control Panel</h1>
                    <p>Web-based control interface for vvvv applications</p>
                </div>
            </el-header>

            <el-main>
                <div class="content-wrapper">
                    <ConnectionStatus />

                    <el-card shadow="hover" class="welcome-card">
                        <template #header>
                            <div class="card-header">
                                <span>Welcome</span>
                            </div>
                        </template>
                        <div class="welcome-content">
                            <p>
                                This webapp provides a modern web interface to control vvvv applications
                                using WebSocket and MQTT protocols.
                            </p>
                            <el-divider />
                            <h3>Features:</h3>
                            <ul>
                                <li>Real-time bidirectional communication</li>
                                <li>WebSocket for low-latency control</li>
                                <li>MQTT for pub/sub messaging</li>
                                <li>Professional UI with Element Plus</li>
                                <li>TypeScript for type safety</li>
                                <li>Automatic reconnection</li>
                            </ul>
                            <el-divider />
                            <div class="action-buttons">
                                <RouterLink to="/control-panel">
                                    <el-button type="primary" size="large">
                                        Open Control Panel (Element Plus)
                                    </el-button>
                                </RouterLink>
                                <RouterLink to="/vuetify-showcase">
                                    <el-button type="success" size="large">
                                        Open Vuetify Showcase
                                    </el-button>
                                </RouterLink>
                            </div>
                        </div>
                    </el-card>

                    <el-card shadow="hover" class="info-card">
                        <template #header>
                            <div class="card-header">
                                <span>Connection Info</span>
                            </div>
                        </template>
                        <div class="info-content">
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="WebSocket URL">
                                    {{ wsUrl }}
                                </el-descriptions-item>
                                <el-descriptions-item label="MQTT Broker">
                                    {{ mqttBroker }}
                                </el-descriptions-item>
                                <el-descriptions-item label="MQTT Topic Prefix">
                                    {{ mqttTopicPrefix }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-card>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.home-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.el-header {
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-content h1 {
    margin: 0;
    font-size: 28px;
    color: #303133;
}

.header-content p {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #909399;
}

.el-main {
    padding: 40px 20px;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-card,
.info-card {
    margin-bottom: 20px;
}

.card-header {
    font-weight: 600;
    font-size: 18px;
}

.welcome-content {
    font-size: 15px;
    line-height: 1.6;
}

.welcome-content h3 {
    margin: 16px 0 12px 0;
    color: #303133;
}

.welcome-content ul {
    margin: 0;
    padding-left: 24px;
}

.welcome-content li {
    margin: 8px 0;
    color: #606266;
}

.action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 24px;
}

.info-content {
    font-size: 14px;
}
</style>
