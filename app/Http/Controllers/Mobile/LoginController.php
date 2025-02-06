<?php
namespace App\Http\Controllers\Mobile;


use App\Http\Controllers\Controller;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller {
    public function __construct() {
        parent::__construct();
    }

    public function view() {
        $agent = new Agent();
        $data['title'] = \Lang::get('titles.login');
        // if($agent->isMobile()) {
            return view('mobile.login', $data);
        // }
        // else {
            // abort(404);
        // }
    }

    public function checkToken(Request $request)
    {
        if ($request->session()->has('_token')) {
            $user = Auth::user();
            $token = $request->session()->get('_token');
            $number = $request->session()->get('number');
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => $user,
                'number'=>$number,
                'message' => 'Token found in session.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No token found in session.'
        ]);
    }

}
