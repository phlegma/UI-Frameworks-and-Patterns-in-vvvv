# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd Webapp
npm install
```

This will install all required packages including:
- Vue 3
- Pinia (state management)
- Element Plus (UI framework)
- MQTT.js (MQTT client)
- TypeScript and build tools

### Step 2: Start Development Server

```bash
npm run dev
```

The webapp will be available at: **http://localhost:3000**

### Step 3: Open in Browser

1. Navigate to http://localhost:3000
2. You'll see the home page with connection status
3. Click "Open Control Panel" to access all controls

## 📡 Connection Status

The webapp will attempt to connect to:
- **WebSocket**: `ws://localhost:8080`
- **MQTT**: `wss://test.mosquitto.org:8081`

### Expected Behavior

- **WebSocket**: Will show "Disconnected" until you start a vvvv WebSocket server
- **MQTT**: Should connect automatically to the public test broker

## 🎮 Using the Controls

All controls in the Control Panel automatically send messages when you interact with them:

- **Sliders**: Drag to change values (debounced for performance)
- **Buttons**: Click to send trigger messages
- **Toggles**: Switch on/off to send boolean states
- **Color Pickers**: Select colors to send hex values
- **Text Inputs**: Type text (debounced)
- **Number Inputs**: Enter numbers with validation

## 🔌 Testing Without vvvv

### Test MQTT Only

The MQTT connection should work immediately since it connects to a public broker:

1. Install MQTT Explorer: https://mqtt-explorer.com/
2. Connect to `test.mosquitto.org:1883`
3. Subscribe to `vvvv/webapp/#`
4. Interact with controls in the webapp
5. See messages appear in MQTT Explorer

### Test WebSocket with Echo Server

```bash
# Install wscat globally
npm install -g wscat

# Start echo server on port 8080
wscat -l 8080
```

Now the webapp will connect and you'll see messages in the terminal.

## 🎯 Next Steps

### For vvvv Integration

1. Open vvvv gamma
2. Create a WebSocket server node (port 8080)
3. Create an MQTT client node (test.mosquitto.org:1883)
4. Subscribe to `vvvv/webapp/controls/#`
5. Parse incoming JSON messages
6. Connect to your application logic

See [`plans/vvvv-integration-guide.md`](../plans/vvvv-integration-guide.md) for detailed vvvv setup instructions.

### Customize Configuration

Edit [`.env`](.env) to change connection settings:

```env
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_MQTT_BROKER=wss://test.mosquitto.org:8081
VITE_MQTT_CLIENT_ID=vue-webapp-client
VITE_MQTT_TOPIC_PREFIX=vvvv/webapp
```

### Add Custom Controls

1. Create new component in `src/components/ui/`
2. Import in `src/views/ControlPanel.vue`
3. Add to the layout
4. Component automatically integrates with communication store

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- --port 3001
```

### Dependencies Installation Failed

```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### TypeScript Errors in IDE

These are expected until you run `npm install`. The errors will disappear once all dependencies are installed.

### WebSocket Won't Connect

- Make sure nothing else is using port 8080
- Check firewall settings
- Verify the URL in `.env` is correct

### MQTT Won't Connect

- Check your internet connection
- Try alternative broker: `wss://broker.hivemq.com:8884/mqtt`
- Update `.env` with new broker URL

## 📚 Documentation

- **Full README**: [`README.md`](README.md)
- **Architecture**: [`../plans/webapp-architecture.md`](../plans/webapp-architecture.md)
- **Implementation Guide**: [`../plans/implementation-guide.md`](../plans/implementation-guide.md)
- **vvvv Integration**: [`../plans/vvvv-integration-guide.md`](../plans/vvvv-integration-guide.md)

## 🎉 You're Ready!

The webapp is now running and ready to communicate with vvvv. Start building your interactive applications!
