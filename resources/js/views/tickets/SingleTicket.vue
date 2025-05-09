<template>
    <div v-if="!isLoading">
        <Header :title="title" :showBack="true" :showLogo="false" @on-currency-change="onChangeCurrency"/>
        <section>
            <div v-if="ticket" class="list">
                <v-alert type="error" v-if="error">
                    {{ error }}
                </v-alert>
                <v-alert type="success" v-if="success">
                    {{ success }}
                </v-alert>
                <h2>{{ ticket.ticket_number }}</h2>
                <img :src="ticket.image" alt="QR image" class="qr-image">
                <div class="ticket">
                    <div class="first_box">
                        <div class="passenger">
                            <p class="title_area">{{ lang.salesHistory.passenger }}</p>
                            <p class="passenger_name">{{ ticket.passenger }}</p>
                        </div>
                        <div class="amount price">
                            {{ ticket.price }} {{ selectedCurrency }}
                        </div>                    
                    </div>
                    <div class="second_box">
                        <div class="from">
                            <p class="title_area">{{ lang.salesHistory.departure }}</p>
                            <p class="city_name">{{ ticket.from }}</p>
                        </div>
                        <div class="date">
                            <p class="title_area">{{ lang.salesHistory.date }}</p>
                            <p class="departure_date">{{ ticket.departure_date }}</p>
                        </div>
                        <div class="departure_time">
                            <p class="title_area">{{ lang.salesHistory.departure_time }}</p>
                            <p class="time">{{ ticket.departure_time }}</p>
                        </div>
                    </div>
                    <div class="third_box">
                        <div class="destination">
                            <p class="title_area">{{ lang.salesHistory.arrival }}</p>
                            <p class="city_destination">{{ ticket.to }}</p>
                        </div>
                        <div class="seat">
                            <p class="title_area">{{ lang.salesHistory.seat }}</p>
                            <p class="seat_number">{{ ticket.seat_number }}</p>
                        </div>
                        <div class="destination_time">
                            <p class="title_area">{{ lang.salesHistory.arrival_time }}</p>
                            <p class="time">{{ ticket.arrival_time }}</p>
                        </div>
                    </div>
                </div>
                <h4>{{ lang.routeNumber }}</h4>
                <h3 class="reverse_time">{{ ticket.route_number }}</h3>
                <h4>{{ lang.beforeDeparture }}</h4>
                <h3 class="reverse_time" v-if="theCountdown">
                    <countdown :time="theCountdown" :transform="transform" :interval="100" tag="p">
                        <template slot-scope="props">
                            {{ props.days || null }}
                            <span v-if="props.days > 0">{{ getDaysText(props.days) }}</span>
                            {{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}
                        </template>
                    </countdown>
                </h3>
                <!-- <v-btn class="submit gradiented no-margins-vertical" :loading="cancelLoading" @click="cancelPopup(ticket.id)" v-if="ticket.sale_status === 1">
                    {{ lang.singleTicket.cancel }}
                </v-btn> -->
            </div>
        </section>
        <Footer :key="$store.state.new_notifications"/>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline" v-if="modalTitle && modalTitle.length">{{ modalTitle }}</v-card-title>
                <v-card-text>
                    {{ modalText }}
                </v-card-text>
                <v-card-actions>
                    <v-row class="clearfix no-margins">
                        <v-col :cols="6">
                            <v-btn color="primary" class="popupButton" @click="dialog = false">
                                {{ lang.no }}
                            </v-btn>
                        </v-col>
                        <v-col :cols="6">
                            <v-btn outlined class="popupButton" :loading="isLoadingCancel" @click="cancelTicket(modalId)">
                                {{ lang.yes }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
    <div v-else>
        <v-loading/>
    </div>
</template>

<script>
import { scroller } from 'vue-scrollto/src/scrollTo';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import VLoading from "../../components/Loading";
import modals from "../../modals";
import lang from "../../translations";

export default {
    name: "singleTicket",
    components: {VLoading, Header, Footer},
    methods: {
        getDaysText(day) {
            return (parseInt(day) === 1) ? lang[this.$store.state.locale].day : lang[this.$store.state.locale].days
        },
        transform(props) {
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'days') {
                    if (value > 0) {
                        props[key] = `${value}`
                    }
                } else {
                    const digits = value < 10 ? `0${value}` : value
                    props[key] = `${digits}`
                }
            })
            return props
        },
        scrollTo(div) {
            const scr = scroller()
            scr('#' + div)
        },
        cancelPopup(id) {
            this.cancelLoading = true
            this.$store.dispatch('apiCall', {
                actionName: 'getCancelTicketModalText',
                data: {
                    id: id,
                    lang: this.$store.state.locale,
                }
            }).then(d => {
                this.cancelLoading = false
                this.dialog = true
                this.modalId = id
                this.modalTitle = modals[this.$store.state.locale].cancelTicket.title
                this.modalText = d.data.text
            }).catch(e => {
                this.error = e.response.data.text
                this.success = null
                this.cancelLoading = false
                this.scrollTo('app')
            })
        },
        cancelTicket(id) {
            this.isLoadingCancel = true
            this.$store.dispatch('apiCall', {
                actionName: 'performRefund',
                data: {
                    id: id,
                    lang: this.$store.state.locale,
                }
            }).then(d => {
                this.success = d.data.text
                this.error = null
                this.isLoadingCancel = false
                this.dialog = false
                this.scrollTo('app')
            }).catch(e => {
                this.error = e.response.data.text
                this.succcess = null
                this.dialog = false
                this.isLoadingCancel = false
                this.scrollTo('app')
            })
        },
        onChangeCurrency(){
            const selectedRateObj = this.currencyRates.find(
                currency => currency.key === this.selectedCurrency
            );
            const rate = selectedRateObj ? parseFloat(selectedRateObj.value) : 1.0;
            const newPrice = (parseFloat(this.ticket.price) * rate).toFixed(2);
            this.ticket.price = newPrice
        }
    },
    data() {
        return {
            componentKey: 1,
            title: lang[this.$store.state.locale].singleTicket.title,
            ticket: null,
            lang: lang[this.$store.state.locale],
            theCountdown: null,
            isLoading: true,
            dialog: false,
            cancelLoading: false,
            modalText: null,
            success: null,
            error: null,
            modalTitle: null,
            isLoadingCancel: false,
            modalId: 0,
            selectedCurrency: localStorage.getItem('selected_currency') ?? "LKR",
            currencyRates: JSON.parse(localStorage.getItem('currencies')) || [],
        }
    },
    async mounted () {
        document.title = this.title
        await this.$store.dispatch('apiCall', {
            actionName: 'getTicket',
            data: {
                lang: this.$store.state.locale,
                id: this.$route.params.id,
            }
        }).then(d => {
            this.ticket = d.data
            this.theCountdown = d.data.countdownTimestamp * 1000
            this.isLoading = false
        }).catch(e => {
            this.isLoading = false
            this.$router.go(-1)
            console.log(e)
        })
        this.onChangeCurrency()
    }
}
</script>
<style scoped src="../css/SingleTicket.css"/>
