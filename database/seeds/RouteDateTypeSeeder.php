<?php

use Illuminate\Database\Seeder;
use App\RouteDateTypes;
use App\RouteDateTypesTranslatable;

class RouteDateTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $routedatetypes = array(
            array('id' => 1),
            array('id' => 2),
        );
        RouteDateTypes::insert($routedatetypes);

        $routeDateTypes = array(
            ['name' => 'Scheduled', 'route_date_type_id' => 1, 'locale' => 'en'],
            ['name' => 'එකක් පමණක්', 'route_date_type_id' => 1, 'locale' => 'si'],
            ['name' => 'ஒரே ஒரு முறை', 'route_date_type_id' => 1, 'locale' => 'ta'],
            ['name' => 'Multiple dates', 'route_date_type_id' => 2, 'locale' => 'en'],
            ['name' => 'බොහෝ වතාවක්', 'route_date_type_id' => 2, 'locale' => 'si'],
            ['name' => 'பல தேதி', 'route_date_type_id' => 2, 'locale' => 'ta'],
        );

        RouteDateTypesTranslatable::insert($routedatetypes);
    }
}
