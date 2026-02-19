<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'
import { useDebounceFn } from '@vueuse/core'

interface Props {
    id: string
    label: string
    min?: number
    max?: number
    step?: number
    defaultValue?: number
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50
})

const value = ref(props.defaultValue)
const commStore = useCommunicationStore()

// Debounce updates to avoid flooding the connection
const debouncedSend = useDebounceFn((newValue: number) => {
    commStore.sendControl('slider', props.id, newValue)
}, 50)

watch(value, (newValue) => {
    debouncedSend(newValue)
})
</script>

<template>
    <div class="control-item slider-control">
        <label>{{ label }}</label>
        <el-slider v-model="value" :min="min" :max="max" :step="step" show-input :show-input-controls="false" />
        <div class="value-display">
            Current: {{ value }}
        </div>
    </div>
</template>

<style scoped>
.slider-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.value-display {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
}
</style>
