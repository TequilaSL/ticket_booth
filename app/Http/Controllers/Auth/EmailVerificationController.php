<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailVerificationController extends Controller
{
    protected $validTokens = [];

    public function sendVerificationEmail(Request $request)
    {
        $data = $request->only('email');
        $validator = Validator::make($data, ['email' => 'required|email|unique:users']);
        $errors = $validator->errors();
        if ($validator->fails()) {
            $response = array('status' => 0, 'text' => $errors->first());
        } else {
            $email = $request->email;
            $token = sha1(time());
            session()->put("verification_token_email", $token);
            $verificationLink = route('email_verify', ['email' => $email, 'token' => $token]);

            Mail::send('email.verify-email', ['verificationLink' => $verificationLink], function ($message) use ($email) {
                $message->to($email)
                    ->subject('Verify Your Email Address')
                    ->from('nipuna315np@gmail.com', 'Your Application Name');
            });

            $response = array('status' => 1, 'text' => 'If the entered email is correct, you will receive a confirmation mail with a link. Please click that link to verify the email.');
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
