<div class="mobile-update-verification-popup-wrapper">
    <button type="button" class="close" aria-label="Close"></button>
    <div class="title">{{ Lang::get('auth.mobile_verification') }}</div>
    <div class="response-popup response"></div>
    @component('components.misc.form')
        @slot('form_id') mobile-verification-form @endslot
        @slot('class') form-horizontal mobileVerificationForm @endslot
        @component('components.misc.form-group-col')
            @slot('label') {{ Lang::get('auth.mobile_phone') }} @endslot
            @slot('class') mobile-verification-input form-control  @endslot
            @slot('name') phone_number @endslot
            @slot('field_id') new_phone_number @endslot
            @slot('readonly') @endslot
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
