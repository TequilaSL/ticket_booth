<?php

namespace App\Http\Controllers\Api;

use App\ForgotPassword;
use App\Http\Controllers\Auth\ForgotPasswordController as FPC;
use App\Http\Controllers\ValidationController;
use App\Notifications\ForgotPasswordSend;
use App\User;
use App\Helpers\LogHelper;
use App\Services\SMSService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Mcamara\LaravelLocalization\LaravelLocalization;

class ForgotPasswordController extends FPC {

    public function __construct(SMSService $smsService)
    {
        parent::__construct($smsService); // Calls the parent's constructor
    }


    public function request(Request $request) {
        if ($request->lang) {
            (new LaravelLocalization())->setLocale($request->lang);
        }

        $data = $request->only('phone_number');
        $response = ValidationController::response($this->validator($data), \Lang::get('validation.sms_successfully_sent'));

        if ($response->original['status'] == 1) {
            $user = User::wherePhoneNumber($data['phone_number'])->first();

            // LogHelper::info('User Found', [$user]);

            try {
                $newPass = rand(100000, 999999);
                $smsGeneration = $this->sendSMS($data['phone_number'], \Lang::get('validation.new_password_is').$newPass);

                User::wherePhoneNumber($data['phone_number'])->whereIn('status', [1,2])
                ->first()->update(['status' => 1, 'password' => \Hash::make($newPass)]);

                $response->original['text'] = $smsGeneration['text'];
                $statusCode = 200;
            } catch (\Throwable $th) {
                LogHelper::error('SMS Sending Failed: ' . $th->getMessage());
                return response()->json([
                    'status' => 0,
                    'text' => \Lang::get('validation.sms_send_fail')
                ], 500);
            }
        } else {
            $statusCode = 422;
        }
        return response()->json($response->original, $statusCode);
    }
}
