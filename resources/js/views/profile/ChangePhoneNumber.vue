<template>
    <div>
        <Header :title="title" :parent="parent" :showLogo="true"/>
        <section>
            <vzForm :formId="formParams.formId" formClass="borderless-form" v-bind="formParams"/>
        </section>
        <Footer :key="$store.state.new_notifications"/>
    </div>
</template>

<script>
import Footer from '../../components/Footer'
import vzForm from '../../components/Form'
import Header from '../../components/Header'
import lang from '../../translations'
import validations from '../../validations'

export default {
    components: {vzForm, Header, Footer},
    data() {
        return {
            parent: this.$route.meta.parent,
            title: lang[this.$store.state.locale].changePhoneNumber.title,
            isLoading: true,
            formParams: {
                formId: 'changePhoneNumber',
                formClass: 'default-form',
                customResponseHandle: this.handleResponse,
                successProp: null,
                errorProp: null,
                submit: {
                    icon: 'mdi-content-save',
                    class: 'submit',
                    large: true,
                    block: true,
                    loading: false,
                    text: lang[this.$store.state.locale].changePhoneNumber.saveButton
                },
                items: [
                    {
                        placeholder: lang[this.$store.state.locale].changePhoneNumber.fields.placeholders.phone_number,
                        field: 'input',
                        name: 'phone_number',
                        class: 'forceEng',
                        plb: true,
                        value: this.$store.state.user.username,
                        disabled: true,
                        labelImage: 'form/phone.svg'
                    },
                    {
                        placeholder: lang[this.$store.state.locale].changePhoneNumber.fields.placeholders.new_phone_number,
                        field: 'input',
                        type: 'number',
                        name: 'new_mobile',
                        rules: [
                            v => !!v || validations[this.$store.state.locale].changePhoneNumber.phone_number.required,                        ],
                        plb: true,
                        value: '',
                        labelImage: 'form/phone.svg'
                    },
                    {
                        placeholder: lang[this.$store.state.locale].changePhoneNumber.fields.placeholders.password,
                        field: 'input',
                        type: 'password',
                        name: 'password',
                        rules: [
                            v => !!v || validations[this.$store.state.locale].changePhoneNumber.password.required
                        ],
                        value: '',
                        plb: true,
                        labelImage: 'form/unlock.svg',
                        pwShowIcon: 'form/show.png',
                        pwHideIcon: 'form/hide.png'
                    },
                    {
                        placeholder: lang[this.$store.state.locale].changePhoneNumber.fields.placeholders.otpCode,
                        field: 'hidden',
                        type: 'number',
                        name: 'otp_code',
                        labelImage: 'form/phone.svg',
                        rules: [
                            v => !!v || validations[this.$store.state.locale].changePhoneNumber.otpCode.required
                        ],
                        value: '',
                        plb: true,
                    }
                ]
            }
        }
    },
    mounted() {
        document.title = this.title
        this.isLoading = true
        this.$store.dispatch('apiCall', { actionName: 'profileGet' })
        .then(data => {
            this.isLoading = false

            this.$store.state.user.username = data.data.phone_number
            this.formParams.items[0].value = data.data.phone_number
            }).catch(e => {
                this.isLoading = false
                console.log('change phone number mount error',e)
                this.formParams.errorProp = e
            })
    },
    methods: {
        handleResponse(param) {
            console.log('ChangePhoneNumber__handleResponse________', param);
            if (param.status === 1) {
                this.formParams.formId = 'verifyChangeNumberOTP'
                this.formParams.successProp = param.text
            } else{
                this.formParams.errorProp = param.text
            }
        }
    }
}
</script>
<style scoped src="../css/changePassword.css"/>
