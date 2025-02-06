<?php

use Illuminate\Database\Seeder;
use App\Currency;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $currencies = [
            ['id' => 1, 'key' => 'LKR', 'code' => 144, 'value' => 0.27],
            ['id' => 2, 'key' => 'USD', 'code' => 840, 'value' => 1.0],
            ['id' => 3, 'key' => 'EUR', 'code' => 978, 'value' => 0.92],
            ['id' => 4, 'key' => 'JPY', 'code' => 392, 'value' => 135.5],
            ['id' => 5, 'key' => 'GBP', 'code' => 826, 'value' => 0.74],
            ['id' => 6, 'key' => 'AUD', 'code' => 036, 'value' => 1.46],
            ['id' => 7, 'key' => 'INR', 'code' => 356, 'value' => 82.7],
            ['id' => 8, 'key' => 'CNY', 'code' => 156, 'value' => 6.9],
            ['id' => 9, 'key' => 'CAD', 'code' => 124, 'value' => 1.3],
            ['id' => 10, 'key' => 'CHF', 'code' => 756, 'value' => 0.9]
        ];

        Currency::insert($currencies);
    }
}
