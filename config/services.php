<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
        'scopes' => [
            'openid',
            'profile',
            'email',
            // 'https://www.googleapis.com/auth/user.phonenumbers.read', // Request phone number
        ],
    ],

    'oauth' => [
        'client_id' => env('OAUTH_CLIENT_ID'),
        'client_secret' => env('OAUTH_CLIENT_SECRET'),
        'url' => env('OAUTH_URL'),
    ],

    'smsGateway' => [
        'text_lk' => [
            'url' => env('TEXT_LK_URL'),
            'sender_id' => env('TEXT_LK_SENDER_ID'),
            'api_token' => env('TEXT_LK_API_TOKEN'),
        ],
    ],

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => [
            'secret' => env('STRIPE_WEBHOOK_SECRET'),
            'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
        ],
    ],

    'nexmo' => [
        'key' => env('NEXMO_KEY'),
        'secret' => env('NEXMO_SECRET'),
        'sms_from' => 'Zoombus',
    ],

    'google-recaptcha' => [
        'secret' => '6Lcps2cqAAAAAJpNqcSD3vRMvHzBygNoISX6gW3w',
        'site' => '6Lcps2cqAAAAAI9_W2IQJ2wnr6D7DJY67bMsHO67'
    ],

    'google-maps' => [
        'project_id' => 'zoombus-438705',
        'key' => 'AIzaSyCHBELaz3Rdo3GIuRlxaC_jvVens2QSoEk',
        'map_ids' => 'be012d0836c3b5d3'
    ],

    'paypal' => [
        'client' => 'ATDFY67EXkNIzGq23zZMfZuREnS8vuFuY-SYmIZ4Vfj8f3ZwutQ49u16sJReSXpBiQuZn5Kk-iZ68Ft2',
        'secret' => 'EDPpPk4pu9ZBz0MJHR7b1zJCiCXax1vF3nw25pCXlssAKH7_DZg1ahcxz6sRYvgPRdiDcAI4fKaNdRDU',
        'sandbox_client' => 'AaQK6DXJmPwO_ZfAzAB-e0Z4z2Hgg-8zVqF6zBJTtDewwAREmcQHM4Tncg8buDhwQHdiBUp3QidjcDxn',
        'sandbox_secret' => 'EAPRUzPEHm9_U-ypwvfGABNClB0OcrY5agEP7maJA1XsPBsI0IZhJkXyv3YHz7eQupm2j7-BZko3BRpt'
    ],



];
