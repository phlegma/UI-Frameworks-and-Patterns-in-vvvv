import type { Message } from '@/types'
import { ElNotification } from 'element-plus'

export class WebSocketService {
    private ws: WebSocket | null = null
    private url: string
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private messageHandlers: Array<(message: Message) => void> = []
    private connectionHandlers: Array<(connected: boolean) => void> = []
    private messageQueue: Message[] = []

    constructor(url: string) {
        this.url = url
    }

    connect(): void {
        try {
            this.ws = new WebSocket(this.url)

            this.ws.onopen = () => {
                console.log('WebSocket connected')
                this.reconnectAttempts = 0
                this.notifyConnectionHandlers(true)
                this.flushMessageQueue()

                ElNotification({
                    title: 'WebSocket Connected',
                    message: 'Successfully connected to vvvv',
                    type: 'success',
                    duration: 2000
                })
            }

            this.ws.onmessage = (event) => {
                try {
                    const data: Message = JSON.parse(event.data)
                    this.notifyMessageHandlers(data)
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error)
                }
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error)
                ElNotification({
                    title: 'WebSocket Error',
                    message: 'Connection error occurred',
                    type: 'error',
                    duration: 3000
                })
            }

            this.ws.onclose = () => {
                console.log('WebSocket disconnected')
                this.notifyConnectionHandlers(false)
                this.handleReconnect()
            }
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error)
            this.handleReconnect()
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }

    send(message: Message): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message))
        } else {
            // Queue message if not connected
            this.messageQueue.push(message)
            console.warn('WebSocket not connected, message queued')
        }
    }

    onMessage(handler: (message: Message) => void): void {
        this.messageHandlers.push(handler)
    }

    onConnectionChange(handler: (connected: boolean) => void): void {
        this.connectionHandlers.push(handler)
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
            this.reconnectAttempts++

            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

            setTimeout(() => {
                this.connect()
            }, delay)
        } else {
            console.error('Max reconnection attempts reached')
            ElNotification({
                title: 'Connection Failed',
                message: 'Could not connect to WebSocket server',
                type: 'error',
                duration: 0
            })
        }
    }

    private notifyMessageHandlers(message: Message): void {
        this.messageHandlers.forEach(handler => handler(message))
    }

    private notifyConnectionHandlers(connected: boolean): void {
        this.connectionHandlers.forEach(handler => handler(connected))
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()
            if (message) {
                this.send(message)
            }
        }
    }
}
