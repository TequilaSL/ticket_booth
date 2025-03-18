<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Services\EmailService;
use App\Helpers\LogHelper;
use Illuminate\Support\Facades\Lang;

class EmailVerificationController extends Controller
{
    protected $validTokens = [];

    public function sendVerificationEmail(Request $request, EmailService $mailService)
    {
        $data = $request->only('email');
        $validator = Validator::make($data, ['email' => 'required|email|unique:users']);
        $errors = $validator->errors();
        if ($validator->fails()) {
            $response = array('status' => 0, 'text' => $errors->first());
        } else {
            try {
                $email = $request->email;
                $token = sha1(time());
                session()->put("verification_token_email", $token);
                $verificationLink = route('email_verify', ['email' => $email, 'token' => $token]);

                $mailService->sendEmail(
                    $email,
                    'Verify Your Email Address',
                    'email.verify-email',
                    ['verificationLink' => $verificationLink]
                );

                $response = ['status' => 1, 'text' => Lang::get('validation.if_email_correct_for_confirmation')
                ];
            } catch (\Exception $e) {
                LogHelper::apiCallError('Error sending verification email', $e->getCode(), $e->getMessage());
                $response = ['status' => 0, 'text' => Lang::get('validation.verification_email_send_fail')];
            }
        }
        return response()->json($response);
    }

    public function verifyEmail($email, $token)
    {
        $storedToken = session("verification_token_email");
        if ($storedToken && $storedToken === $token) {
            session()->forget("verification_token_email");
            return redirect()->route('index',['verified_email' => $email]);
        }
        return redirect()->route('index',['verified_email' => 'error']);
    }
}
