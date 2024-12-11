import Vue from 'vue'
import Routes from './routes'
import App from './views/App'
import store from './vuex/store'
import vuetify from './vuetify'
import VueCountdown from '@chenfengyuan/vue-countdown'

Vue.config.productionTip = false

Vue.component(VueCountdown.name, VueCountdown)

const app = new Vue({
    el: '#app',
    store,
    vuetify,
    mounted() {
        const body = document.body
        if (store.state.locale === 'si') {
            body.classList.add('language_si')
        } else {
            body.classList.remove('language_si')
        }
    },
    router: Routes,
    render: h => h(App)
})

export default app
