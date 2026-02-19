<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import SliderControl from '@/components/ui/SliderControl.vue'
import ButtonControl from '@/components/ui/ButtonControl.vue'
import ToggleControl from '@/components/ui/ToggleControl.vue'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import TextInput from '@/components/ui/TextInput.vue'
import NumberInput from '@/components/ui/NumberInput.vue'

const wsUrl = import.meta.env.VITE_WEBSOCKET_URL
const mqttBroker = import.meta.env.VITE_MQTT_BROKER
const mqttTopicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX
</script>

<template>
    <div class="control-panel-view">
        <el-container>
            <el-header height="80px">
                <div class="header-content">
                    <div class="header-left">
                        <RouterLink to="/">
                            <el-button icon="ArrowLeft" circle />
                        </RouterLink>
                        <h1>Control Panel</h1>
                    </div>
                </div>
            </el-header>

            <el-main>
                <div class="content-wrapper">
                    <ConnectionStatus />

                    <el-row :gutter="20">
                        <!-- Sliders Column -->
                        <el-col :xs="24" :sm="12" :md="8">
                            <el-card shadow="hover" class="control-section">
                                <template #header>
                                    <div class="section-header">
                                        <span>Sliders</span>
                                    </div>
                                </template>
                                <div class="controls-grid">
                                    <SliderControl id="brightness" label="Brightness" :min="0" :max="100" :step="1"
                                        :default-value="75" />
                                    <SliderControl id="speed" label="Speed" :min="0" :max="10" :step="0.1"
                                        :default-value="5" />
                                    <SliderControl id="intensity" label="Intensity" :min="0" :max="1" :step="0.01"
                                        :default-value="0.5" />
                                </div>
                            </el-card>
                        </el-col>

                        <!-- Buttons & Toggles Column -->
                        <el-col :xs="24" :sm="12" :md="8">
                            <el-card shadow="hover" class="control-section">
                                <template #header>
                                    <div class="section-header">
                                        <span>Buttons & Toggles</span>
                                    </div>
                                </template>
                                <div class="controls-grid">
                                    <ButtonControl id="reset" label="Reset Scene" variant="danger" />
                                    <ButtonControl id="trigger" label="Trigger Effect" variant="primary" />
                                    <ButtonControl id="save" label="Save State" variant="success" />
                                    <ToggleControl id="enable" label="Enable Processing" active-text="On"
                                        inactive-text="Off" :default-value="true" />
                                    <ToggleControl id="debug" label="Debug Mode" active-text="On" inactive-text="Off"
                                        :default-value="false" />
                                </div>
                            </el-card>
                        </el-col>

                        <!-- Colors & Inputs Column -->
                        <el-col :xs="24" :sm="12" :md="8">
                            <el-card shadow="hover" class="control-section">
                                <template #header>
                                    <div class="section-header">
                                        <span>Colors & Inputs</span>
                                    </div>
                                </template>
                                <div class="controls-grid">
                                    <ColorPicker id="background" label="Background Color" default-value="#667eea" />
                                    <ColorPicker id="foreground" label="Foreground Color" default-value="#764ba2" />
                                    <TextInput id="message" label="Message Text" placeholder="Enter message..."
                                        :max-length="100" />
                                    <NumberInput id="count" label="Particle Count" :min="0" :max="1000" :step="10"
                                        :default-value="100" />
                                    <NumberInput id="rotation" label="Rotation (degrees)" :min="0" :max="360" :step="1"
                                        :default-value="0" />
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>

                    <!-- Info Section -->
                    <el-card shadow="hover" class="info-section">
                        <template #header>
                            <div class="section-header">
                                <span>Usage Information</span>
                            </div>
                        </template>
                        <el-alert title="How to Use" type="info" :closable="false">
                            <p>
                                All controls automatically send messages to vvvv via WebSocket and MQTT.
                                Make sure your vvvv application is running and listening on the configured ports.
                            </p>
                            <ul>
                                <li><strong>WebSocket:</strong> {{ wsUrl }}</li>
                                <li><strong>MQTT Broker:</strong> {{ mqttBroker }}</li>
                                <li><strong>Topic Prefix:</strong> {{ mqttTopicPrefix }}</li>
                            </ul>
                        </el-alert>
                    </el-card>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.control-panel-view {
    min-height: 100vh;
    background: #f5f7fa;
}

.el-header {
    background: white;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-left h1 {
    margin: 0;
    font-size: 24px;
    color: #303133;
}

.el-main {
    padding: 40px 20px;
}

.content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
}

.control-section {
    margin-bottom: 20px;
    height: 100%;
}

.section-header {
    font-weight: 600;
    font-size: 16px;
}

.controls-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-section {
    margin-top: 20px;
}

.info-section ul {
    margin: 12px 0 0 0;
    padding-left: 24px;
}

.info-section li {
    margin: 8px 0;
}
</style>
