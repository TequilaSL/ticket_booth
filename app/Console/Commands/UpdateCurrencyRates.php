<?php

namespace App\Console\Commands;
use App\Currency;
use App\Helpers\LogHelper;
use Illuminate\Support\Facades\Http;

use Illuminate\Console\Command;

class UpdateCurrencyRates extends Command
{
    protected $signature = 'currencies:update';
    protected $description = 'Update currency exchange rates using ExchangeRate.host API';

    public function handle()
    {
        $apiKey = env('EXCHANGE_RATE_API_KEY');
        $response = Http::get("https://open.er-api.com/v6/latest/LKR?apikey={$apiKey}");


        if (!$response->successful() || !isset($response['rates'])) {
            LogHelper::error('Failed to fetch currency rates.', [$response->body()]);
            return;
        }

        $data = $response->json();

        if (!isset($data['rates'])) {
            LogHelper::error("Missing 'rates' in API response currency rates get", [$response->body()]);
            return;
        }

        $rates = $data['rates'];

        // Get the LKR rate relative to USD
        if (!isset($rates['LKR'])) {
            LogHelper::error("LKR rate missing in API response", [$response->body()]);
            return;
        }

        $lkrRate = $rates['LKR'];

        foreach (Currency::all() as $currency) {
            if (!isset($rates[$currency->key])) {
                continue;
            }

            $rateInUSD = $rates[$currency->key];
            $currency->value = $rateInUSD / $lkrRate;
            $currency->save();
        }

        $this->info('Currency rates updated successfully.');
    }
}
