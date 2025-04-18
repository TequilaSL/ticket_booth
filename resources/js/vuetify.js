import Vue from 'vue'
import Vuetify from 'vuetify'
import en from './locales/en'
import si from './locales/si'
import ta from './locales/ta'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdiSvg'
  },
  lang: {
    locales: { en, si, ta },
    current: localStorage.getItem('locale') || 'en'
  },
  theme: {
    themes: {
      light: {
        primary: '#f79a1d',
        secondary: '#007bdd',
        success: '#24d477',
        accent: '#f79a1d',
        error: '#f50052',
        blackOne: '#252941',
        greyOne: '#a7a7a7'
      }
    }
  }
}

export default new Vuetify(opts)
