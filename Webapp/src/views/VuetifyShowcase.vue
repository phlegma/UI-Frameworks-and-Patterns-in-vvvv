<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from 'vuetify'
import { useCommunicationStore } from '@/stores/communication.store'

const communicationStore = useCommunicationStore()
const theme = useTheme()

// Theme State
const currentTheme = ref('light')
const themeMenuOpen = ref(false)
const themes = [
    { name: 'light', title: 'Light', icon: 'mdi-white-balance-sunny', description: 'Standard helles Theme' },
    { name: 'dark', title: 'Dark', icon: 'mdi-moon-waning-crescent', description: 'Dunkles Theme' },
    { name: 'purple', title: 'Purple Dream', icon: 'mdi-palette', description: 'Lila Farbschema' },
    { name: 'ocean', title: 'Ocean Blue', icon: 'mdi-waves', description: 'Ozean-inspiriert' },
    { name: 'sunset', title: 'Sunset Orange', icon: 'mdi-weather-sunset', description: 'Warme Sonnenuntergangsfarben' },
    { name: 'forest', title: 'Forest Green', icon: 'mdi-tree', description: 'Natürliche Grüntöne' },
    { name: 'midnight', title: 'Midnight Purple', icon: 'mdi-weather-night', description: 'Dunkles Lila Theme' },
    { name: 'cyberpunk', title: 'Cyberpunk', icon: 'mdi-robot', description: 'Neon Cyberpunk Style' }
]

// State für verschiedene Komponenten
const textField = ref('')
const textarea = ref('')
const select = ref('')
const autocomplete = ref('')
const combobox = ref('')
const checkbox = ref(false)
const checkboxGroup = ref<string[]>([])
const radio = ref('option1')
const switchValue = ref(false)
const slider = ref(50)
const rangeSlider = ref([20, 80])
const rating = ref(3)
const date = ref('')
const time = ref('')
const colorPicker = ref('#1976D2')
const fileInput = ref<File[]>([])
const chipSelection = ref<string[]>(['chip1'])
const expansionPanel = ref(0)
const stepper = ref(1)
const tabValue = ref('tab1')
const dialogVisible = ref(false)
const snackbar = ref(false)
const progressValue = ref(45)
const listSelection = ref(['item1'])

// Optionen für Select/Autocomplete
const selectItems = ['Option 1', 'Option 2', 'Option 3', 'Option 4']
const chipItems = ['chip1', 'chip2', 'chip3', 'chip4']

// Theme Wechsel
const changeTheme = (themeName: string) => {
    theme.global.name.value = themeName
    currentTheme.value = themeName
    themeMenuOpen.value = false
    sendData('vuetify/theme', themeName)
}

// Funktion zum Senden von Daten
const sendData = (id: string, value: any) => {
    communicationStore.sendControl('vuetify', id, value)
}

// Event Handler
const handleTextField = (value: string) => {
    sendData('vuetify/textfield', value)
}

const handleTextarea = (value: string) => {
    sendData('vuetify/textarea', value)
}

const handleSelect = (value: string) => {
    sendData('vuetify/select', value)
}

const handleAutocomplete = (value: string) => {
    sendData('vuetify/autocomplete', value)
}

const handleCheckbox = (value: boolean) => {
    sendData('vuetify/checkbox', value)
}

const handleCheckboxGroup = (value: string[]) => {
    sendData('vuetify/checkbox-group', value)
}

const handleRadio = (value: string) => {
    sendData('vuetify/radio', value)
}

const handleSwitch = (value: boolean) => {
    sendData('vuetify/switch', value)
}

const handleSlider = (value: number) => {
    sendData('vuetify/slider', value)
}

const handleRangeSlider = (value: number[]) => {
    sendData('vuetify/range-slider', value)
}

const handleRating = (value: number) => {
    sendData('vuetify/rating', value)
}

const handleDate = (value: string) => {
    sendData('vuetify/date', value)
}

const handleTime = (value: string) => {
    sendData('vuetify/time', value)
}

const handleColorPicker = (value: string) => {
    sendData('vuetify/color', value)
}

const handleButton = (buttonId: string) => {
    sendData(`vuetify/button/${buttonId}`, { clicked: true, timestamp: Date.now() })
    snackbar.value = true
}

const handleChipSelection = (value: string[]) => {
    sendData('vuetify/chips', value)
}

const handleListSelection = (value: string[]) => {
    sendData('vuetify/list-selection', value)
}

const handleStepper = (value: number) => {
    sendData('vuetify/stepper', value)
}

const handleTab = (value: string) => {
    sendData('vuetify/tab', value)
}
</script>

<template>
    <v-app>
        <v-app-bar color="primary" prominent>
            <v-app-bar-nav-icon>
                <RouterLink to="/" style="text-decoration: none; color: inherit;">
                    <v-btn icon="mdi-arrow-left" />
                </RouterLink>
            </v-app-bar-nav-icon>
            <v-app-bar-title>Vuetify Components Showcase</v-app-bar-title>
            <v-spacer></v-spacer>

            <!-- Theme Switcher -->
            <v-menu v-model="themeMenuOpen" :close-on-content-click="false">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-palette" class="mr-2" />
                </template>
                <v-card min-width="300">
                    <v-card-title>Theme auswählen</v-card-title>
                    <v-divider />
                    <v-list>
                        <v-list-item v-for="themeOption in themes" :key="themeOption.name"
                            @click="changeTheme(themeOption.name)" :active="currentTheme === themeOption.name">
                            <template #prepend>
                                <v-icon :icon="themeOption.icon" />
                            </template>
                            <v-list-item-title>{{ themeOption.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ themeOption.description }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>

            <v-chip :color="communicationStore.isFullyConnected ? 'success' : 'error'" variant="flat">
                <v-icon start>{{ communicationStore.isFullyConnected ? 'mdi-check-circle' : 'mdi-alert-circle'
                    }}</v-icon>
                {{ communicationStore.isFullyConnected ? 'Connected' : 'Disconnected' }}
            </v-chip>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <!-- Theme Info Banner -->
                <!-- <v-row>
                    <v-col cols="12">
                        <v-alert type="info" variant="tonal" prominent border="start">
                            <v-alert-title>
                                <v-icon start>mdi-palette</v-icon>
                                Theme Switcher
                            </v-alert-title>
                            <div>
                                Klicken Sie auf das Palette-Icon in der App-Bar, um zwischen 8 verschiedenen Themes zu
                                wechseln.
                                Jeder Theme-Wechsel wird automatisch über WebSocket und MQTT an vvvv gesendet.
                                <br>
                                <strong>Aktuelles Theme:</strong> {{themes.find(t => t.name === currentTheme)?.title}}
                            </div>
                        </v-alert>
                    </v-col>
                </v-row> -->

                <v-row>
                    <!-- Text Inputs Section -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Text Inputs</v-card-title>
                            <v-card-text>
                                <v-text-field v-model="textField" label="Text Field" variant="outlined" clearable
                                    prepend-inner-icon="mdi-text" @update:model-value="handleTextField" />

                                <v-textarea v-model="textarea" label="Textarea" variant="outlined" rows="3" clearable
                                    prepend-inner-icon="mdi-text-box" @update:model-value="handleTextarea" />

                                <v-text-field label="Password" type="password" variant="outlined"
                                    prepend-inner-icon="mdi-lock" />

                                <v-text-field label="Email" type="email" variant="outlined"
                                    prepend-inner-icon="mdi-email" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Selection Controls -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Selection Controls</v-card-title>
                            <v-card-text>
                                <v-select v-model="select" :items="selectItems" label="Select" variant="outlined"
                                    prepend-inner-icon="mdi-format-list-bulleted" @update:model-value="handleSelect" />

                                <v-autocomplete v-model="autocomplete" :items="selectItems" label="Autocomplete"
                                    variant="outlined" prepend-inner-icon="mdi-magnify"
                                    @update:model-value="handleAutocomplete" />

                                <v-combobox v-model="combobox" :items="selectItems" label="Combobox" variant="outlined"
                                    prepend-inner-icon="mdi-form-dropdown" />

                                <v-checkbox v-model="checkbox" label="Single Checkbox" color="primary"
                                    @update:model-value="handleCheckbox" />

                                <v-checkbox-group v-model="checkboxGroup" @update:model-value="handleCheckboxGroup">
                                    <v-checkbox label="Option A" value="a" />
                                    <v-checkbox label="Option B" value="b" />
                                    <v-checkbox label="Option C" value="c" />
                                </v-checkbox-group>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Radio & Switch -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Radio & Switch</v-card-title>
                            <v-card-text>
                                <v-radio-group v-model="radio" @update:model-value="handleRadio">
                                    <v-radio label="Option 1" value="option1" />
                                    <v-radio label="Option 2" value="option2" />
                                    <v-radio label="Option 3" value="option3" />
                                </v-radio-group>

                                <v-switch v-model="switchValue" label="Enable Feature" color="primary" inset
                                    @update:model-value="handleSwitch" />

                                <v-switch label="Dark Mode" color="secondary" inset />

                                <v-switch label="Notifications" color="success" inset />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Sliders & Rating -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Sliders & Rating</v-card-title>
                            <v-card-text>
                                <v-slider v-model="slider" label="Slider" :min="0" :max="100" :step="1" thumb-label
                                    color="primary" @update:model-value="handleSlider" />

                                <v-range-slider v-model="rangeSlider" label="Range Slider" :min="0" :max="100" :step="1"
                                    thumb-label color="secondary" @update:model-value="handleRangeSlider" />

                                <div class="mb-4">
                                    <label class="text-subtitle-2 mb-2 d-block">Rating</label>
                                    <v-rating v-model="rating" color="yellow-darken-2" half-increments hover
                                        @update:model-value="handleRating" />
                                </div>

                                <v-slider label="Volume" :min="0" :max="100" prepend-icon="mdi-volume-high"
                                    color="green" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Buttons -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Buttons</v-card-title>
                            <v-card-text>
                                <div class="d-flex flex-column ga-2">
                                    <v-btn color="primary" @click="handleButton('primary')">Primary Button</v-btn>
                                    <v-btn color="secondary" @click="handleButton('secondary')">Secondary Button</v-btn>
                                    <v-btn color="success" @click="handleButton('success')">Success Button</v-btn>
                                    <v-btn color="error" @click="handleButton('error')">Error Button</v-btn>
                                    <v-btn color="warning" @click="handleButton('warning')">Warning Button</v-btn>
                                    <v-btn color="info" @click="handleButton('info')">Info Button</v-btn>
                                    <v-btn variant="outlined" @click="handleButton('outlined')">Outlined</v-btn>
                                    <v-btn variant="text" @click="handleButton('text')">Text Button</v-btn>
                                    <v-btn variant="tonal" @click="handleButton('tonal')">Tonal Button</v-btn>
                                    <v-btn icon="mdi-heart" color="pink" @click="handleButton('icon')" />
                                    <v-btn prepend-icon="mdi-download" @click="handleButton('with-icon')">
                                        With Icon
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Date & Time -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Date & Time & Color</v-card-title>
                            <v-card-text>
                                <v-text-field v-model="date" label="Date" type="date" variant="outlined"
                                    prepend-inner-icon="mdi-calendar" @update:model-value="handleDate" />

                                <v-text-field v-model="time" label="Time" type="time" variant="outlined"
                                    prepend-inner-icon="mdi-clock" @update:model-value="handleTime" />

                                <v-text-field v-model="colorPicker" label="Color Picker" type="color" variant="outlined"
                                    prepend-inner-icon="mdi-palette" @update:model-value="handleColorPicker" />

                                <v-file-input v-model="fileInput" label="File Input" variant="outlined" multiple
                                    prepend-icon="mdi-paperclip" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Chips -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Chips</v-card-title>
                            <v-card-text>
                                <v-chip-group v-model="chipSelection" column multiple
                                    @update:model-value="handleChipSelection">
                                    <v-chip filter variant="outlined" value="chip1">Chip 1</v-chip>
                                    <v-chip filter variant="outlined" value="chip2">Chip 2</v-chip>
                                    <v-chip filter variant="outlined" value="chip3">Chip 3</v-chip>
                                    <v-chip filter variant="outlined" value="chip4">Chip 4</v-chip>
                                </v-chip-group>

                                <div class="mt-4">
                                    <v-chip color="primary" prepend-icon="mdi-account">User</v-chip>
                                    <v-chip color="success" prepend-icon="mdi-check" class="ml-2">Active</v-chip>
                                    <v-chip color="error" prepend-icon="mdi-close" class="ml-2" closable>Error</v-chip>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Progress & Loading -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Progress & Loading</v-card-title>
                            <v-card-text>
                                <v-progress-linear v-model="progressValue" color="primary" height="25">
                                    <strong>{{ progressValue }}%</strong>
                                </v-progress-linear>

                                <v-progress-linear color="secondary" indeterminate class="mt-4" />

                                <v-progress-circular :model-value="progressValue" :size="80" :width="8" color="primary"
                                    class="mt-4">
                                    {{ progressValue }}%
                                </v-progress-circular>

                                <v-progress-circular indeterminate color="secondary" class="ml-4 mt-4" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Lists -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Lists</v-card-title>
                            <v-list v-model:selected="listSelection" select-strategy="multiple"
                                @update:selected="handleListSelection">
                                <v-list-item value="item1" prepend-icon="mdi-home">
                                    <v-list-item-title>Home</v-list-item-title>
                                </v-list-item>
                                <v-list-item value="item2" prepend-icon="mdi-account">
                                    <v-list-item-title>Profile</v-list-item-title>
                                </v-list-item>
                                <v-list-item value="item3" prepend-icon="mdi-cog">
                                    <v-list-item-title>Settings</v-list-item-title>
                                </v-list-item>
                                <v-list-item value="item4" prepend-icon="mdi-information">
                                    <v-list-item-title>About</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-col>

                    <!-- Tabs -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-tabs v-model="tabValue" bg-color="primary" @update:model-value="handleTab">
                                <v-tab value="tab1">Tab 1</v-tab>
                                <v-tab value="tab2">Tab 2</v-tab>
                                <v-tab value="tab3">Tab 3</v-tab>
                            </v-tabs>

                            <v-card-text>
                                <v-window v-model="tabValue">
                                    <v-window-item value="tab1">
                                        <p>Content for Tab 1</p>
                                    </v-window-item>
                                    <v-window-item value="tab2">
                                        <p>Content for Tab 2</p>
                                    </v-window-item>
                                    <v-window-item value="tab3">
                                        <p>Content for Tab 3</p>
                                    </v-window-item>
                                </v-window>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Expansion Panels -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Expansion Panels</v-card-title>
                            <v-expansion-panels v-model="expansionPanel">
                                <v-expansion-panel>
                                    <v-expansion-panel-title>Panel 1</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        Content for expansion panel 1
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-title>Panel 2</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        Content for expansion panel 2
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-title>Panel 3</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        Content for expansion panel 3
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card>
                    </v-col>

                    <!-- Stepper -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Stepper</v-card-title>
                            <v-stepper v-model="stepper" @update:model-value="handleStepper">
                                <v-stepper-header>
                                    <v-stepper-item :complete="stepper > 1" :value="1" title="Step 1" />
                                    <v-divider />
                                    <v-stepper-item :complete="stepper > 2" :value="2" title="Step 2" />
                                    <v-divider />
                                    <v-stepper-item :value="3" title="Step 3" />
                                </v-stepper-header>

                                <v-stepper-window>
                                    <v-stepper-window-item :value="1">
                                        <v-card-text>Content for Step 1</v-card-text>
                                        <v-card-actions>
                                            <v-btn @click="stepper = 2">Next</v-btn>
                                        </v-card-actions>
                                    </v-stepper-window-item>

                                    <v-stepper-window-item :value="2">
                                        <v-card-text>Content for Step 2</v-card-text>
                                        <v-card-actions>
                                            <v-btn @click="stepper = 1">Back</v-btn>
                                            <v-btn @click="stepper = 3">Next</v-btn>
                                        </v-card-actions>
                                    </v-stepper-window-item>

                                    <v-stepper-window-item :value="3">
                                        <v-card-text>Content for Step 3</v-card-text>
                                        <v-card-actions>
                                            <v-btn @click="stepper = 2">Back</v-btn>
                                            <v-btn color="success">Finish</v-btn>
                                        </v-card-actions>
                                    </v-stepper-window-item>
                                </v-stepper-window>
                            </v-stepper>
                        </v-card>
                    </v-col>

                    <!-- Alerts & Banners -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Alerts & Banners</v-card-title>
                            <v-card-text>
                                <v-alert type="success" variant="tonal" class="mb-2">Success Alert</v-alert>
                                <v-alert type="info" variant="tonal" class="mb-2">Info Alert</v-alert>
                                <v-alert type="warning" variant="tonal" class="mb-2">Warning Alert</v-alert>
                                <v-alert type="error" variant="tonal" class="mb-2">Error Alert</v-alert>
                                <v-alert type="info" variant="outlined" closable>Closable Alert</v-alert>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Dialog & Snackbar -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Dialog & Snackbar</v-card-title>
                            <v-card-text>
                                <v-btn color="primary" @click="dialogVisible = true">Open Dialog</v-btn>

                                <v-dialog v-model="dialogVisible" max-width="500">
                                    <v-card>
                                        <v-card-title>Dialog Title</v-card-title>
                                        <v-card-text>
                                            This is a dialog with some content.
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn @click="dialogVisible = false">Cancel</v-btn>
                                            <v-btn color="primary" @click="dialogVisible = false">OK</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <v-snackbar v-model="snackbar" :timeout="2000" color="success">
                                    Button clicked!
                                    <template #actions>
                                        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
                                    </template>
                                </v-snackbar>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Badges & Avatars -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Badges & Avatars</v-card-title>
                            <v-card-text>
                                <div class="d-flex align-center ga-4">
                                    <v-badge content="6" color="error">
                                        <v-icon size="large">mdi-bell</v-icon>
                                    </v-badge>

                                    <v-badge dot color="success">
                                        <v-avatar color="primary">
                                            <v-icon>mdi-account</v-icon>
                                        </v-avatar>
                                    </v-badge>

                                    <v-avatar color="secondary" size="large">
                                        <span class="text-h6">JD</span>
                                    </v-avatar>

                                    <v-avatar color="success">
                                        <v-icon>mdi-check</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Tooltips & Menus -->
                    <v-col cols="12" md="6" lg="4">
                        <v-card>
                            <v-card-title>Tooltips & Menus</v-card-title>
                            <v-card-text>
                                <v-tooltip text="This is a tooltip" location="top">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props">Hover me</v-btn>
                                    </template>
                                </v-tooltip>

                                <v-menu>
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" class="ml-2">Open Menu</v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item value="1">
                                            <v-list-item-title>Menu Item 1</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item value="2">
                                            <v-list-item-title>Menu Item 2</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item value="3">
                                            <v-list-item-title>Menu Item 3</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Data Table -->
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>Data Table</v-card-title>
                            <v-data-table :headers="[
                                { title: 'Name', key: 'name' },
                                { title: 'Value', key: 'value' },
                                { title: 'Status', key: 'status' }
                            ]" :items="[
                                { name: 'Item 1', value: 100, status: 'Active' },
                                { name: 'Item 2', value: 200, status: 'Inactive' },
                                { name: 'Item 3', value: 300, status: 'Active' },
                                { name: 'Item 4', value: 400, status: 'Pending' }
                            ]" items-per-page="5">
                                <template #item.status="{ item }">
                                    <v-chip
                                        :color="item.status === 'Active' ? 'success' : item.status === 'Inactive' ? 'error' : 'warning'"
                                        size="small">
                                        {{ item.status }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
.v-card {
    height: 100%;
}

.v-card-text {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
