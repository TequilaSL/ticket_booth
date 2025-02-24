@extends('layouts.app', ['isprofile' => 1])

@section('title', Lang::get('seo.vehicle_details'))


@section('body_class')
@parent
@if(app()->getLocale() == 'ka')
    language_ge
@endif
@stop

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs/build/css/themes/default.min.css"/>
    <link href="{{ URL::asset('css/smoothness/jquery-ui-1.10.0.custom.css') }}" rel="stylesheet">
    <link href="{{ URL::asset('css/datatables.css') }}" rel="stylesheet">
    <link href="{{ URL::asset('css/tables.css') }}" rel="stylesheet">
@endpush

@push('scripts')
<script src="{{ URL::asset('js/alertify.min.js') }}"></script>
    <script src="{{ URL::asset('js/jquery-ui.js') }}"></script>
    <script src="{{ URL::asset('js/datatables.js') }}"></script>

    <script src="{{ URL::asset('js/moment.js') }}"></script>
    <script src="{{ URL::asset('js/moment-with-locales.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key={{ config(key: 'services.google-maps.key') }}&v=weekly&loading=async&map_ids={{ config(key: 'services.google-maps.map_ids') }}" async defer></script>
@endpush

@section('title1', Lang::get('titles.vehicle_details'))
@section('title2', Lang::get('titles.vehicle_details2'))

@section('content')
<div class="vehicle-details">
    @if(Session::get('alert'))
        <div class="response-persistent {{ Session::get('alert') }}">{{ Session::get('text') }}</div>
    @endif
    <!-- <div class="span-bold-ge">{{ Lang::get('misc.total_vehicles') }}: <span
                class="eng-bold red size20">{{ $recordsTotal ?? 0 }}</span>
        </div> -->
    <div class="response"></div>
    @component('components.misc.form')
    @slot('row_inside') @endslot
    @slot('form_id') partner-vehicle-details @endslot
    {{-- @component('components.misc.form-group-col')
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
                    <th class="th-sm">{{ Lang::get('misc.license_plate') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.vehicle_name') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.driver_name') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.number_of_seats') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.route_name') }} </th>
                    <th class="th-sm">{{ Lang::get('misc.status') }}</th>
                    <th class="th-sm">Action</th> <!-- ✅ New Column for Button -->
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

    <div id="speedLimitPopup" class="popup" style="display: none;">
        <h3>Set Speed Limit</h3>
        <input type="number" id="speedLimitInput" placeholder="Enter speed limit" />
        <button id="saveSpeedLimit">Save</button>
        <button id="closeSpeedLimitPopup">Close</button>
    </div>

    <div class="vehicle-scheme-partner" id="mileageSection" style="display: none;">
        <h3>Mileage Information</h3>
        <p>Details about the vehicle's mileage will be shown here.</p>
    </div>

    <div class="vehicle-scheme-partner" id="liveTrackingSection" style="display: none;">
        <button type="button" class="close" id="closeLiveTracking" aria-label="Close">X</button>
        <h3>Live Tracking</h3>
        <div class="vehicle-details-section">Live Tracking</div>
        <div id="map" style="width: 100%; height: 400px;"></div>
    </div>

</div>
@endsection
