<template>
    <div v-if="!isLoading">
        <Header :title="title" :showBack="true" :showLogo="false" @on-currency-change="onChangeCurrency" />
        <section>
        <a :href="($store.state.locale && $store.state.locale !== 'en') ? defaultSiteUrl+'/'+$store.state.locale+'/listings' : `${defaultSiteUrl}/listings`">
                <v-btn class="submit gradiented no-margins-vertical">
                    {{ lang.buyTickets }}
                </v-btn>
            </a>
            <div class="list" v-if="data.items && data.items.length">
                <div class="div-container" :key="i" v-for="(item, i) in convertedItems">
                    <router-link :to="{name: 'singleTicket', params: {id: item.ticket_number }}">
                        <div class="item">
                            <div class="image_block">
                                <img :src="imagesPathRewrite('transport/minibus.svg')" alt="Bus">
                            </div>
                            <div class="description">
                                <p class="route_title"><span>{{ item.departure_date }}</span></p>
                                <p class="route_destination">
                                    {{ item.from }}
                                    <img :src="imagesPathRewrite('arrow-right.svg')" alt="Arrow">
                                    {{ item.to }}
                                </p>
                            </div>
                            <div class="content">
                                <div class="amount">
                                    {{ item.converted_price }} {{ item.currency_key }}
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <router-link :to="{name: 'locationTrack', params: {id: item.ticket_number }}">
                        <div class="image_block">
                            <img :src="imagesPathRewrite('driver/route_icon3x.svg')" alt="Bus" />
                        </div>
                    </router-link>

                </div>
            </div>
            <div class="centered" v-else>
                <h2>{{ lang.ticketList.no_data }}</h2>
            </div>
            <div v-if="data.items && data.items.length >= perPage && data.items.length < total">
                <v-btn class="submit gradiented no-margins-vertical" :loading="listLoading" @click="showMore">
                    {{ lang.showMore }}
                </v-btn>
            </div>
        </section>
        <Footer :key="$store.state.new_notifications"/>
    </div>
    <div v-else>
        <v-loading/>
    </div>
</template>

<script>
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import VLoading from "../../components/Loading"
import { boughtTicketsPerPage, imagesPathRewrite, siteURL } from "../../config"
import lang from "../../translations"

export default {
    name: "ticketList",
    components: {VLoading, Header, Footer},
    computed: {
        convertedItems() {
            const rateObj = this.currencyRates.find(
            (currency) => currency.key === this.selectedCurrency
            );
            const rate = rateObj ? parseFloat(rateObj.value) : 1.0;

            return this.data.items.map(item => ({
                ...item,
                converted_price: (parseFloat(item.price) * rate).toFixed(2),
                currency_key: this.selectedCurrency
            }));
        }
    },
    methods: {
        showMore() {
            this.listLoading = true
            this.skip = this.skip + this.perPage
            this.$store.dispatch('apiCall', {
                actionName: 'getTicketList',
                data: {lang: this.$store.state.locale, skip: this.skip, mobile: true}
            }).then(data => {
                this.data.items = this.data.items.concat(data.data.items)
                this.listLoading = false
            }).catch(e => {
                console.log(e)
            })
        },
        onChangeCurrency(selected){
            this.selectedCurrency = selected;
        }
    },
    data() {
        return {
            title: lang[this.$store.state.locale].ticketList.title,
            defaultSiteUrl: siteURL,
            isLoading: true,
            listLoading: false,
            data: [],
            total: 0,
            perPage: boughtTicketsPerPage,
            skip: 0,
            imagesPathRewrite: imagesPathRewrite,
            lang: lang[this.$store.state.locale],
            selectedCurrency: localStorage.getItem('selected_currency') ?? "LKR",
            currencyRates: JSON.parse(localStorage.getItem('currencies')) || [],
        }
    },
    mounted() {
        document.title = this.title
        this.$store.dispatch('apiCall', {actionName: 'getTicketList', data: {lang: this.$store.state.locale, skip: this.skip, mobile: true}}).then(data => {
            this.data = data.data
            this.total = data.data.total_sold
            this.isLoading = false
        }).catch(e => {
            console.log(e)
        })
    }
}
</script>
<style scoped src="../css/TicketList.css"/>
