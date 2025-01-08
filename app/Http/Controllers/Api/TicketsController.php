<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Sales;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Mcamara\LaravelLocalization\LaravelLocalization;

class TicketsController extends Controller
{

    public function listTickets(Request $request) {
        if ($request->lang) {
            (new LaravelLocalization())->setLocale($request->lang);
        }
        $data = [];
        $salesQ = Sales::current($request->user()->id)->status([1,3]);
        if($salesQ->exists()) {
            $sales = $salesQ->with(['routes','routes.citiesFrom.translated','routes.citiesTo.translated'])->skip($request->skip)->take(10)->orderBy('created_at', 'DESC')->get()->toArray();
            $data['total'] = Sales::current($request->user()->id)->statusNot(2)->count();
            $index=0;
            foreach ($sales as $key => $sale) {
               if(count($data) != 1){
                $isDuplicate = false;

                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        if ($item['ticket_number'] === $sale['ticket_number']) {
                            $isDuplicate = true;
                            break;
                        }
                    }
                }

                if (!$isDuplicate) {
                    $index++;
                    $data['items'][$key] = $sale;
                    $data['items'][$key]['departure_date'] = Carbon::parse($sale['routes']['departure_date'])->translatedFormat('j M Y');
                    $data['items'][$key]['from'] = $sale['routes']['cities_from']['translated']['name'];
                    $data['items'][$key]['to'] = $sale['routes']['cities_to']['translated']['name'];
                } else {
                    $price = $data['items'][$index-1]['price'];
                    $price += $sale['price'];
                    $data['items'][$index-1]['price'] = $price;
                }
               }else{
                    $index++;
                    $data['items'][$key] = $sale;
                    $data['items'][$key]['departure_date'] = Carbon::parse($sale['routes']['departure_date'])->translatedFormat('j M Y');
                    $data['items'][$key]['from'] = $sale['routes']['cities_from']['translated']['name'];
                    $data['items'][$key]['to'] = $sale['routes']['cities_to']['translated']['name'];
               }
            }
        }
        return response()->json($data);
    }

    public function single(Request $request) {
        if ($request->lang) {
            (new LaravelLocalization())->setLocale($request->lang);
        }
        $q = Sales::current($request->user()->id)->with(
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
            'routes.currency',
            'routes.addressTo.translated',
            'users:id,name',
            'currency:id,key as currency_key'
        )->status([1,3])->where('ticket_number', $request->id)->first();

        $allIdMatchData = Sales::current($request->user()->id)->with('routes')->status([1,3])->where('ticket_number', $request->id)->get();
        $totalPrice = 0;
        $seatNumbers = [];

        foreach ($allIdMatchData as $data) {
            $totalPrice += $data->price;
            $seatNumbers[] = $data->seat_number;
        }
        $seatNumbersString = implode(', ', $seatNumbers);

        if($q) {
            $query = $q->toArray();
            $response = [
                'id' => $q['id'],
                'status' => 1,
                'sale_status' => $q['status'],
                'image' => Storage::url('tickets/'.md5($query['ticket_number']).'.png'),
                'ticket_number' => $query['ticket_number'],
                'route_number' => $query['routes']['cities_from']['city_code'].$query['routes']['id'],
                'passenger' => $query['users']['name'],
                'price' => $totalPrice,
                'price_currency' => $query['routes']['currency']['key'],
                'from' => $query['routes']['cities_from']['translated']['name'],
                'to' => $query['routes']['cities_to']['translated']['name'],
                'seat_number' => $seatNumbersString,
                'departure_date' => Carbon::parse($query['routes']['departure_date'])->locale($request->lang)->translatedFormat('j\ M Y'),
                'departure_time' => $query['routes']['departure_time'],
                'arrival_time' => $query['routes']['arrival_time'],
                'countdownTimestamp' => Carbon::parse($query['routes']['departure_date'] . ' ' . $query['routes']['departure_time'])->getTimestamp() - Carbon::now()->getTimestamp()
            ];

            return response()->json($response, 200);
        }
        else {
            return response()->json([], 422);
        }
    }

    public function singleSecure(Request $request) {
        if ($request->lang) {
            (new LaravelLocalization())->setLocale($request->lang);
        }
        $q = Sales::current($request->user()->id)->with(
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
            'routes.currency',
            'routes.addressTo.translated',
            'users:id,name',
            'currency:id,key as currency_key'
        )->status([1,3])->whereRaw('md5(ticket_number) = ?', $request->id)->first();
        if($q) {
            $query = $q->toArray();
            $response = [
                'id' => $q['id'],
                'status' => 1,
                'sale_status' => $q['status'],
                'image' => Storage::url('tickets/'.md5($query['ticket_number']).'.png'),
                'ticket_number' => $query['ticket_number'],
                'passenger' => $query['users']['name'],
                'route_number' => $query['routes']['cities_from']['city_code'].$query['routes']['id'],
                'price' => $query['price'],
                'price_currency' => $query['routes']['currency']['key'],
                'from' => $query['routes']['cities_from']['translated']['name'],
                'to' => $query['routes']['cities_to']['translated']['name'],
                'seat_number' => $query['seat_number'],
                'departure_date' => Carbon::parse($query['routes']['departure_date'])->locale($request->lang)->translatedFormat('j\ M Y'),
                'departure_time' => $query['routes']['departure_time'],
                'arrival_time' => $query['routes']['arrival_time'],
                'countdownTimestamp' => Carbon::parse($query['routes']['departure_date'] . ' ' . $query['routes']['departure_time'])->getTimestamp() - Carbon::now()->getTimestamp()
            ];

            return response()->json($response, 200);
        }
        else {
            return response()->json([], 422);
        }
    }

}
