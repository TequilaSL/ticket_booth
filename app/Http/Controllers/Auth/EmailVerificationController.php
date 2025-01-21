<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class EmailVerificationController extends Controller
{
    protected $validTokens = [];
    public function showEmailForm()
    {
        return view('auth.verify-email');
    }

    public function sendVerificationEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $email = $request->email;
        $token = sha1(time());
        session()->put("verification_token_email", $token);
        $verificationLink = route('email_verify', ['email' => $email, 'token' => $token]);

        Mail::raw("Click the link to verify your email: $verificationLink", function ($message) use ($email) {
            $message->to($email)
                ->subject('Verify Your Email Address')
                ->from('nipuna315np@gmail.com', 'Your Application Name');
        });
        return back()->with('message', 'Verification email sent! Please check your inbox.');
    }

    public function verifyEmail($email, $token)
    {
        $storedToken = session("verification_token_email");
        if ($storedToken && $storedToken === $token) {
            session()->forget("verification_token_email");
            return redirect()->route('index',['verified_email' => $email]);
        }
        return redirect()->route('show.email.form')->withErrors(['email' => 'Invalid or expired verification link.']);
    }
}
