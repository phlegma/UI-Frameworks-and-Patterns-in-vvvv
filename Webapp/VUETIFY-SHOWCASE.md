# Vuetify Showcase

Diese Seite demonstriert eine umfangreiche Sammlung von Vuetify-Komponenten, die alle über WebSocket und MQTT mit vvvv kommunizieren können.

## Zugriff

Die Vuetify Showcase Seite ist unter `/vuetify-showcase` erreichbar.

## Theme-Wechsel

Die Seite bietet 8 verschiedene Themes, die über das Palette-Icon in der App-Bar umgeschaltet werden können:

### Helle Themes
- **Light**: Standard helles Material Design Theme
- **Purple Dream**: Lila Farbschema mit sanften Tönen
- **Ocean Blue**: Ozean-inspirierte Blau- und Türkistöne
- **Sunset Orange**: Warme Orange- und Gelbtöne
- **Forest Green**: Natürliche Grüntöne

### Dunkle Themes
- **Dark**: Standard dunkles Material Design Theme
- **Midnight Purple**: Dunkles Theme mit lila Akzenten
- **Cyberpunk**: Neon-Farben im Cyberpunk-Stil (Cyan, Magenta, Gelb)

Jeder Theme-Wechsel wird automatisch über WebSocket und MQTT an vvvv gesendet.

## Enthaltene Komponenten

### Text Inputs
- **Text Field**: Einfaches Texteingabefeld
- **Textarea**: Mehrzeiliges Texteingabefeld
- **Password**: Passwort-Eingabefeld
- **Email**: E-Mail-Eingabefeld

### Selection Controls
- **Select**: Dropdown-Auswahl
- **Autocomplete**: Autocomplete-Eingabe mit Vorschlägen
- **Combobox**: Kombinierte Eingabe und Auswahl
- **Checkbox**: Einzelne Checkbox
- **Checkbox Group**: Mehrere Checkboxen als Gruppe

### Radio & Switch
- **Radio Group**: Radio-Button-Gruppe
- **Switch**: Toggle-Schalter mit verschiedenen Farben

### Sliders & Rating
- **Slider**: Einfacher Schieberegler (0-100)
- **Range Slider**: Bereichs-Schieberegler
- **Rating**: Sternebewertung mit halben Schritten

### Buttons
- **Primary, Secondary, Success, Error, Warning, Info**: Verschiedene Button-Typen
- **Outlined**: Button mit Rahmen
- **Text**: Text-Button ohne Hintergrund
- **Tonal**: Button mit getöntem Hintergrund
- **Icon Button**: Runder Icon-Button
- **Button with Icon**: Button mit vorangestelltem Icon

### Date & Time & Color
- **Date Picker**: Datumsauswahl
- **Time Picker**: Zeitauswahl
- **Color Picker**: Farbauswahl
- **File Input**: Datei-Upload (mehrere Dateien möglich)

### Chips
- **Chip Group**: Auswählbare Chips
- **Styled Chips**: Chips mit Icons und verschiedenen Farben

### Progress & Loading
- **Progress Linear**: Linearer Fortschrittsbalken (mit Wert)
- **Progress Linear Indeterminate**: Unbestimmter Fortschritt
- **Progress Circular**: Kreisförmiger Fortschritt
- **Progress Circular Indeterminate**: Unbestimmter kreisförmiger Fortschritt

### Lists
- **Selectable List**: Liste mit mehrfach auswählbaren Einträgen
- Einträge mit Icons

### Tabs
- **Tab Navigation**: Tabs mit verschiedenen Inhalten
- Farbige Tab-Leiste

### Expansion Panels
- **Accordion**: Ausklappbare Panels
- Mehrere Panels möglich

### Stepper
- **Multi-Step Form**: Schrittweise Navigation
- Vor- und Zurück-Navigation
- Fortschrittsanzeige

### Alerts & Banners
- **Success, Info, Warning, Error**: Verschiedene Alert-Typen
- **Closable Alert**: Schließbare Benachrichtigung

### Dialog & Snackbar
- **Dialog**: Modales Dialogfenster
- **Snackbar**: Kurze Benachrichtigung am unteren Bildschirmrand

### Badges & Avatars
- **Badge**: Benachrichtigungs-Badge
- **Avatar**: Benutzer-Avatar mit Icon oder Text
- **Badge with Avatar**: Kombination aus beiden

### Tooltips & Menus
- **Tooltip**: Hover-Tooltip
- **Menu**: Dropdown-Menü

### Data Table
- **Tabelle**: Datentabelle mit Sortierung und Paginierung
- Farbige Status-Chips in Zellen

## Datenübertragung

Alle Komponenten senden ihre Werte automatisch über:

1. **WebSocket**: Direkte Nachricht an vvvv
2. **MQTT**: Publish auf Topic `vvvv/controls/vuetify/{component-id}`

### Nachrichtenformat

```typescript
{
    type: 'control',
    component: 'vuetify',
    id: 'vuetify/{component-type}',
    value: any,
    timestamp: number
}
```

### Beispiel-Topics

- `vvvv/controls/vuetify/vuetify/textfield`
- `vvvv/controls/vuetify/vuetify/slider`
- `vvvv/controls/vuetify/vuetify/button/primary`
- `vvvv/controls/vuetify/vuetify/color`
- `vvvv/controls/vuetify/vuetify/theme` (Theme-Wechsel)

## Integration in vvvv

In vvvv können Sie die Nachrichten empfangen über:

1. **WebSocket Receiver**: Empfängt JSON-Nachrichten
2. **MQTT Subscriber**: Abonniert die Topics

### Beispiel vvvv Patch

```
WebSocket (Network.Servers)
├─ Port: 8080
└─ OnData
   └─ FromJSON
      └─ GetSlice [id]
         └─ Switch (String)
            ├─ "vuetify/slider" → Slider Value
            ├─ "vuetify/button/primary" → Bang
            ├─ "vuetify/color" → Color Value
            └─ "vuetify/theme" → Theme Name (String)
```

### Theme-Wechsel in vvvv verarbeiten

Wenn ein Theme gewechselt wird, erhalten Sie:
```json
{
  "type": "control",
  "component": "vuetify",
  "id": "vuetify/theme",
  "value": "cyberpunk",
  "timestamp": 1708358400000
}
```

Sie können dies nutzen, um z.B. Farben, Materialien oder Effekte in vvvv anzupassen.

## Styling

Die Seite verwendet das Vuetify Material Design Theme. Jedes Theme hat eigene Farbdefinitionen:

### Light Theme (Standard)
- **Primary**: #1976D2 (Blau)
- **Secondary**: #424242 (Grau)
- **Success**: #4CAF50 (Grün)
- **Error**: #FF5252 (Rot)
- **Warning**: #FB8C00 (Orange)
- **Info**: #2196F3 (Hellblau)

### Cyberpunk Theme (Beispiel)
- **Primary**: #00FFF0 (Cyan)
- **Secondary**: #FF00FF (Magenta)
- **Accent**: #FFFF00 (Gelb)
- **Background**: #0A0E27 (Dunkelblau)

Alle Themes sind vollständig in [`vuetify.ts`](./src/plugins/vuetify.ts) definiert.

## Responsive Design

Alle Komponenten sind responsive und passen sich automatisch an verschiedene Bildschirmgrößen an:

- **xs**: < 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1264px (Desktop)
- **lg**: 1264px - 1904px (Large Desktop)
- **xl**: > 1904px (Extra Large)
