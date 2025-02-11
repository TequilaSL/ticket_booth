<?php

namespace App\Http\Controllers\Partners;

use App\Financial;
use App\Payouts;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PayoutController;
use Jenssegers\Agent\Agent;

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
}
