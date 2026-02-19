// Message types for WebSocket and MQTT communication

export type MessageType = 'control' | 'update' | 'feedback' | 'status'
export type ComponentType = 'slider' | 'button' | 'toggle' | 'color' | 'text' | 'number' | 'vuetify'

export interface Message {
    type: MessageType
    component: ComponentType
    id: string
    value: any
    timestamp: number
}

export interface WebSocketMessage extends Message { }

export interface MQTTMessage {
    topic: string
    payload: any
}

export interface ConnectionStatus {
    websocket: boolean
    mqtt: boolean
}

export interface ControlValue {
    id: string
    value: any
    lastUpdated: number
}

// Component-specific value types
export interface SliderValue {
    value: number
    min: number
    max: number
    step: number
}

export interface ColorValue {
    hex: string
    rgb?: { r: number; g: number; b: number }
    alpha?: number
}

export interface ToggleValue {
    value: boolean
}

export interface TextValue {
    value: string
}

export interface NumberValue {
    value: number
    min?: number
    max?: number
    precision?: number
}
