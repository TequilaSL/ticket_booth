<div class="mobile-verification-btn-wrapper">
    <div class="mobile-verification-popup-wrapper">
        <button type="button" class="close" aria-label="Close"></button>
        <div class="title">{{ Lang::get('auth.mobile_verification') }}</div>
        <div class="response mini"></div>
        @component('components.misc.form')
            @slot('form_id') mobile-verification-form @endslot
            @slot('class') form-horizontal mobileVerificationForm @endslot
            @slot('subtitle') {!! Lang::get('auth.sign_in_redirect_message') !!} @endslot
            @component('components.misc.form-group-col')
                @slot('label') {{ Lang::get('auth.mobile_phone') }} @endslot
                @slot('class') mobile-verification-input form-control  @endslot
                @slot('name') phone_number @endslot
                @slot('field_id') phone_number3 @endslot
            @endcomponent
            @component('components.misc.form-group-col')
                @slot('label') {{ Lang::get('auth.password') }} @endslot
                @slot('class') mobile-verification-input form-control @endslot
                @slot('name') password @endslot
                @slot('type') password @endslot
                @slot('field_id') password-input @endslot
            @endcomponent
            @component('components.misc.form-group-col')
                @slot('label') {{ Lang::get('auth.password_confirm') }} @endslot
                @slot('class') mobile-verification-input form-control @endslot
                @slot('name') password_confirmation @endslot
                @slot('type') password @endslot
                @slot('field_id') password_confirmation @endslot
            @endcomponent
            @component('components.misc.form-group-col')
                @slot('label') {{ Lang::get('auth.otp_code') }} @endslot
                @slot('class') mobile-verification-otp form-control @endslot
                @slot('name') otp_code @endslot
                @slot('field_id') otp_code @endslot
            @endcomponent
            @component('components.misc.submit-button')
                @slot('anchor') {{ Lang::get('auth.get_mobile_verification') }} <i class="fa fa-angle-double-right" aria-hidden="true"></i> @endslot
            @endcomponent
        @endcomponent
    </div>
</div>
