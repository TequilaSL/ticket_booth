<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BookingController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ValidationController;
use App\Sales;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Jenssegers\Agent\Agent;
use Lang;
use Mcamara\LaravelLocalization\LaravelLocalization;
use Validator;

class TicketsController extends ValidationController
{
    public function __construct()
    {
        parent::__construct();
        $agent = new Agent();
        if (!$agent->isMobile()) {
            $this->middleware('customer')->except('secureView');
            $this->middleware('can_view_ticket')->only('view');
            $this->middleware('can_view_secure_ticket')->only('secureView');
            $this->middleware('new_user')->only('storePasswordAndVerify');
        }

    }

    public function viewAll()
    {
        $agent = new Agent();
        if (!$agent->isMobile()) {
            $data = Controller::essentialVars();
            return view('profile.bought-tickets', $data);
        }
        else {
            if (config('app.locale') != 'en') {
                Cache::store('file')->put('locale', config('app.locale'));
                return redirect()->to((new LaravelLocalization())->getNonLocalizedURL(route('bought_tickets')));
            }
            if (Cache::store('file')->has('locale')) {
                $data['locale'] = Cache::store('file')->pull('locale');
            }
            $data['title'] = \Lang::get('titles.ticket_list');
            return view('mobile.main', $data);
        }
    }

    public function view($id)
    {
        $agent = new Agent();
        if (!$agent->isMobile()) {
            $data = Controller::essentialVars();
            $data['tickets'] = Sales::current()->with(
                'routes',
                'routes.vehicles',
                'routes.vehicles.manufacturers:id,name as manufacturer_name',
                'routes.citiesFrom:id,code as city_code,extension',
                'routes.citiesFrom.translated',
                'routes.citiesTo',
                'routes.citiesTo.translated',
                'routes.addressFrom',
                'routes.addressFrom.translated',
                'routes.addressTo',
                'routes.addressTo.translated',
                'users:id,name',
                'currency:id,key as currency_key'
            )->status([1, 3])->where('ticket_number', $id)->get()->toArray();

            $tickets = $data['tickets'];
            if (!empty($tickets)) {
                $tickets[0]['seat_number'] = implode(', ', array_column($tickets, 'seat_number'));
            }

            $data['tickets'] = $tickets[0] ?? [];
            $request = new Request();
            $request->id = $data['tickets']['id'];
            $checkRefundAmount = app(BookingController::class)->checkRefundAmount($request);
            $data['deleteAlertify'] = [
                'confirm-msg' => $checkRefundAmount->original['text'],
                'success-msg' => Lang::get('alerts.success_ticket_cancel'),
                'error-msg' => Lang::get('alerts.error_ticket_cancel'),
                'ok' => Lang::get('alerts.ok_route_sale_refund'),
                'title' => Lang::get('alerts.title_ticket_cancel'),
                'cancel' => Lang::get('alerts.cancel_route_sale_refund'),
                'id' => $data['tickets']['id']
            ];
            return view('profile.single-ticket', $data);
        }
        else {
            $data['title'] = \Lang::get('titles.your_ticket');
            return view('mobile.main', $data);
        }
    }


    protected function validator($data)
    {
        $fields = [
            'password' => 'required|string|confirmed|min:5'
        ];
        return Validator::make($data, $fields);
    }

    public function storePasswordAndVerify(Request $request)
    {
        $data = $request->only(['password', 'password_confirmation']);
        $response = ValidationController::response($this->validator($data), Lang::get('validation.password_updated'));
        if ($response->original['status'] == 1) {
            $pass['password'] = Hash::make($data['password']);
            $pass['status'] = 1;
            $pc = new ProfileController();
            $pc->store($pass);
        }
        return response()->json($response->original);
    }

    public function secureView($id)
    {
        $agent = new Agent();
        $data = Controller::essentialVars();
        $data['tickets'] = Sales::with(
            'routes',
            'routes.vehicles',
            'routes.vehicles.manufacturers:id,name as manufacturer_name',
            'routes.citiesFrom:id,code as city_code,extension',
            'routes.citiesFrom.translated',
            'routes.citiesTo',
            'routes.citiesTo.translated',
            'routes.addressFrom:id',
            'routes.addressFrom.translated',
            'routes.addressTo:id',
            'routes.addressTo.translated',
            'users',
            'currency:id,key as currency_key'
        )->status([1, 3])->whereRaw('md5(ticket_number) = ?', [$id])->first()->toArray();
        if ($agent->isMobile()) {
            $http = new Client;
            if (config('app.locale') != 'en') {
                Cache::store('file')->put('locale', config('app.locale'));
                return redirect()->to((new LaravelLocalization())->getNonLocalizedURL(route('secure_ticket', ['id' => $id])));
            }

            $response = $http->post(config('services.oauth.url'), [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => config('services.oauth.client_id'),
                    'client_secret' => config('services.oauth.client_secret'),
                    'username' => $data['tickets']['users']['phone_number'],
                    'password' => $data['tickets']['users']['password']
                ]
            ]);

            if (Cache::store('file')->has('locale')) {
                $data['locale'] = Cache::store('file')->pull('locale');
            }

            $data['response'] = (string)$response->getBody();
            $data['title'] = \Lang::get('titles.your_ticket');
            return view('mobile.main', $data);
        }
        else {
            if ($data['tickets']['users']['status'] == 2 && !Auth::check()) {
                Auth::loginUsingId($data['tickets']['users']['id']);
                $data['password_form'] = view('components.password-form')->render();
            }
            $request = new Request();
            $request->id = $data['tickets']['id'];
            $checkRefundAmount = app(BookingController::class)->checkRefundAmount($request);
            $data['deleteAlertify'] = [
                'confirm-msg' => $checkRefundAmount->original['text'],
                'success-msg' => Lang::get('alerts.success_ticket_cancel'),
                'error-msg' => Lang::get('alerts.error_ticket_cancel'),
                'ok' => Lang::get('alerts.ok_route_sale_refund'),
                'title' => Lang::get('alerts.title_ticket_cancel'),
                'cancel' => Lang::get('alerts.cancel_route_sale_refund'),
                'id' => $data['tickets']['id']
            ];
            return view('profile.single-ticket', $data);
        }
    }


    public function allTicketData()
    {
        $tickets = Sales::current()->with(
            'routes:id,departure_date,departure_time,arrival_time,from,to,from_address,to_address,vehicle_id',
            'routes.vehicles:id,manufacturer,model,license_plate,type',
            'routes.vehicles.routeTypes:id',
            'routes.vehicles.routeTypes.translated',
            'routes.vehicles.manufacturers:id,name as manufacturer_name',
            'routes.citiesFrom:id,code as city_code,extension',
            'routes.citiesFrom.translated',
            'routes.citiesTo',
            'routes.citiesTo.translated',
            'routes.addressFrom:id',
            'routes.addressFrom.translated',
            'routes.addressTo:id',
            'routes.addressTo.translated',
            'currency:id,key as currency_key'
        )->status([1, 3])->get()->toArray();


        $data = [];
        $transaction_data = [];

        foreach ($tickets as $key => $val) {
            $transaction_id = $val['transaction_id'];
            $price = floatval($val['price']);

            if (!isset($transaction_data[$transaction_id])) {
                $transaction_data[$transaction_id] = [
                    'departure_date' => Carbon::parse($val['routes']['departure_date'])->format('Y-m-d'),
                    'route_type' => $val['routes']['vehicles']['route_types']['translated']['name'],
                    'route_id' => $val['routes']['cities_from']['city_code'] . $val['route_id'],
                    'the_route' => $val['routes']['cities_from']['translated']['name'] . ' ' . view('components.font-awesome', ['icon' => 'fa-arrow-right'])->render() . ' ' . $val['routes']['cities_to']['translated']['name'],
                    'the_transport' => $val['routes']['vehicles']['manufacturers']['manufacturer_name'] . ' ' . $val['routes']['vehicles']['model'] . ' / ' . $val['routes']['vehicles']['license_plate'],
                    'seat' => $val['seat_number'],
                    'price' => $price,
                    'currency_key' => $val['currency']['currency_key'],
                    'ticket' => view('components.a', ['class' => 'blue', 'href' => route('single_ticket', ['id' => $val['ticket_number']]), 'anchor' => Lang::get('misc.view_ticket')])->render(),
                    'status' => StatusController::fetch($val['status'], '', [], [1 => ['label' => 'warning', 'text' => Lang::get('misc.bought')], 3 => ['icon' => 'fa-check', 'label' => 'success', 'text' => Lang::get('misc.approved')]])
                ];
            } else {
                $transaction_data[$transaction_id]['price'] += $price;
                $transaction_data[$transaction_id]['seat'] .= ', ' . $val['seat_number'];
            }
        }
        foreach ($transaction_data as $record) {
            $data[] = array_merge($record, [
                'price' => $record['price'] . $record['currency_key']
            ]);
        }

        return datatables()->of($data ?? [])->rawColumns(['the_route', 'the_transport', 'status', 'ticket'])->toJson();
    }

}
