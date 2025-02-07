<?php

namespace App\Http\Controllers\Auth;

use App\Driver;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;
use PhpParser\Node\Stmt\TryCatch;

class LoginController extends Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->middleware('guest')->except('current_locale');
    }

    public function current_locale() {
        return Controller::essentialVars(['current_country_code'])['current_country_code'];
    }

    public function __invoke(Request $request) {
        $credentials = $request->only('phone_number', 'password');
        $googleId = $request->input('google-id');
        if(isset($credentials['phone_number']) && isset($credentials['password'])) {
            Session::put('number', $request->password);
            $credentials['status'] = [1,2];
            if (!Auth::attempt($credentials)) {
                $user = User::where('phone_number', $request->phone_number)->first();
                if ($user && \Hash::check($request->password, $user->password) && !in_array($user->status, [1,2])) {
                    $response = array('status' => 0, 'text' => \Lang::get('validation.unverified'));
                }
                else {
                    $response = array('status' => 0, 'text' => \Lang::get('validation.failed_login'));
                }
            }
            else {
                if(session()->has('url.intended')) {
                    $response = array('status' => 1, 'text' => redirect()->intended('/')->getTargetUrl());
                }
                else if (Driver::current()->notActive()->where('step', '<=', 4)->exists()) {
                    $response = ['status' => 1, 'text' => route('driver_wizard')];
                }
                else {
                    $response = array('status' => 3);
                }
                if ($googleId) {
                    User::where('phone_number', $request->phone_number)
                        ->update(['google_id' => $googleId]);
                }
            }
        }
        else {
            $response = array('status' => 0, 'text' => \Lang::get('validation.fill_phone_and_password_field'));
        }
        return response()->json($response);
    }


    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }


    public function googleLogin(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $accessToken = $googleUser->token;

            $user = User::where('email', $googleUser->getEmail())->first();
            Log::info('01', );

            if ($user) {
                Log::info('02', );
                if ($user->google_id && $user->password) {
                    Log::info('0--01', );
                    if ($user->google_id === $googleUser->getId()) {
                        Log::info('0--02', );
                        Auth::login($user);
                        $response = array('status'=> 1, 'user'=> $user);
                        $jsonUserData = json_encode($response);
                        Log::info('0--0--1', [$jsonUserData]);
                        return response("<script>
                        window.opener.handleGoogleLogin($jsonUserData);
                        window.close();
                        </script>");
                    }
                } elseif (!$user->google_id && $user->password){
                    Log::info('0--03', );
                    Log::info('03', );
                    $response = array('text' => 'You have signed up already! Please sign in.', 'googleId'=> $googleUser->getId(), 'phone_number'=> $user->phone_number);
                    $jsonData = json_encode($response);
                    return response("<script>
                        window.opener.redirectGoogleLoginToNormal($jsonData);
                        window.close();
                        </script>");
                }
            }
            Log::info('04', );
            session()->put("user_details", ['name'=> $googleUser->getName(),'email'=> $googleUser->getEmail(),'google_id'=> $googleUser->getId(), 'avatar'=> $googleUser->getAvatar()]);
            return "<script>
                window.close();
                window.opener.postMessage({ action: 'open_mobile_verification' }, '*');
                </script>";
        } catch (\Throwable $th) {
            return "<script>alert('Login failed! Please try again.'); window.close();</script>";
        }
    }
}
