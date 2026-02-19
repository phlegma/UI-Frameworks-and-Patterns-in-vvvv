<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'
import { useDebounceFn } from '@vueuse/core'

interface Props {
    id: string
    label: string
    placeholder?: string
    maxLength?: number
    defaultValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter text...',
    defaultValue: ''
})

const value = ref(props.defaultValue)
const commStore = useCommunicationStore()

const debouncedSend = useDebounceFn((newValue: string) => {
    commStore.sendControl('text', props.id, newValue)
}, 300)

watch(value, (newValue) => {
    debouncedSend(newValue)
})
</script>

<template>
    <div class="control-item text-input-control">
        <label>{{ label }}</label>
        <el-input v-model="value" :placeholder="placeholder" :maxlength="maxLength" show-word-limit clearable />
    </div>
</template>

<style scoped>
.text-input-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
