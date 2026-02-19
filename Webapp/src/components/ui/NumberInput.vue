<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'

interface Props {
    id: string
    label: string
    min?: number
    max?: number
    step?: number
    precision?: number
    defaultValue?: number
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
    defaultValue: 0
})

const value = ref(props.defaultValue)
const commStore = useCommunicationStore()

watch(value, (newValue) => {
    commStore.sendControl('number', props.id, newValue)
})
</script>

<template>
    <div class="control-item number-input-control">
        <label>{{ label }}</label>
        <el-input-number v-model="value" :min="min" :max="max" :step="step" :precision="precision"
            controls-position="right" style="width: 100%" />
    </div>
</template>

<style scoped>
.number-input-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
