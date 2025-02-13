<?php

namespace App\Http\Controllers\Partners;

use App\Financial;
use App\Payouts;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Jenssegers\Agent\Agent;
use App\Vehicle;
use App\AffiliateCodes;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\StatusController;
use Illuminate\Support\Facades\Auth;

class VehiclesController extends Controller
{
    public function __construct() {
        parent::__construct();
        $agent = new Agent();
        if(!$agent->isMobile()) {
            $this->middleware('customer');
            $this->middleware('partner_active');
        }
    }

    public function view() {
        $data = Controller::essentialVars();
        $data['vehicles'] = \Auth::user()->balance - Payouts::whereStatus(2)->current()->sum('amount');
        return view('partner.vehicles_base', $data);
    }

    public function allVehicleData(Request $request)
    {
        $user = Auth::user();
        $partnerId =  $user->id;
        $driverIds = AffiliateCodes::where('user_id', $partnerId)
            ->where('user_used', '!=', $partnerId)
            ->pluck('user_used')->toArray();
        if (empty($driverIds)) {
            return datatables()->of([])
            ->with('message', 'There are no vehicles added, please register some vehicles!')
            ->toJson();
        }

        $vehs = Vehicle::whereIn('vehicles.user_id', $driverIds)
            ->join('users', 'vehicles.user_id', '=', 'users.id')
            ->join('routes', function($join) use ($driverIds) {
                $join->on('vehicles.id', '=', 'routes.vehicle_id')
                 ->whereIn('routes.user_id', $driverIds);
            })
            ->join('manufacturers', 'vehicles.manufacturer', '=', 'manufacturers.id')
            ->select(
                'vehicles.id as id',
                'vehicles.user_id',
                DB::raw('MAX(routes.type) as route_name'),
                DB::raw("CONCAT(manufacturers.name, ' ', vehicles.model) as vehicle_name"),
                'vehicles.license_plate',
                'vehicles.number_of_seats',
                'vehicles.status',
                'users.phone_number',
                'users.name as driver_name',
            )
            ->groupBy('id')
            ->get()
            ->toArray();

        if (empty($vehs)) {
            return datatables()->of([])
                ->with('message', 'There are no vehicles added, please register some vehicles!')
                ->toJson();
        }

        $data = collect($vehs)->map(function ($v) {
            $dropdown = '
            <div class="vehicle-details-dropdown account dropdown">
                <a class="vehicle-details-anchor dropdown-toggle" href="#" role="button" id="dropdownActions' . $v['id'] . '"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Actions
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownActions' . $v['id'] . '">
                    <a class="dropdown-item change-speed-limit" href="javascript:void(0)" data-id="' . $v['id'] . '">Speed Limit</a>
                    <a class="dropdown-item view-mileage" href="javascript:void(0)" data-id="' . $v['id'] . '">Mileage</a>
                    <a class="dropdown-item live-tracking" href="javascript:void(0)" data-id="' . $v['id'] . '">Live Tracking</a>
                </div>
            </div>';

            $v['actions'] = $dropdown;
            return $v;
        });


        return datatables()->of($data ?? [])->rawColumns(['status', 'actions'])->toJson();
        // return DataTables::of($vehicles)
        // ->addColumn('actions', function ($vehicle) {
        //     return '<button class="btn btn-primary action-btn" data-id="'.$vehicle->id.'">Action</button>';
        // })
        // ->rawColumns(['actions']) // Allow HTML for the actions column
        // ->make(true);
    }
}
