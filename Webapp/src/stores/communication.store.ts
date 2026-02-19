import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WebSocketService } from '@/services/websocket.service'
import { MQTTService } from '@/services/mqtt.service'
import type { Message, ComponentType } from '@/types'

export const useCommunicationStore = defineStore('communication', () => {
    // State
    const wsConnected = ref(false)
    const mqttConnected = ref(false)
    const wsService = ref<WebSocketService | null>(null)
    const mqttService = ref<MQTTService | null>(null)
    const lastMessage = ref<Message | null>(null)
    const messageHistory = ref<Message[]>([])
    const maxHistorySize = 100

    // Getters
    const isFullyConnected = computed(() => wsConnected.value && mqttConnected.value)
    const connectionStatus = computed(() => ({
        websocket: wsConnected.value,
        mqtt: mqttConnected.value,
        full: isFullyConnected.value
    }))

    // Actions
    function initializeConnections() {
        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL
        const mqttBroker = import.meta.env.VITE_MQTT_BROKER
        const mqttClientId = import.meta.env.VITE_MQTT_CLIENT_ID

        // Initialize WebSocket
        wsService.value = new WebSocketService(wsUrl)
        wsService.value.onConnectionChange((connected) => {
            wsConnected.value = connected
        })
        wsService.value.onMessage((message) => {
            handleIncomingMessage(message)
        })
        wsService.value.connect()

        // Initialize MQTT
        mqttService.value = new MQTTService(mqttBroker, {
            clientId: mqttClientId + '_' + Math.random().toString(16).substring(2, 8),
            clean: true,
            reconnectPeriod: 1000,
        })
        mqttService.value.onConnectionChange((connected) => {
            mqttConnected.value = connected
        })
        mqttService.value.onMessage((topic, message) => {
            handleIncomingMQTTMessage(topic, message)
        })
        mqttService.value.connect()

        // Subscribe to feedback topics
        const topicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX
        mqttService.value.subscribe(`${topicPrefix}/feedback/#`)
        mqttService.value.subscribe(`${topicPrefix}/status/#`)
    }

    function disconnectAll() {
        wsService.value?.disconnect()
        mqttService.value?.disconnect()
        wsConnected.value = false
        mqttConnected.value = false
    }

    function sendWebSocketMessage(data: Message) {
        if (wsService.value) {
            wsService.value.send(data)
            addToHistory(data)
        }
    }

    function publishMQTT(topic: string, message: any) {
        if (mqttService.value) {
            mqttService.value.publish(topic, message)
        }
    }

    function sendControl(component: ComponentType, id: string, value: any) {
        const message: Message = {
            type: 'control',
            component,
            id,
            value,
            timestamp: Date.now()
        }

        // Send via WebSocket
        sendWebSocketMessage(message)

        // Also publish via MQTT
        const topicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX
        const topic = `${topicPrefix}/controls/${component}/${id}`
        publishMQTT(topic, { value, timestamp: message.timestamp })
    }

    function handleIncomingMessage(message: Message) {
        lastMessage.value = message
        addToHistory(message)

        // Emit event for components to listen to
        window.dispatchEvent(new CustomEvent('vvvv-message', { detail: message }))
    }

    function handleIncomingMQTTMessage(topic: string, message: any) {
        console.log('MQTT message received:', topic, message)

        // Parse topic to extract component info
        const topicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX
        const topicParts = topic.replace(`${topicPrefix}/`, '').split('/')

        if (topicParts[0] === 'feedback' && topicParts.length >= 2) {
            const componentId = topicParts[1]

            // Emit event for components to listen to
            window.dispatchEvent(new CustomEvent('vvvv-feedback', {
                detail: {
                    id: componentId,
                    value: message.value,
                    timestamp: message.timestamp || Date.now()
                }
            }))
        }
    }

    function addToHistory(message: Message) {
        messageHistory.value.unshift(message)
        if (messageHistory.value.length > maxHistorySize) {
            messageHistory.value = messageHistory.value.slice(0, maxHistorySize)
        }
    }

    function clearHistory() {
        messageHistory.value = []
    }

    return {
        // State
        wsConnected,
        mqttConnected,
        lastMessage,
        messageHistory,

        // Getters
        isFullyConnected,
        connectionStatus,

        // Actions
        initializeConnections,
        disconnectAll,
        sendWebSocketMessage,
        publishMQTT,
        sendControl,
        clearHistory
    }
})
