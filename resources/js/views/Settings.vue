<template>
    <div>
        <Header :title="title" :show-back="true" :show-logo="true" :hideLogoText="true" :parent="parent" :caption="caption"/>
        <MenuBlock :blocks="blocks"/>
        <Footer :key="$store.state.new_notifications"/>
    </div>
</template>
<script>
import Footer from '../components/Footer'
import Header from '../components/Header'
import MenuBlock from '../components/MenuBlock'
import lang from '../translations'

export default {
    components: {Footer, MenuBlock, Header},
    data() {
        return {
            parent: this.$route.meta.parent,
            title: lang[this.$store.state.locale].settings.title,
            caption: lang[this.$store.state.locale].settings.caption,
            blocks: [
                {
                    name: 'profile',
                    image: 'personal.svg',
                    showLine: true,
                    title: lang[this.$store.state.locale].settings.blocks.profile,
                    subTitle: lang[this.$store.state.locale].settings.blocks.profile_sub,
                    rightIcon: 'right_arrow.svg'
                },
                {
                    name: 'driversLicense',
                    image: 'driver/dr_licanse_icon.svg',
                    showLine: true,
                    showIfRole: 'driver',
                    title: lang[this.$store.state.locale].settings.blocks.driversLicense,
                    subTitle: lang[this.$store.state.locale].settings.blocks.driversLicense_sub,
                    rightIcon: 'right_arrow.svg'
                },
                {
                    name: 'password',
                    image: 'password.svg',
                    showLine: true,
                    title: lang[this.$store.state.locale].settings.blocks.password,
                    subTitle: lang[this.$store.state.locale].settings.blocks.password_sub,
                    rightIcon: 'right_arrow.svg'
                },
                {
                    name: 'changePhoneNumber',
                    image: 'phone.svg',
                    showLine: true,
                    title: lang[this.$store.state.locale].settings.blocks.phone_number,
                    subTitle: lang[this.$store.state.locale].settings.blocks.phone_number_sub,
                    rightIcon: 'right_arrow.svg'
                },
                {
                    name: 'financial',
                    image: 'bank.svg',
                    showLine: true,
                    title: lang[this.$store.state.locale].settings.blocks.financial,
                    subTitle: lang[this.$store.state.locale].settings.blocks.financial_sub,
                    rightIcon: 'right_arrow.svg'
                }
            ]
        }
    },
    mounted() {
        document.title = this.title
    }
}
</script>
