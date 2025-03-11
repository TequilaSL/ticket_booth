<?php

namespace App\Services;

use App\Helpers\LogHelper;
use Illuminate\Support\Facades\Http;
use Exception;

class SMSService
{
    public function sendGenertedPassword($phoneNumber, $message)
    {
        try {
            // LogHelper::info('Attempting to send SMS', [
            //     'phone_number' => $phoneNumber,
            //     'message' => $message
            // ]);

            $queryParams = http_build_query([
                'recipient' => $phoneNumber,
                'sender_id' => config('services.smsGateway.text_lk.sender_id'),
                'message' => $message,
            ]);

            $url = config('services.smsGateway.text_lk.url') . '?' . $queryParams;

            $response = Http::withToken(config('services.smsGateway.text_lk.api_token'))->post($url);

            if ($response->successful()) {
                // LogHelper::info('SMS sent successfully', [
                //     'phone_number' => $phoneNumber,
                //     'response' => $response->body()
                // ]);
                return ['status' => 1, 'text' => \Lang::get('validation.sms_successfully_sent')];
            }
            throw new Exception( $response->body(), $response->status());
        } catch (Exception $e) {
            LogHelper::apiCallError("SMS Service API call Error: ",$e->getCode(), $e->getMessage());
            throw $e;
        }
    }
}
