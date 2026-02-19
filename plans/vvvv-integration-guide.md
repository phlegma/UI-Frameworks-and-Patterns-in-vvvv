# vvvv Integration Guide

## Overview
This guide explains how to integrate the Vue webapp with vvvv gamma using WebSocket and MQTT protocols.

---

## vvvv Packages Required

### 1. WebSocket Support
- **Built-in**: vvvv gamma has native WebSocket nodes
- **Nodes**: `WebSocketServer`, `WebSocketClient`

### 2. MQTT Support
- **Package**: VL.IO.MQTT
- **Installation**: Via nuget in vvvv
- **Nodes**: `MQTTClient`, `MQTTPublish`, `MQTTSubscribe`

---

## WebSocket Integration in vvvv

### Basic WebSocket Server Setup

```
Patch Structure:
┌─────────────────────────────────────┐
│ WebSocketServer                     │
│   Port: 8080                        │
│   ├─ OnConnect                      │
│   ├─ OnMessage ──> Parse JSON       │
│   └─ OnDisconnect                   │
│                                     │
│ Parse JSON                          │
│   ├─ Type (control/update/status)  │
│   ├─ Component (slider/button/etc) │
│   ├─ ID                             │
│   └─ Value                          │
│                                     │
│ Route by Component Type             │
│   ├─ Slider ──> Update Value        │
│   ├─ Button ──> Trigger Action      │
│   ├─ Toggle ──> Set Boolean         │
│   └─ Color ──> Set RGBA             │
└─────────────────────────────────────┘
```

### Message Handling Pattern

**Incoming from Vue (JSON):**
```json
{
  "type": "control",
  "component": "slider",
  "id": "brightness",
  "value": 0.75,
  "timestamp": 1234567890
}
```

**vvvv Processing:**
1. Receive message via WebSocket
2. Parse JSON string to object
3. Extract component type and ID
4. Route to appropriate handler
5. Update vvvv values/parameters

**Outgoing to Vue (JSON):**
```json
{
  "type": "feedback",
  "component": "slider",
  "id": "brightness",
  "value": 0.75,
  "timestamp": 1234567890
}
```

---

## MQTT Integration in vvvv

### Basic MQTT Client Setup

```
Patch Structure:
┌─────────────────────────────────────┐
│ MQTTClient                          │
│   Broker: test.mosquitto.org:1883  │
│   ClientID: vvvv-client             │
│   ├─ Connect                        │
│   └─ Connected                      │
│                                     │
│ MQTTSubscribe                       │
│   Topics:                           │
│   ├─ vvvv/webapp/controls/+/+       │
│   ├─ vvvv/webapp/status/#           │
│   └─ OnMessage ──> Parse Payload    │
│                                     │
│ MQTTPublish                         │
│   ├─ Topic Builder                  │
│   ├─ Payload (JSON)                 │
│   └─ Publish on Change              │
└─────────────────────────────────────┘
```

### Topic Subscription Patterns

**Subscribe to all controls:**
```
vvvv/webapp/controls/#
```

**Subscribe to specific control type:**
```
vvvv/webapp/controls/slider/+
```

**Subscribe to specific control:**
```
vvvv/webapp/controls/slider/brightness
```

---

## Example vvvv Patches

### Example 1: Simple Slider Control

**Purpose**: Control a value in vvvv from Vue webapp slider

**vvvv Nodes:**
```
WebSocketServer (Port: 8080)
  └─> OnMessage
      └─> FromJSON
          └─> GetSlice [Value]
              └─> Damper (smooth changes)
                  └─> Your Parameter
```

**Vue Component:**
```vue
<SliderControl 
  id="brightness" 
  label="Brightness" 
  :min="0" 
  :max="1" 
  :step="0.01" 
/>
```

**Message Flow:**
1. User moves slider in Vue
2. Vue sends WebSocket message: `{"type":"control","component":"slider","id":"brightness","value":0.75}`
3. vvvv receives and parses JSON
4. vvvv updates brightness parameter
5. Visual output changes in real-time

---

### Example 2: Button Trigger

**Purpose**: Trigger an action in vvvv from Vue button

**vvvv Nodes:**
```
WebSocketServer
  └─> OnMessage
      └─> FromJSON
          └─> GetSlice [Type] = "control"
              └─> GetSlice [Component] = "button"
                  └─> GetSlice [ID] = "reset"
                      └─> Changed
                          └─> MonoFlop (Bang)
                              └─> Reset Action
```

**Vue Component:**
```vue
<ButtonControl 
  id="reset" 
  label="Reset Scene" 
  variant="danger" 
/>
```

---

### Example 3: Color Picker

**Purpose**: Control RGB color in vvvv from Vue color picker

**vvvv Nodes:**
```
WebSocketServer
  └─> OnMessage
      └─> FromJSON
          └─> GetSlice [Value] (Hex color)
              └─> HexToRGBA
                  └─> RGBA Split
                      ├─> Red
                      ├─> Green
                      ├─> Blue
                      └─> Alpha
```

**Vue Component:**
```vue
<ColorPicker 
  id="background" 
  label="Background Color" 
  show-alpha 
/>
```

**Message Format:**
```json
{
  "type": "control",
  "component": "color",
  "id": "background",
  "value": "#FF5733",
  "timestamp": 1234567890
}
```

---

### Example 4: Bidirectional Communication

**Purpose**: Sync slider value between Vue and vvvv (both directions)

**vvvv Nodes:**
```
┌─ Incoming (Vue → vvvv) ─────────────┐
│ WebSocketServer                     │
│   └─> OnMessage                     │
│       └─> FromJSON                  │
│           └─> Update IOBox Value    │
└─────────────────────────────────────┘

┌─ Outgoing (vvvv → Vue) ─────────────┐
│ IOBox (Value)                       │
│   └─> OnChange                      │
│       └─> ToJSON                    │
│           └─> WebSocketServer.Send  │
└─────────────────────────────────────┘
```

**Flow:**
1. User changes slider in Vue → vvvv updates
2. User changes IOBox in vvvv → Vue updates
3. Both stay synchronized

---

## MQTT Topic Mapping

### Control Topics (Vue → vvvv)

| UI Component | MQTT Topic | Payload Example |
|--------------|------------|-----------------|
| Button | `vvvv/webapp/controls/button/reset` | `{"value": true}` |
| Slider | `vvvv/webapp/controls/slider/brightness` | `{"value": 0.75}` |
| Toggle | `vvvv/webapp/controls/toggle/enable` | `{"value": true}` |
| Color | `vvvv/webapp/controls/color/background` | `{"value": "#FF5733"}` |
| Text | `vvvv/webapp/controls/text/message` | `{"value": "Hello"}` |
| Number | `vvvv/webapp/controls/number/count` | `{"value": 42}` |

### Feedback Topics (vvvv → Vue)

| Purpose | MQTT Topic | Payload Example |
|---------|------------|-----------------|
| Value Update | `vvvv/webapp/feedback/brightness` | `{"value": 0.75}` |
| Status | `vvvv/webapp/status/connection` | `{"status": "connected"}` |
| Error | `vvvv/webapp/status/error` | `{"error": "Invalid value"}` |
| State | `vvvv/webapp/state/scene` | `{"scene": "main"}` |

---

## vvvv Patch Template

### Complete Integration Patch Structure

```
┌─────────────────────────────────────────────────────────┐
│                    COMMUNICATION LAYER                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  WebSocket Server (Port: 8080)                         │
│    ├─ OnConnect ──> Log Connection                     │
│    ├─ OnMessage ──> Message Router                     │
│    └─ OnDisconnect ──> Log Disconnection               │
│                                                         │
│  MQTT Client (test.mosquitto.org)                      │
│    ├─ Subscribe: vvvv/webapp/controls/#                │
│    ├─ OnMessage ──> Message Router                     │
│    └─ Publish: vvvv/webapp/feedback/#                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    MESSAGE ROUTING                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Message Router                                         │
│    ├─ Parse JSON                                        │
│    ├─ Extract Type, Component, ID, Value               │
│    └─ Route to Handler                                  │
│                                                         │
│  Component Handlers                                     │
│    ├─ Slider Handler ──> Update Values                 │
│    ├─ Button Handler ──> Trigger Actions               │
│    ├─ Toggle Handler ──> Set Booleans                  │
│    ├─ Color Handler ──> Set Colors                     │
│    └─ Text Handler ──> Set Strings                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION LOGIC                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your vvvv Application                                 │
│    ├─ Scene Parameters (controlled by Vue)             │
│    ├─ Visual Output                                     │
│    └─ Feedback to Vue (state changes)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Data Type Conversions

### Vue → vvvv Type Mapping

| Vue Type | vvvv Type | Conversion |
|----------|-----------|------------|
| `number` (0-1) | `Float32` | Direct |
| `number` (0-100) | `Float32` | Divide by 100 |
| `boolean` | `Boolean` | Direct |
| `string` (hex color) | `RGBA` | HexToRGBA node |
| `string` | `String` | Direct |
| `{r,g,b,a}` | `RGBA` | Spread to components |

### vvvv → Vue Type Mapping

| vvvv Type | Vue Type | Conversion |
|-----------|----------|------------|
| `Float32` | `number` | Direct |
| `Boolean` | `boolean` | Direct |
| `RGBA` | `string` (hex) | RGBAToHex node |
| `String` | `string` | Direct |
| `Vector2D` | `{x, y}` | ToJSON |
| `Vector3D` | `{x, y, z}` | ToJSON |

---

## Testing Setup

### Step 1: Start WebSocket Server in vvvv
1. Create WebSocketServer node
2. Set port to 8080
3. Run patch
4. Check "Connected" output

### Step 2: Start Vue Webapp
```bash
cd Webapp
npm run dev
```

### Step 3: Test Connection
1. Open browser to http://localhost:3000
2. Check connection status indicator
3. Should show "WebSocket: Connected"

### Step 4: Test Control
1. Move slider in Vue
2. Watch IOBox value change in vvvv
3. Verify real-time updates

### Step 5: Test MQTT
1. Ensure MQTT client connected in vvvv
2. Subscribe to topics
3. Test publish from Vue
4. Verify messages received in vvvv

---

## Debugging Tips

### WebSocket Issues

**Problem**: Connection refused
- **Check**: vvvv WebSocket server is running
- **Check**: Port 8080 is not blocked by firewall
- **Check**: URL is `ws://localhost:8080` (not wss://)

**Problem**: Messages not received
- **Check**: JSON format is valid
- **Check**: OnMessage is connected in vvvv
- **Check**: Browser console for errors

### MQTT Issues

**Problem**: Cannot connect to broker
- **Check**: Internet connection
- **Check**: Broker URL is correct (wss://test.mosquitto.org:8081)
- **Check**: Port 8081 is for WebSocket MQTT

**Problem**: Messages not received
- **Check**: Topic subscription is correct
- **Check**: Wildcard patterns (+, #) are used correctly
- **Check**: QoS level is appropriate

### vvvv Issues

**Problem**: Values not updating
- **Check**: Message routing logic
- **Check**: JSON parsing is successful
- **Check**: Component ID matches

**Problem**: Performance issues
- **Check**: Message rate (add throttling if needed)
- **Check**: JSON parsing efficiency
- **Check**: Number of active connections

---

## Performance Optimization

### vvvv Side:
1. **Cache parsed values**: Don't parse JSON every frame
2. **Use Changed node**: Only process when value changes
3. **Throttle updates**: Limit update rate for smooth performance
4. **Batch messages**: Combine multiple updates when possible

### Vue Side:
1. **Debounce slider updates**: Use 50-100ms debounce
2. **Throttle rapid changes**: Limit message rate
3. **Queue messages**: Handle offline scenarios
4. **Compress data**: Minimize JSON payload size

---

## Security Considerations

### Development:
- Use `ws://` and `mqtt://` for local testing
- No authentication needed for localhost

### Production:
- Use `wss://` (secure WebSocket)
- Use `mqtts://` (secure MQTT)
- Implement authentication tokens
- Validate all incoming messages
- Use private MQTT broker with credentials

---

## Example Use Cases

### 1. Live VJ Control Panel
- Control visual parameters in real-time
- Trigger effects and transitions
- Adjust colors, speeds, intensities
- Save and recall presets

### 2. Interactive Installation
- Visitor controls via web interface
- Multiple simultaneous users
- Real-time feedback to users
- State synchronization

### 3. Remote Show Control
- Control vvvv show from any device
- Monitor system status
- Emergency controls
- Timeline control

### 4. Data Visualization Dashboard
- Display vvvv data in web UI
- Real-time charts and graphs
- Historical data logging
- Export data to CSV

---

## Advanced Features

### 1. Multi-Client Synchronization
- Broadcast state changes to all connected clients
- Handle conflicts (last-write-wins or merge)
- Show active users

### 2. Preset System
- Save UI state to JSON
- Load presets from vvvv
- Share presets between users
- Version control for presets

### 3. Recording & Playback
- Record all control changes
- Playback recorded sessions
- Export to timeline format
- Automation scripting

### 4. Custom Protocols
- Define custom message formats
- Binary data transfer for efficiency
- Compressed data streams
- Protocol versioning

---

## Resources

### vvvv Documentation:
- **WebSocket**: https://thegraybook.vvvv.org/reference/libraries/websocket.html
- **MQTT Package**: Search "VL.IO.MQTT" in vvvv nuget

### Testing Tools:
- **MQTT Explorer**: Visual MQTT client for debugging
- **wscat**: Command-line WebSocket client
- **Postman**: API testing with WebSocket support

### Community:
- **vvvv Forum**: https://discourse.vvvv.org/
- **vvvv Chat**: https://riot.im/app/#/room/#vvvv:matrix.org

---

## Next Steps

1. Create basic test patch in vvvv
2. Test WebSocket connection
3. Test MQTT connection
4. Implement message routing
5. Add your application logic
6. Test bidirectional communication
7. Optimize performance
8. Add error handling
9. Document your specific implementation
10. Share with community!
