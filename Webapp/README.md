# vvvv Control Panel - Vue Webapp

A modern Vue 3 web application for controlling vvvv applications via WebSocket and MQTT protocols.

## 🚀 Features

- **Real-time Communication**: Bidirectional WebSocket and MQTT messaging
- **Professional UI**: Built with Element Plus and Vuetify component libraries
- **Type Safety**: Full TypeScript support
- **Automatic Reconnection**: Exponential backoff for both protocols
- **Message Queue**: Offline message handling
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple UI Frameworks**: Demonstrates both Element Plus and Vuetify components

## 📋 Prerequisites

- Node.js 18+ and npm
- vvvv gamma (for testing integration)
- Modern web browser

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# WebSocket Configuration
VITE_WEBSOCKET_URL=ws://localhost:8080

# MQTT Configuration
VITE_MQTT_BROKER=wss://test.mosquitto.org:8081
VITE_MQTT_CLIENT_ID=vue-webapp-client
VITE_MQTT_TOPIC_PREFIX=vvvv/webapp
```

### Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_WEBSOCKET_URL` | WebSocket server URL | `ws://localhost:8080` |
| `VITE_MQTT_BROKER` | MQTT broker URL (WebSocket) | `wss://test.mosquitto.org:8081` |
| `VITE_MQTT_CLIENT_ID` | MQTT client identifier | `vue-webapp-client` |
| `VITE_MQTT_TOPIC_PREFIX` | MQTT topic prefix | `vvvv/webapp` |

## 🎮 UI Controls

### Available Components

1. **SliderControl**: Numeric value control with range
2. **ButtonControl**: Trigger actions
3. **ToggleControl**: Boolean on/off states
4. **ColorPicker**: RGB/HSV color selection
5. **TextInput**: String input with validation
6. **NumberInput**: Numeric input with range validation

### Available Pages

#### 1. Control Panel (Element Plus)
Route: `/control-panel`

The control panel is organized into three sections:
- **Sliders**: Brightness, Speed, Intensity
- **Buttons & Toggles**: Reset, Trigger, Save, Enable, Debug
- **Colors & Inputs**: Background/Foreground colors, Message text, Particle count, Rotation

#### 2. Vuetify Showcase
Route: `/vuetify-showcase`

A comprehensive demonstration of Vuetify components including:
- **8 switchable themes** (Light, Dark, Purple Dream, Ocean Blue, Sunset Orange, Forest Green, Midnight Purple, Cyberpunk)
- Text inputs (TextField, Textarea, Password, Email)
- Selection controls (Select, Autocomplete, Combobox, Checkboxes)
- Radio buttons and switches
- Sliders and rating components
- Various button styles
- Date, time, and color pickers
- Chips, progress indicators, lists
- Tabs, expansion panels, stepper
- Alerts, dialogs, snackbars
- Badges, avatars, tooltips, menus
- Data table with sorting and pagination

**Theme Switching**: Click the palette icon in the app bar to switch between themes. Each theme change is automatically sent to vvvv via WebSocket and MQTT.

See [`VUETIFY-SHOWCASE.md`](./VUETIFY-SHOWCASE.md) for detailed documentation.

## 📡 Communication Protocols

### WebSocket Messages

All messages follow this JSON format:

```json
{
  "type": "control|update|feedback|status",
  "component": "slider|button|toggle|color|text|number",
  "id": "unique-component-id",
  "value": "any",
  "timestamp": 1234567890
}
```

**Example:**
```json
{
  "type": "control",
  "component": "slider",
  "id": "brightness",
  "value": 75,
  "timestamp": 1708358400000
}
```

**Vuetify Components:**
```json
{
  "type": "control",
  "component": "vuetify",
  "id": "vuetify/slider",
  "value": 50,
  "timestamp": 1708358400000
}
```

### MQTT Topics

#### Control Topics (UI → vvvv)
```
vvvv/webapp/controls/slider/{id}
vvvv/webapp/controls/button/{id}
vvvv/webapp/controls/toggle/{id}
vvvv/webapp/controls/color/{id}
vvvv/webapp/controls/text/{id}
vvvv/webapp/controls/number/{id}
vvvv/webapp/controls/vuetify/{id}
```

#### Feedback Topics (vvvv → UI)
```
vvvv/webapp/feedback/{component_id}
vvvv/webapp/status/connection
vvvv/webapp/status/error
```

## 🔌 vvvv Integration

### WebSocket Server Setup

In vvvv, create a WebSocket server:

1. Add `WebSocketServer` node
2. Set port to `8080`
3. Connect `OnMessage` to parse JSON
4. Route messages to your application logic

### MQTT Client Setup

1. Install `VL.IO.MQTT` package via nuget
2. Add `MQTTClient` node
3. Connect to broker: `test.mosquitto.org:1883`
4. Subscribe to: `vvvv/webapp/controls/#`
5. Publish feedback to: `vvvv/webapp/feedback/#`

### Example vvvv Patch

```
WebSocketServer (Port: 8080)
  └─> OnMessage
      └─> FromJSON
          └─> GetSlice [Value]
              └─> Your Parameter

MQTTClient (Broker: test.mosquitto.org)
  └─> Subscribe: vvvv/webapp/controls/#
      └─> OnMessage
          └─> Parse Payload
              └─> Your Parameter
```

## 🏗️ Project Structure

```
Webapp/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ButtonControl.vue
│   │   │   ├── SliderControl.vue
│   │   │   ├── ToggleControl.vue
│   │   │   ├── ColorPicker.vue
│   │   │   ├── TextInput.vue
│   │   │   └── NumberInput.vue
│   │   └── ConnectionStatus.vue
│   ├── services/
│   │   ├── websocket.service.ts
│   │   └── mqtt.service.ts
│   ├── stores/
│   │   └── communication.store.ts
│   ├── types/
│   │   └── index.ts
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── ControlPanel.vue
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Testing

### Test WebSocket Connection

1. Start a WebSocket echo server:
   ```bash
   npm install -g wscat
   wscat -l 8080
   ```

2. Open the webapp and check connection status
3. Interact with controls and observe messages

### Test MQTT Connection

1. Install MQTT Explorer: https://mqtt-explorer.com/
2. Connect to `test.mosquitto.org:1883`
3. Subscribe to `vvvv/webapp/#`
4. Interact with controls and observe messages

### Test with vvvv

1. Create a vvvv patch with WebSocket server and MQTT client
2. Start the patch
3. Open the webapp
4. Verify bidirectional communication

## 🔧 Development

### Adding New Controls

1. Create component in `src/components/ui/`
2. Import in `ControlPanel.vue`
3. Add to layout
4. Component automatically integrates with communication store

### Customizing Communication

Edit `src/stores/communication.store.ts` to:
- Add custom message handlers
- Modify topic structure
- Implement custom protocols

## 📚 Technology Stack

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Next-generation frontend tooling
- **TypeScript**: Type-safe JavaScript
- **Pinia**: Vue state management
- **Element Plus**: Vue 3 component library
- **MQTT.js**: MQTT client for browsers
- **VueUse**: Composition utilities

## 🐛 Troubleshooting

### WebSocket Connection Failed

- Check if vvvv WebSocket server is running
- Verify port 8080 is not blocked by firewall
- Ensure URL is `ws://localhost:8080` (not `wss://`)

### MQTT Connection Failed

- Check internet connection
- Verify broker URL: `wss://test.mosquitto.org:8081`
- Try alternative broker if test.mosquitto.org is down

### Controls Not Responding

- Check connection status indicator
- Open browser console for error messages
- Verify vvvv patch is receiving messages

## 📖 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Element Plus Documentation](https://element-plus.org/)
- [MQTT.js Documentation](https://github.com/mqttjs/MQTT.js)
- [vvvv Documentation](https://thegraybook.vvvv.org/)

## 📄 License

This project is part of the UI Frameworks & Patterns in vvvv repository.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For questions or issues, please refer to the main repository documentation or create an issue.
