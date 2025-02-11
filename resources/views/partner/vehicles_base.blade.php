@extends('layouts.app', ['isprofile' => 1])

@section('title', Lang::get('seo.vehicle_details'))


@section('body_class')
    @parent
    @if( app()->getLocale() == 'ka')
        language_ge
    @endif
@stop

@push('styles')
    <link href="{{ URL::asset('css/smoothness/jquery-ui-1.10.0.custom.css') }}" rel="stylesheet">
    <link href="{{ URL::asset('css/datatables.css') }}" rel="stylesheet">
    <link href="{{ URL::asset('css/tables.css') }}" rel="stylesheet">
@endpush

@push('scripts')
    <script src="{{ URL::asset('js/jquery-ui.js') }}"></script>
    <script src="{{ URL::asset('js/datatables.js') }}"></script>

    <script src="{{ URL::asset('js/moment.js') }}"></script>
    <script src="{{ URL::asset('js/moment-with-locales.js') }}"></script>
@endpush

@section('title1', Lang::get('titles.vehicle_details'))
@section('title2', Lang::get('titles.vehicle_details2'))

@section('content')
    <div class="vehicle-details">
        @if(Session::get('alert'))
            <div class="response-persistent {{ Session::get('alert') }}">{{ Session::get('text') }}</div>
        @endif
        <div class="span-bold-ge">{{ Lang::get('misc.total_vehicles') }}: <span
                class="eng-bold red size20">{{ $vehicleCount ?? 0 }}</span>
        </div>
        <div class="response"></div>
        @component('components.misc.form')
            @slot('row_inside') @endslot
            @slot('form_id') partner-vehicle-details @endslot
   {{--         @component('components.misc.form-group-col')
                @slot('col') col-md-4 @endslot
                @slot('name') amount @endslot
                @slot('nolabel') @endslot
            @endcomponent
            @component('components.misc.submit-button')
                @slot('col') col-md-3 margin-minus @endslot
                @slot('class') btn-save @endslot
                @slot('nolabel') @endslot
                @slot('form_group') @endslot
                @slot('faicon') fa-floppy-o @endslot
                @slot('anchor') {{ Lang::get('misc.request_amount') }}@endslot
            @endcomponent --}}
        @endcomponent
        <div class="transport-registered-table">
            <table id="vehicleDetailsTable" class="table table-striped table-bordered table-sm" cellspacing="0"
                   width="100%">
                <thead>
                <tr>
                    <th class="th-sm">{{ Lang::get('misc.phone_number') }}</th>
                    <th class="th-sm">{{ Lang::get('misc.vehicle_type') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.number_of_seats') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.route_number') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.milage') }}</th>
                    <th class="th-sm">{{ Lang::get('misc.status') }}</th>
                    <th class="th-sm">{{ Lang::get('misc.speed_limit') }} </th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>

    </div>
@endsection
