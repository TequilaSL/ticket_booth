import jwt from 'jsonwebtoken'
import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api'
import axios from '../axios'
import locales from '../languages'
import router from '../routes'

Vue.use(Vuex)

const localesToSearch = Object.keys(locales)

export const accessTokenRoles = (userData) => {
    if (userData && userData.length) {
        const uData = JSON.parse(userData)
        const decoder = jwt.decode(uData.access_token)
        return decoder.roles
    } else {
        return []
    }
}

export default new Vuex.Store({

    state: {
        user: (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null,
        roles: accessTokenRoles(localStorage.getItem('user')),
        locale: (localStorage.getItem('locale') && localesToSearch.includes(localStorage.getItem('locale'))) ? localStorage.getItem('locale') : 'en',
        isLoggedIn: (localStorage.getItem('isLoggedIn')) ? (localStorage.getItem('isLoggedIn') === 'true') : false,
        new_notifications: 0,
        wizardStep: (localStorage.getItem('wizardStep')) ? parseInt(localStorage.getItem('wizardStep')) : 1,
        wizardVehicleId: (localStorage.getItem('wizardVehicleId')) ? parseInt(localStorage.getItem('wizardVehicleId')) : 0,
        routeEditHideForm: 0,
        routeEditSmallHeader: 0,
        routeEditHidePreserve: 0
    },
    mutations: {
        setUserData(state, userData) {
            state.user = userData
            state.isLoggedIn = true
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('user', JSON.stringify(userData))
            state.roles = accessTokenRoles(JSON.stringify(userData))
        },
        clearUserData() {
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('wizardVehicleId')
            localStorage.removeItem('wizardStep')
            location.href = '/login'
        },
        changeLanguage(state, locale) {
            state.locale = locale
            localStorage.setItem('locale', locale)
        },
        setNewNotifications(state, count) {
            state.new_notifications = count
        },
        setWizardStep(state, step) {
            state.wizardStep = step
            localStorage.setItem('wizardStep', step)
        },
        setWizardVehicleId(state, id) {
            state.wizardVehicleId = id
            localStorage.setItem('wizardVehicleId', id)
        },
        addToRoles(state, role) {
            if (!state.roles.includes(role)) {
                state.roles.push(role)
            }
        },
        setRouteEditHideForm(state, value) {
            state.routeEditHideForm = value
        },
        setRouteEditHidePreserve(state, value) {
            state.routeEditHidePreserve = value
        },
        setRouteEditSmallHeader(state, value) {
            state.routeEditSmallHeader = value
        }
    },
    actions: {
        async apiCall({commit}, payload) {
            try {
                const apiFind = api.find(o => o.name === payload.actionName)
                let response
                switch (apiFind.method) {
                    case 'GET':
                        response = await axios.get(apiFind.url, {params: payload.data})
                        break
                    case 'POST':
                        response = await axios.post(apiFind.url, payload.data)
                        break
                }

                if (payload.commit) {
                    let username = payload.data.get('username');
                    response.data.username = username;
                    commit(payload.commit, response.data)
                }

                // if (payload.actionName === 'login' ) {
                //     const apiFindLogin = api.find(o => o.name === 'loginForWeb')
                //     if (payload.data) {
                //         payload.data.append('phone_number', payload.data.get('username'))
                //         const loginResponse = await axios.post(apiFindLogin.url, payload.data)
                //         // if (loginResponse.status === 0 ) {
                //         //     response.data.phone_number = payload.data.get('phone_number')
                //         // } else {
                //         //     // handle error
                //         // }
                //     }
                // }

                if (payload.actionName === 'forgot') {
                    await router.push('login')
                }

                if (payload.onSuccessRedirect) {
                    let redirectObject
                    if (payload.onSuccessRedirectQuery) {
                        redirectObject = {
                            name: payload.onSuccessRedirect,
                            query: payload.onSuccessRedirectQuery
                        }
                    } else {
                        redirectObject = {
                            name: payload.onSuccessRedirect
                        }
                    }
                    await router.push(redirectObject)
                }
                return response
            } catch (error) {
                console.error('API Call Error:', error)
                return Promise.reject(error)
            }
        },
        async logout({commit}) {
            commit('clearUserData')
            const apiFind = api.find(o => o.name === 'logoutForWeb')
            await axios.post(apiFind.url)
        },
        languageChange({commit}, locale) {
            commit('changeLanguage', locale)
        }
    }
})
