<?php

use Illuminate\Database\Seeder;
use App\Gender;
use App\GenderTranslatable;

class GenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genders = array(
            array('id' => 1, 'key' => 'man'),
            array('id' => 2, 'key' => 'woman'),
        );
        Gender::insert($genders);

        $gendersTranslate = array(
            array('gender_id' => 1, 'name' => 'Male', 'locale' => 'en'),
            array('gender_id' => 1, 'name' => 'මහලු', 'locale' => 'si'),
            array('gender_id' => 1, 'name' => 'ஆண்', 'locale' => 'ta'),
            array('gender_id' => 2, 'name' => 'Female', 'locale' => 'en'),
            array('gender_id' => 2, 'name' => 'ගැහැණු', 'locale' => 'si'),
            array('gender_id' => 2, 'name' => 'பெண்', 'locale' => 'ta'),
        );
        GenderTranslatable::insert($gendersTranslate);
    }
}
