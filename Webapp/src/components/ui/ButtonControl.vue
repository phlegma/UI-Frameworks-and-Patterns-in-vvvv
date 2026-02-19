<script setup lang="ts">
import { useCommunicationStore } from '@/stores/communication.store'

interface Props {
    id: string
    label: string
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary'
})

const commStore = useCommunicationStore()

const handleClick = () => {
    commStore.sendControl('button', props.id, true)
}
</script>

<template>
    <div class="control-item button-control">
        <el-button :type="variant" size="large" @click="handleClick">
            {{ label }}
        </el-button>
    </div>
</template>

<style scoped>
.button-control {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-control .el-button {
    width: 100%;
}
</style>
