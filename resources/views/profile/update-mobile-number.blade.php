@extends('layouts.app', ['isprofile' => 1])

@section('title', 'Zoombus')

@section('body_class')
    @parent
    @if( app()->getLocale() == 'ka')
        language_ge
    @endif
@stop

@section('title1', Lang::get('titles.edit_profile3'))
@section('title2', Lang::get('titles.edit_profile4'))

@section('content')
    <div class="profile-mobile-change">
        <div class="profile-mobile-change-form">
            <div class="response"></div>
            @component('components.misc.form')
                @slot('class') form-horizontal form-default @endslot
                @slot('form_id') updateMobileNumberForm @endslot
                @slot('row_inside') @endslot
                @component('components.misc.form-group-col')
                    @slot('label') {{ Lang::get('auth.old_mobile') }} @endslot
                    @slot('name') phone_number @endslot
                    @slot('field_id') phone_number1 @endslot
                    @slot('value') {{ $phone_number }} @endslot
                    @slot('disabled') @endslot
                    @slot('col') col-md-6 @endslot
                    @slot('faicon') fa-phone @endslot
                @endcomponent
                @component('components.misc.form-group-col')
                    @slot('label') {{ Lang::get('auth.new_mobile') }} @endslot
                    @slot('name') phone_number @endslot
                    @slot('value')  @endslot
                    @slot('field_id') phone_number2 @endslot
                    @slot('col') col-md-6 @endslot
                    @slot('faicon') fa-phone @endslot
                @endcomponent
                @component('components.misc.form-group-col')
                    @slot('label') {{ Lang::get('auth.password') }} @endslot
                    @slot('name') password @endslot
                    @slot('value')  @endslot
                    @slot('type') password @endslot
                    @slot('field_id') password @endslot
                    @slot('col') col-md-6 @endslot
                    @slot('faicon') fa-lock @endslot
                @endcomponent
                @component('components.misc.form-group-col')
                    @slot('field') button @endslot
                    @slot('col') col-md-6 @endslot
                    @slot('class') btn-save @endslot
                    @slot('name') save @endslot
                    @slot('faicon') fa-floppy-o @endslot
                    @slot('label') &nbsp; @endslot
                    @slot('anchor') {{ Lang::get('auth.save') }} @endslot
                @endcomponent
            @endcomponent
        </div>
    <div class="profile-mobile-change-verification">
        @component('components.misc.form')
            @slot('class') form-horizontal form-default @endslot
            @slot('form_id') otpVerificationForm @endslot
            @slot('row_inside') @endslot
            @component('components.header.auth.mobileUpdateVerification')
            @endcomponent
        @endcomponent
    </div>
@endsection
