import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            defaultTheme: 'light',
            theme: {
                defaultTheme: 'wedding',
                themes: {
                    wedding: {
                        dark: false,
                        colors: {
                            // 🎯 Base
                            background: '#EAF3FB',
                            surface: '#FFFFFF',

                            // 🎯 Primarios
                            primary: '#2984D1',
                            secondary: '#77B1E4',

                            // 🎯 Detalles elegantes
                            accent: '#509BDC',
                            info: '#9DC7EC',

                            // 🎯 Texto
                            'on-background': '#0C253C',
                            'on-surface': '#0C253C',
                            'on-primary': '#FFFFFF',

                            // 🎯 Bordes / suaves
                            outline: '#C3DDF3',
                            'surface-variant': '#F8F8F6'
                        }
                    }
                }
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})
