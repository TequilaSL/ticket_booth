<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as ImageDriver;
use Exception;
use App\Services\SMSService;
use Illuminate\Support\Facades\Lang;


class MobileVerificationController extends Controller
{
    protected $validTokens = [];
    protected $smsService;

    public function __construct(SMSService $smsService){
        parent::__construct();
        $this->smsService = $smsService;
    }

    public function sendVerificationMessage(Request $request)
    {
        try {
            $requestdata = $request->only('phone_number', 'password', 'password_confirmation');
            $validator = Validator::make($requestdata, ['phone_number' => 'required|phone:AUTO|unique:users', 'password' => 'required|min:8|confirmed']);
            if ($validator-> fails()) {
                return response()->json(['status' => 0, 'text' => $validator->errors()->first()]);
            }

            $otp = strval(rand(1000, 9999));
            $requestdata['otp'] = $otp;
            $requestdata['body'] = 'This is your OTP: '. $otp;
            Log::info('session data 1 ',[session("user_details")]);

            session()->put("user_details", array_merge(session("user_details", []), [
                'phone_number'=> $requestdata['phone_number'],
                'password'=> Hash::make($requestdata['password']),
                'otp'=>$otp
            ]));
            Log::info('session data 1 ',[session("user_details")]);

            $smsResponse = $this->sendSMS($requestdata['phone_number'],$requestdata['body']);

            // if (!$smsResponse['success']) {
            //     return response()->json(['status' => 2, 'text' => 'OTP sending failed! Please try again.']);
            // }

            return response()->json(['status' => 1, 'text' => \Lang::get('validation.if_mobile_correct_for_otp')]);
        } catch (\Throwable $th) {
            Log::error("Error in sendVerificationMessage: " . $th->getMessage());
            return response()->json(['status' => 3, 'text' => 'Something went wrong!']);
        }
    }

    public function sendSMS($phoneNumber, $message)
    {
        return $this->smsService->sendSMS($phoneNumber, $message);

    }

    protected function uploadGoogleAvatar($avatarUrl, $userId){
        if (!$avatarUrl) {
            return false;
        }

        try {
            $imageMake = new ImageManager(new ImageDriver());

            $response = Http::get($avatarUrl);
            if (!$response->successful()) {
                return false;
            }

            $imageData = $imageMake->read($response->body());
            $imageData->orient();

            $extension = 'jpg';

            $image_original = clone $imageData;
            $image_original->resize(200, 200);
            Storage::disk('s3')->put("users/{$userId}.{$extension}", $image_original->encode());

            $image_resize = clone $imageData;
            $image_resize->resize(30, 30);
            Storage::disk('s3')->put("users/small/{$userId}.{$extension}", $image_resize->encode());

            User::whereId($userId)->update(['extension' => $extension]);

            return true;
        } catch (Exception $e) {
            Log::error("Google Avatar Upload Failed: " . $e->getMessage());
            return false;
        }
    }

    public function verifyMobile(Request $request)
    {
        try {
            $data = $request->only('phone_number', 'otp_code');
            $storedData = session("user_details");

            if (!$storedData) {
                return response()->json(['status' => 2, 'text' => 'Session expired or invalid request!']);
            }

            if ($storedData['phone_number'] !== $data['phone_number'] || $storedData['otp'] !== $data['otp_code']) {
                Log::info('OTP verification failed', ['input' => $data, 'stored' => $storedData]);
                return response()->json(['status' => 2, 'text' => \Lang::get('validation.invalid_otp_or_mobile')]);
            }

            $user = User::where('email', $storedData['email'] ?? null)->first();
            if ($user) {
                return response()->json(['status' => 3, 'text' => \Lang::get('validation.duplicate_email')]);
            }

            // Log::info('avater ',[$storedData['avatar']]);
            $user = User::create([
                'name' => $storedData['name'] ?? 'User',
                'email' => $storedData['email'] ?? null,
                'google_id' => $storedData['google_id'] ?? null,
                'phone_number' => $storedData['phone_number'],
                'password' => $storedData['password'],
                'country_id' => "1"
            ]);
            Log::info('avater ',[$user]);

            if (!empty($storedData['avatar']) && isset($user) && isset($user->id)) {
                $this->uploadGoogleAvatar($storedData['avatar'], $user->id);
            }

            session()->forget("user_details");
            Auth::login($user);
            $smsResponse = $this->sendSMS($storedData['phone_number'],Lang::get('email_templates.user_success_registration_email_body'));

            return response()->json(['status' => 1, 'text' => 'User registered successfully!']);
        } catch (\Throwable $th) {
            Log::error("Error in verifyMobile: " . $th->getMessage());
            return response()->json(['status' => 3, 'text' => 'Something went wrong! Please try again later.']);
        }
    }
}
