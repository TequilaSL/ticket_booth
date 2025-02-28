<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;

class LogoutController extends Controller {
    public function __construct() {
        parent::__construct();
        $this->middleware('customer');
    }

    public function __invoke() {
        if (Auth::check()) {
            Auth::logout();
            \Session::flash('popup', 'login');
            $response = array('status' => 1, 'text' => (new Agent)->isMobile() ? route('mobile.login') : url('/'));
        } else {
            $response = array('status' => 0, 'text' => \Lang::get('validation.method_not_allowed'));
        }
        return response()->json($response);
    }
}
