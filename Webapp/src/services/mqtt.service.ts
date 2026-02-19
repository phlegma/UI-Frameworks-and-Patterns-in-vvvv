import mqtt, { type MqttClient, type IClientOptions } from 'mqtt'
import { ElNotification } from 'element-plus'

export class MQTTService {
    private client: MqttClient | null = null
    private brokerUrl: string
    private options: IClientOptions
    private messageHandlers: Array<(topic: string, message: any) => void> = []
    private connectionHandlers: Array<(connected: boolean) => void> = []
    private subscriptions: Set<string> = new Set()

    constructor(brokerUrl: string, options: IClientOptions) {
        this.brokerUrl = brokerUrl
        this.options = {
            ...options,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        }
    }

    connect(): void {
        try {
            this.client = mqtt.connect(this.brokerUrl, this.options)

            this.client.on('connect', () => {
                console.log('MQTT connected')
                this.notifyConnectionHandlers(true)

                // Resubscribe to topics after reconnection
                this.subscriptions.forEach(topic => {
                    this.client?.subscribe(topic)
                })

                ElNotification({
                    title: 'MQTT Connected',
                    message: 'Successfully connected to MQTT broker',
                    type: 'success',
                    duration: 2000
                })
            })

            this.client.on('message', (topic, message) => {
                try {
                    const data = JSON.parse(message.toString())
                    this.notifyMessageHandlers(topic, data)
                } catch (error) {
                    console.error('Failed to parse MQTT message:', error)
                }
            })

            this.client.on('error', (error) => {
                console.error('MQTT error:', error)
                ElNotification({
                    title: 'MQTT Error',
                    message: 'Connection error occurred',
                    type: 'error',
                    duration: 3000
                })
            })

            this.client.on('offline', () => {
                console.log('MQTT offline')
                this.notifyConnectionHandlers(false)
            })

            this.client.on('reconnect', () => {
                console.log('MQTT reconnecting...')
            })

            this.client.on('close', () => {
                console.log('MQTT connection closed')
                this.notifyConnectionHandlers(false)
            })
        } catch (error) {
            console.error('Failed to create MQTT connection:', error)
            ElNotification({
                title: 'MQTT Connection Failed',
                message: 'Could not connect to MQTT broker',
                type: 'error',
                duration: 0
            })
        }
    }

    disconnect(): void {
        if (this.client) {
            this.client.end()
            this.client = null
        }
    }

    subscribe(topic: string): void {
        if (this.client?.connected) {
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to ${topic}:`, err)
                } else {
                    console.log(`Subscribed to ${topic}`)
                    this.subscriptions.add(topic)
                }
            })
        } else {
            // Store subscription for later
            this.subscriptions.add(topic)
        }
    }

    unsubscribe(topic: string): void {
        if (this.client?.connected) {
            this.client.unsubscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to unsubscribe from ${topic}:`, err)
                } else {
                    console.log(`Unsubscribed from ${topic}`)
                    this.subscriptions.delete(topic)
                }
            })
        } else {
            this.subscriptions.delete(topic)
        }
    }

    publish(topic: string, message: any, qos: 0 | 1 | 2 = 0): void {
        if (this.client?.connected) {
            const payload = JSON.stringify(message)
            this.client.publish(topic, payload, { qos }, (err) => {
                if (err) {
                    console.error(`Failed to publish to ${topic}:`, err)
                }
            })
        } else {
            console.warn('MQTT not connected, message not sent')
        }
    }

    onMessage(handler: (topic: string, message: any) => void): void {
        this.messageHandlers.push(handler)
    }

    onConnectionChange(handler: (connected: boolean) => void): void {
        this.connectionHandlers.push(handler)
    }

    isConnected(): boolean {
        return this.client?.connected ?? false
    }

    private notifyMessageHandlers(topic: string, message: any): void {
        this.messageHandlers.forEach(handler => handler(topic, message))
    }

    private notifyConnectionHandlers(connected: boolean): void {
        this.connectionHandlers.forEach(handler => handler(connected))
    }
}
