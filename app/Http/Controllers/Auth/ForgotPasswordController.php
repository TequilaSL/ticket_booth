<?php

namespace App\Http\Controllers\Auth;

use App\ForgotPassword;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ValidationController;
use App\Notifications\ForgotPasswordSend;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Jenssegers\Agent\Agent;
use Mcamara\LaravelLocalization\LaravelLocalization;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ForgotPasswordController extends ValidationController
{
    public function __construct(){
        parent::__construct();
        if(!(new Agent())->isMobile()) {
            $this->middleware('guest');
        }
    }

    protected function validator(array $data)
    {
        $fields = [
            'phone_number' => 'required|phone:AUTO|exists:users|unique:forgot_passwords',
        ];
        return Validator::make($data, $fields);
    }


    public function action(Request $request) {
        $data = $request->only('phone_number');
        $response = ValidationController::response($this->validator($data), \Lang::get('validation.sms_successfully_sent'));
        if($response->original['status'] == 1) {
            $newPass = rand(100000, 999999);
            $user = User::wherePhoneNumber($data['phone_number'])->first();
            $cur = $user->locale;
            User::wherePhoneNumber($data['phone_number'])->whereIn('status', [1,2])->update(['status' => 1, 'password' => \Hash::make($newPass)]);
            // sending email instead of sms
            // $user->notify(
            //     new ForgotPasswordSend($cur, $newPass)
            // );
            try {
                $this->sendSMSForForgotPassword($data['phone_number'], $newPass);
                ForgotPassword::create(['phone_number' => $data['phone_number']]);
            } catch (\Throwable $th) {
                \Log::error('SMS Sending Failed: ' . $th->getMessage());
                return response()->json([
                    'status' => 0,
                    'text' => 'Failed to send SMS. Please try again later.'
                ], 500);
            }
        }
        return response()->json($response->original);
    }

    private function sendSMSForForgotPassword($phoneNumber, $newPass) {
        $data = [
            'phone_number' => [$phoneNumber],
            'body' => \Lang::get('notifications.forgot_password', ['password' => $newPass])
        ];

        $contact = $data['phone_number'][0];
        $queryParams = http_build_query([
            'recipient' => $contact,
            'sender_id' => env('TEXT_LK_SENDER_ID'),
            'message' => $data['body'],
        ]);

        $url = env('TEXT_LK_URL') . '?' . $queryParams;
        return Http::withToken(env('TEXT_LK_API_TOKEN'))
        ->post($url);
    }

    public function view() {
        $data = Controller::essentialVars();
        if(!(new Agent())->isMobile()) {
            return view('forgot-password', $data);
        }
        else {
            $data['title'] = \Lang::get('titles.forgot');
            return view('mobile.forgot', $data);
        }
    }

}
