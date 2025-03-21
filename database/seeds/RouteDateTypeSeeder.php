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

        $routedatetypes = array(
            ['name' => 'ერთჯერადი', 'route_date_type_id' => 1, 'locale' => 'si'],
            ['name' => 'Scheduled', 'route_date_type_id' => 1, 'locale' => 'en'],
            ['name' => 'одноразовый', 'route_date_type_id' => 1, 'locale' => 'ta'],
            ['name' => 'მრავალჯერადი', 'route_date_type_id' => 2, 'locale' => 'si'],
            ['name' => 'Multiple dates', 'route_date_type_id' => 2, 'locale' => 'en'],
            ['name' => 'множественный', 'route_date_type_id' => 2, 'locale' => 'ta'],
        );
        RouteDateTypesTranslatable::insert($routedatetypes);
    }
}
