<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'

interface Props {
    id: string
    label: string
    showAlpha?: boolean
    defaultValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    showAlpha: false,
    defaultValue: '#409EFF'
})

const value = ref(props.defaultValue)
const commStore = useCommunicationStore()

watch(value, (newValue) => {
    commStore.sendControl('color', props.id, newValue)
})
</script>

<template>
    <div class="control-item color-picker-control">
        <label>{{ label }}</label>
        <div class="picker-wrapper">
            <el-color-picker v-model="value" :show-alpha="showAlpha" size="large" />
            <span class="color-value">{{ value }}</span>
        </div>
    </div>
</template>

<style scoped>
.color-picker-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.picker-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.color-value {
    font-family: monospace;
    font-size: 14px;
    color: #606266;
}
</style>
