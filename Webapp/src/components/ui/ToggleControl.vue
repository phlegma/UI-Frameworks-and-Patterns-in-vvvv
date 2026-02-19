<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'

interface Props {
    id: string
    label: string
    activeText?: string
    inactiveText?: string
    defaultValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    activeText: 'On',
    inactiveText: 'Off',
    defaultValue: false
})

const value = ref(props.defaultValue)
const commStore = useCommunicationStore()

watch(value, (newValue) => {
    commStore.sendControl('toggle', props.id, newValue)
})
</script>

<template>
    <div class="control-item toggle-control">
        <label>{{ label }}</label>
        <el-switch v-model="value" :active-text="activeText" :inactive-text="inactiveText" size="large" />
    </div>
</template>

<style scoped>
.toggle-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.toggle-control label {
    margin-bottom: 0;
}
</style>
