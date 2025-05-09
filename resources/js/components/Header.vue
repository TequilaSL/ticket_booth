<template>
    <div>
        <div class="header" :class="{child: isChild}">
            <div class="breadcrumb">
                <a @click="goBack" :class="{hidden: hideBack}">
                    <img :src="imagesPathRewrite('back_arrow.svg')" alt="Back">
                </a>
                <h3 class="head_title" :class="{hasParent: !hideBack}">{{ title }}</h3>
                <router-link :to="{name: 'languages'}" class="languages_menu">
                    <div>{{ locales[this.$store.state.locale].code }}</div>
                </router-link>
                <div class="currency_menu">
                    <select v-model="selectedCurrency" @change="onCurrencyChange">
                        <option v-for="currency in currencyRates" :key="currency.id" :value="currency.key">
                        {{ currency.key }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="header_logo" :class="{mt30: additionalMarginTop}" v-if="showLogo">
            <a href="/" class="logo">
                <img :src="imagesPathRewrite('logo_setting.svg')" alt="Logo setting">
            </a>
            <p class="logo_caption">{{ caption }}</p>
            <h1 class="company_title" :class="{largerLogo: largerLogo}" v-if="!hideLogoText">TicketBooth</h1>
            <div class="caption2" v-if="caption2">{{ caption2 }}</div>
        </div>
    </div>
</template>

<script>
import { imagesPathRewrite } from '../config'
import locales from '../languages'

export default {
        props: {
            isChild: {
                type: Boolean
            },
            showLogo: {
                type: Boolean,
                default: true
            },
            hideLogoText: {
                type: Boolean,
                default: false
            },
            caption: {
                type: String
            },
            caption2: {
                type: String
            },
            parent: {
                type: String
            },
            hideBack: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                required: true
            },
            additionalMarginTop: {
                type: Boolean,
                default: false
            },
            largerLogo: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            goBack() {
                if (!this.parent) {
                    this.$router.go(-1)
                } else {
                    this.$router.push({name: this.parent})
                }
            },
            onCurrencyChange() {
                localStorage.setItem('selected_currency', this.selectedCurrency)
                this.$emit('on-currency-change', this.selectedCurrency)
            },
        },
        data() {
            const storedRates = localStorage.getItem('currencies')
            return {
                locales: locales,
                imagesPathRewrite: imagesPathRewrite,
                selectedCurrency: localStorage.getItem('selected_currency') || 'LKR',
                currencyRates: storedRates ? JSON.parse(storedRates) : [],
            }
        }
}
</script>

<style scoped src="./css/Header.css" />
