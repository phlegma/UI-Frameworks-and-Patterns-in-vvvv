/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEBSOCKET_URL: string
    readonly VITE_MQTT_BROKER: string
    readonly VITE_MQTT_CLIENT_ID: string
    readonly VITE_MQTT_TOPIC_PREFIX: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
