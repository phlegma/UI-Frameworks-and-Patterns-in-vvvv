# Vue Webapp Implementation Guide

## Quick Start Commands

### 1. Initialize Project
```bash
cd Webapp
npm create vue@latest . -- --typescript --router --pinia
```

When prompted, select:
- ✅ TypeScript
- ✅ JSX Support (optional)
- ✅ Vue Router
- ✅ Pinia
- ❌ Vitest (or ✅ if you want testing)
- ❌ End-to-End Testing (or ✅ if needed)
- ✅ ESLint
- ✅ Prettier

### 2. Install Dependencies
```bash
npm install
npm install element-plus
npm install mqtt
npm install @vueuse/core
```

### 3. Install Dev Dependencies
```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

---

## Key Configuration Files

### [`vite.config.ts`](Webapp/vite.config.ts)
```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
})
```

### [`.env`](Webapp/.env)
```env
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_MQTT_BROKER=wss://test.mosquitto.org:8081
VITE_MQTT_CLIENT_ID=vue-webapp-client
VITE_MQTT_TOPIC_PREFIX=vvvv/webapp
```

---

## Core Implementation Patterns

### 1. WebSocket Service Pattern

```typescript
// services/websocket.service.ts
export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect(url: string) {
    this.ws = new WebSocket(url)
    
    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Handle incoming messages
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    this.ws.onclose = () => {
      this.handleReconnect()
    }
  }
  
  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect(url)
      }, Math.pow(2, this.reconnectAttempts) * 1000)
    }
  }
}
```

### 2. MQTT Service Pattern

```typescript
// services/mqtt.service.ts
import mqtt from 'mqtt'

export class MQTTService {
  private client: mqtt.MqttClient | null = null
  
  connect(brokerUrl: string, options: mqtt.IClientOptions) {
    this.client = mqtt.connect(brokerUrl, options)
    
    this.client.on('connect', () => {
      console.log('MQTT connected')
    })
    
    this.client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString())
      // Handle incoming messages
    })
    
    this.client.on('error', (error) => {
      console.error('MQTT error:', error)
    })
  }
  
  subscribe(topic: string) {
    this.client?.subscribe(topic)
  }
  
  publish(topic: string, message: any) {
    this.client?.publish(topic, JSON.stringify(message))
  }
}
```

### 3. Pinia Store Pattern

```typescript
// stores/communication.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WebSocketService } from '@/services/websocket.service'
import { MQTTService } from '@/services/mqtt.service'

export const useCommunicationStore = defineStore('communication', () => {
  // State
  const wsConnected = ref(false)
  const mqttConnected = ref(false)
  const wsService = new WebSocketService()
  const mqttService = new MQTTService()
  
  // Getters
  const isFullyConnected = computed(() => 
    wsConnected.value && mqttConnected.value
  )
  
  // Actions
  function initializeConnections() {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL
    const mqttBroker = import.meta.env.VITE_MQTT_BROKER
    
    wsService.connect(wsUrl)
    mqttService.connect(mqttBroker, {
      clientId: import.meta.env.VITE_MQTT_CLIENT_ID
    })
  }
  
  function sendWebSocketMessage(data: any) {
    wsService.send(data)
  }
  
  function publishMQTT(topic: string, message: any) {
    mqttService.publish(topic, message)
  }
  
  return {
    wsConnected,
    mqttConnected,
    isFullyConnected,
    initializeConnections,
    sendWebSocketMessage,
    publishMQTT
  }
})
```

### 4. Component Pattern with Store Integration

```vue
<!-- components/ui/SliderControl.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunicationStore } from '@/stores/communication.store'

interface Props {
  id: string
  label: string
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1
})

const value = ref(50)
const commStore = useCommunicationStore()

// Send value changes to vvvv
watch(value, (newValue) => {
  commStore.sendWebSocketMessage({
    type: 'control',
    component: 'slider',
    id: props.id,
    value: newValue,
    timestamp: Date.now()
  })
  
  // Also publish via MQTT
  const topic = `${import.meta.env.VITE_MQTT_TOPIC_PREFIX}/controls/slider/${props.id}`
  commStore.publishMQTT(topic, { value: newValue })
})
</script>

<template>
  <div class="slider-control">
    <label>{{ label }}</label>
    <el-slider 
      v-model="value" 
      :min="min" 
      :max="max" 
      :step="step"
      show-input
    />
  </div>
</template>
```

---

## Message Protocol Specification

### WebSocket Message Format

#### Outgoing (UI → vvvv):
```json
{
  "type": "control",
  "component": "slider|button|toggle|color|text|number",
  "id": "unique-component-id",
  "value": "any",
  "timestamp": 1234567890
}
```

#### Incoming (vvvv → UI):
```json
{
  "type": "update|feedback|status",
  "component": "slider|button|toggle|color|text|number",
  "id": "unique-component-id",
  "value": "any",
  "timestamp": 1234567890
}
```

### MQTT Topic Structure

```
vvvv/webapp/controls/button/{id}      - Button press events
vvvv/webapp/controls/slider/{id}      - Slider value changes
vvvv/webapp/controls/toggle/{id}      - Toggle state changes
vvvv/webapp/controls/color/{id}       - Color picker changes
vvvv/webapp/controls/text/{id}        - Text input changes
vvvv/webapp/controls/number/{id}      - Number input changes
vvvv/webapp/status/connection         - Connection status
vvvv/webapp/feedback/{component_id}   - Feedback from vvvv
```

---

## UI Components Specification

### 1. ButtonControl
- **Purpose**: Send trigger/command to vvvv
- **Props**: `id`, `label`, `variant` (primary/success/warning/danger)
- **Events**: Click sends WebSocket message and MQTT publish
- **Element Plus Component**: `<el-button>`

### 2. SliderControl
- **Purpose**: Control numeric values with real-time updates
- **Props**: `id`, `label`, `min`, `max`, `step`
- **Features**: Debounced updates, show input field
- **Element Plus Component**: `<el-slider>`

### 3. ToggleControl
- **Purpose**: Boolean on/off states
- **Props**: `id`, `label`, `activeText`, `inactiveText`
- **Element Plus Component**: `<el-switch>`

### 4. ColorPicker
- **Purpose**: RGB/HSV color selection
- **Props**: `id`, `label`, `showAlpha`
- **Output**: Hex, RGB, or HSV format
- **Element Plus Component**: `<el-color-picker>`

### 5. TextInput
- **Purpose**: String data input
- **Props**: `id`, `label`, `placeholder`, `maxLength`
- **Features**: Validation, debounced updates
- **Element Plus Component**: `<el-input>`

### 6. NumberInput
- **Purpose**: Numeric input with validation
- **Props**: `id`, `label`, `min`, `max`, `step`, `precision`
- **Element Plus Component**: `<el-input-number>`

### 7. ConnectionStatus
- **Purpose**: Display connection state
- **Shows**: WebSocket status, MQTT status, reconnection attempts
- **Element Plus Components**: `<el-badge>`, `<el-tag>`

---

## Development Workflow

### Step 1: Setup
```bash
cd Webapp
npm create vue@latest .
npm install
npm install element-plus mqtt @vueuse/core
npm run dev
```

### Step 2: Create Services
1. Create [`websocket.service.ts`](Webapp/src/services/websocket.service.ts)
2. Create [`mqtt.service.ts`](Webapp/src/services/mqtt.service.ts)
3. Add connection management and error handling

### Step 3: Create Stores
1. Create [`communication.store.ts`](Webapp/src/stores/communication.store.ts)
2. Create [`ui.store.ts`](Webapp/src/stores/ui.store.ts)
3. Integrate services into stores

### Step 4: Build Components
1. Create base UI control components
2. Add Element Plus styling
3. Connect to Pinia stores
4. Test individual components

### Step 5: Create Views
1. Build [`ControlPanel.vue`](Webapp/src/views/ControlPanel.vue)
2. Add all UI controls
3. Add connection status display
4. Style with Element Plus layout components

### Step 6: Testing
1. Test with WebSocket echo server
2. Test with MQTT test broker
3. Create vvvv test patch
4. Verify bidirectional communication

---

## Testing Tools & Resources

### WebSocket Testing:
- **wscat**: `npm install -g wscat` then `wscat -l 8080`
- **Browser DevTools**: Network tab → WS filter
- **Online tool**: https://www.websocket.org/echo.html

### MQTT Testing:
- **MQTT Explorer**: https://mqtt-explorer.com/
- **mosquitto_pub/sub**: Command-line tools
- **Test broker**: wss://test.mosquitto.org:8081

### vvvv Testing:
- Use WebSocket nodes in vvvv gamma
- Install VL.IO.MQTT package for MQTT support
- Create simple patch to echo messages

---

## Common Issues & Solutions

### Issue 1: MQTT over WebSocket not connecting
**Solution**: Ensure using WSS protocol and correct port (usually 8081 for WebSocket)

### Issue 2: CORS errors with WebSocket
**Solution**: Configure WebSocket server to allow origin or use same domain

### Issue 3: Messages not updating UI
**Solution**: Ensure reactive state in Pinia store and proper watch/computed usage

### Issue 4: Reconnection not working
**Solution**: Implement exponential backoff and check connection state before sending

### Issue 5: Element Plus components not auto-importing
**Solution**: Verify unplugin-vue-components and unplugin-auto-import are configured in [`vite.config.ts`](Webapp/vite.config.ts)

---

## Performance Optimization

1. **Debounce rapid updates**: Use VueUse `useDebounceFn` for sliders
2. **Throttle messages**: Limit message rate to prevent flooding
3. **Message batching**: Combine multiple updates into single message
4. **Lazy load components**: Use Vue's `defineAsyncComponent`
5. **Virtual scrolling**: For large lists of controls

---

## Security Best Practices

1. **Validate all incoming messages**: Check message structure and types
2. **Sanitize user input**: Prevent XSS attacks
3. **Use secure protocols**: WSS and MQTTS in production
4. **Implement authentication**: Add token-based auth if needed
5. **Rate limiting**: Prevent message spam

---

## Next Steps After Implementation

1. Add data visualization (charts for real-time data)
2. Implement preset system (save/load UI states)
3. Add keyboard shortcuts for controls
4. Create mobile-responsive layout
5. Add theme customization
6. Implement message recording/playback
7. Add multi-user synchronization
8. Create visual patch builder for vvvv integration

---

## Useful Links

- **Vue 3 Docs**: https://vuejs.org/
- **Pinia Docs**: https://pinia.vuejs.org/
- **Element Plus**: https://element-plus.org/
- **MQTT.js**: https://github.com/mqttjs/MQTT.js
- **VueUse**: https://vueuse.org/
- **vvvv gamma**: https://visualprogramming.net/
