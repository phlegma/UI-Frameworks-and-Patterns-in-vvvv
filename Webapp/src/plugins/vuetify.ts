import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    background: '#FFFFFF',
                    surface: '#FFFFFF',
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#2196F3',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    background: '#121212',
                    surface: '#212121',
                }
            },
            purple: {
                dark: false,
                colors: {
                    primary: '#9C27B0',
                    secondary: '#7B1FA2',
                    accent: '#E1BEE7',
                    error: '#F44336',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FF9800',
                    background: '#F3E5F5',
                    surface: '#FFFFFF',
                }
            },
            ocean: {
                dark: false,
                colors: {
                    primary: '#006064',
                    secondary: '#00838F',
                    accent: '#00ACC1',
                    error: '#D32F2F',
                    info: '#0288D1',
                    success: '#388E3C',
                    warning: '#F57C00',
                    background: '#E0F7FA',
                    surface: '#FFFFFF',
                }
            },
            sunset: {
                dark: false,
                colors: {
                    primary: '#FF6F00',
                    secondary: '#F57C00',
                    accent: '#FFB74D',
                    error: '#D32F2F',
                    info: '#1976D2',
                    success: '#388E3C',
                    warning: '#FFA000',
                    background: '#FFF3E0',
                    surface: '#FFFFFF',
                }
            },
            forest: {
                dark: false,
                colors: {
                    primary: '#2E7D32',
                    secondary: '#388E3C',
                    accent: '#66BB6A',
                    error: '#C62828',
                    info: '#1976D2',
                    success: '#43A047',
                    warning: '#F57C00',
                    background: '#E8F5E9',
                    surface: '#FFFFFF',
                }
            },
            midnight: {
                dark: true,
                colors: {
                    primary: '#7C4DFF',
                    secondary: '#651FFF',
                    accent: '#B388FF',
                    error: '#FF5252',
                    info: '#448AFF',
                    success: '#69F0AE',
                    warning: '#FFD740',
                    background: '#1A1A2E',
                    surface: '#16213E',
                }
            },
            cyberpunk: {
                dark: true,
                colors: {
                    primary: '#00FFF0',
                    secondary: '#FF00FF',
                    accent: '#FFFF00',
                    error: '#FF0055',
                    info: '#00D9FF',
                    success: '#00FF88',
                    warning: '#FFB800',
                    background: '#0A0E27',
                    surface: '#1A1F3A',
                }
            }
        }
    },
    icons: {
        defaultSet: 'mdi'
    }
})
