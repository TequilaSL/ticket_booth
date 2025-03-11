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
use App\Services\SMSService;
use App\Helpers\LogHelper;

class ForgotPasswordController extends ValidationController
{
    protected $smsService;

    public function __construct(SMSService $smsService){
        parent::__construct();
        $this->smsService = $smsService;
        if(!(new Agent())->isMobile()) {
            $this->middleware('guest');
        }
    }

    public function sendGenertedPassword($phoneNumber, $newPass)
    {
        return $this->smsService->sendGenertedPassword($phoneNumber, $newPass);
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
            $user = User::wherePhoneNumber($data['phone_number'])->first();
            // $cur = $user->locale;
            // sending email instead of sms
            // $user->notify(
                //     new ForgotPasswordSend($cur, $newPass)
                // );
                try {
                    $newPass = rand(100000, 999999);
                    $smsGeneration = $this->sendGenertedPassword($data['phone_number'], 'Your new password is: '.$newPass);

                    User::wherePhoneNumber($data['phone_number'])->whereIn('status', [1,2])->update(['status' => 1, 'password' => \Hash::make($newPass)]);


                    $response->original['text'] = $smsGeneration['text'];
                    $statusCode = 200;
                    return redirect()->route('/login')->with('success', \Lang::get('validation.sms_successfully_sent'));
                    // ForgotPassword::create(['phone_number' => $data['phone_number']]);
            } catch (\Throwable $th) {
                LogHelper::error('SMS Sending Failed: ' . $th->getMessage());
                return response()->json([
                    'status' => 0,
                    'text' => 'Failed to send SMS. Please try again later.'
                ], 500);
            }
        } else {
            $statusCode = 422;
        }
        return response()->json($response->original, $statusCode);
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
