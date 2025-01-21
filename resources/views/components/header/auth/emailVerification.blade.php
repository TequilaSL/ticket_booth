<div class="email-verification-btn-wrapper">
    <div class="email-verification-popup-wrapper">
        <button type="button" class="close" aria-label="Close"></button>
        <div class="title">{{ Lang::get('auth.email_verification') }}</div>
        <div class="response mini"></div>
        @component('components.misc.form')
            @slot('form_id') email-verification-form @endslot
            @slot('class') form-horizontal registerForm @endslot
            @slot('subtitle') {!! Lang::get('auth.sign_in_redirect_message') !!} @endslot
            @component('components.misc.form-group-col')
                @slot('label') {{ Lang::get('auth.email_address') }} @endslot
                @slot('name') email @endslot
                @slot('no_id') @endslot
            @endcomponent
            <div id="register_element"></div>
            @component('components.misc.submit-button')
                @slot('anchor') {{ Lang::get('auth.verify_email') }} <i class="fa fa-angle-double-right" aria-hidden="true"></i> @endslot
            @endcomponent
        @endcomponent
    </div>
</div>
