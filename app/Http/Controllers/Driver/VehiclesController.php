<?php

namespace App\Http\Controllers\Driver;

use App\Country;
use App\Driver;
use App\FuelTypes;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ValidationController;
use App\Manufacturer;
use App\RouteTypes;
use App\SupportTicketMessages;
use App\Vehicle;
use App\VehicleSpecs;
use App\VehiclesSpecs;
use Hashids\Hashids;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Log;

class VehiclesController extends DriverController
{

    public function __construct()
    {
        parent::__construct();
        $agent = new Agent();
        if (!$agent->isMobile()) {
            $this->middleware('driver_active')->except('seatsMax', 'scheme', 'add', 'edit', 'deleteSingle', 'deleteFront', 'deleteBack');
            //check if user can edit the vehicle
            $this->middleware('can_edit_vehicle')->only('edit', 'viewEdit', 'deleteSingle');
        }
    }

    public function delete($data)
    {
        try {
            return Vehicle::whereId($data['id'])->delete();
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    public function actionDelete(Request $request)
    {
        $data = $request->only('id');
        $response = ValidationController::response($this->validator($data, 'deleteVehicle'));
        if ($response->original['status'] == 1) {
            if (Storage::disk('s3')->exists('drivers/vehicles/' . $data['id'])) {
                Storage::disk('s3')->deleteDirectory('drivers/vehicles/' . $data['id']);
            }
            $this->delete($data);
        }
        return response()->json($response->original);
    }


    public function seatsMax(Request $request)
    {
        if ($request->type == 1) {
            return config('app.max_3_minibus_seats');
        }
        else if ($request->type == 2) {
            return config('app.max_4_minibus_seats');
        }
        else if ($request->type == 3) {
            return config('app.max_4_medium_bus_seats');
        }
        else if ($request->type == 4) {
            return config('app.max_5_medium_bus_seats');
        }
        else if ($request->type == 5) {
            return config('app.max_4_large_bus_seats');
        }
        else if ($request->type == 6) {
            return config('app.max_5_large_bus_seats');
        }
        else {
            return false;
        }
    }

    public function store(array $data)
    {
        $vd = Vehicle::create(Arr::except($data, ['vehicle_features', 'vehicle_images', 'vehicle_license_front_side', 'vehicle_license_back_side']));
        if (isset($data['vehicle_features'])) {
            foreach ($data['vehicle_features'] as $vf) {
                VehiclesSpecs::updateOrCreate(['vehicle_id' => $vd->id, 'vehicle_specification_id' => $vf]);
            }
        }
        return $vd;
    }

    public function update(array $data)
    {
        if (isset($data['vehicle_features'])) {
            foreach ($data['vehicle_features'] as $vf) {
                VehiclesSpecs::updateOrCreate(['vehicle_id' => $data['id'], 'vehicle_specification_id' => $vf]);
            }
            unset($data['vehicle_features']);
        }
        $vehUpd = Arr::except($data, ['id', 'vehicle_features', 'vehicle_images', 'vehicle_license_front_side', 'vehicle_license_back_side']);
        if (!empty($vehUpd)) {
            return Vehicle::current()->where('id', $data['id'])->update($vehUpd);
        }
        else {
            return true;
        }
    }


    protected function validator($data, $mode = null)
    {
        if ($mode == 'type_1') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_3_minibus_seats') . ',' . config('app.max_3_minibus_seats'),
            ];
        }
        if ($mode == 'type_2') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_4_minibus_seats') . ',' . config('app.max_4_minibus_seats'),
            ];
        }
        if ($mode == 'type_3') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_4_medium_bus_seats') . ',' . config('app.max_4_medium_bus_seats'),
            ];
        }
        if ($mode == 'type_4') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_5_medium_bus_seats') . ',' . config('app.max_5_medium_bus_seats'),
            ];
        }
        if ($mode == 'type_5') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_4_large_bus_seats') . ',' . config('app.max_4_large_bus_seats'),
            ];
        }
        if ($mode == 'type_6') {
            $fields = [
                'number_of_seats' => 'required|integer|between:' . config('app.min_5_large_bus_seats') . ',' . config('app.max_5_large_bus_seats'),
            ];
        }
        else if ($mode == 'deleteVehicle') {
            $fields = [
                'id' => 'required|integer|' . Rule::exists('vehicles', 'id')->where('user_id', \Auth::user()->id)->whereNot('status', 1),
            ];
        }
        else {
            for ($i = date('Y'); $i >= date('Y') - 100; $i--) {
                $year[] = $i;
            }
            if ($mode == 'edit'):
                $smt = 'sometimes|';
            else:
                $smt = null;
            endif;


            $fields = [
                'type' => 'required|integer|' . Rule::exists('route_types', 'id'),
                'country_id' => 'required|integer|' . Rule::exists('countries', 'id'),
                'manufacturer' => 'required|integer|' . Rule::exists('manufacturers', 'id'),
                'license_plate' => 'required|string|' . Rule::unique('vehicles', 'license_plate')->where('id', $data['country_id'])->whereNot('id', $data['country_id'] ?? 0),
                'model' => 'required|string',
                'fuel_type' => 'required|integer|' . Rule::exists('fuel_types', 'id'),
                'year' => 'required|integer|' . Rule::in($year),
                'date_of_registration' => 'required|date',
                'vehicle_features' => 'required|array',
                'vehicle_features.*' => 'required|integer|' . Rule::exists('vehicle_specifications', 'id'),
                'vehicle_license_front_side' => $smt . 'required|image|mimes:jpeg,png,jpg,svg|max:10000|dimensions:min_width=200,min_height=200,max_width=6000,max_height=6000',
                'vehicle_license_back_side' => $smt . 'required|image|mimes:jpeg,png,jpg,svg|max:10000|dimensions:min_width=200,min_height=200,max_width=6000,max_height=6000',
                'vehicle_images' => $smt . 'required|array|between:1,10',
                'vehicle_images.*' => 'required|image|mimes:jpeg,png,jpg,svg|max:10000|dimensions:min_width=200,min_height=200,max_width=6000,max_height=6000',
                'seat_positioning' => 'required|array',
                'seat_positioning.*.value' => 'required|integer|distinct',
                'seat_positioning.*.top' => 'required|integer',
                'seat_positioning.*.left' => 'required|integer',
            ];

            if ($mode == 'edit'):
                $fields['id'] = 'required|integer|' . Rule::exists('vehicles', 'id')->where('user_id', \Auth::user()->id);
            endif;

            if (Vehicle::current()->whereId($data['id'] ?? 0)->status(1)->exists() && $mode == 'edit') {
                $fields = Arr::only($fields, ['id', 'vehicle_images', 'vehicle_images.*', 'vehicle_features', 'vehicle_features.*']);
            }


        }
        return \Validator::make($data, $fields);
    }

    private function action(Request $request, $type)
    {
        $request->merge(['model' => ucfirst($request->model ?? null)]);
        $request->merge(['license_plate' => str_replace("-", "", strtoupper($request->license_plate ?? null))]);

        if (Vehicle::current()->whereId($request->id)->status(1)->exists() && $type == 'edit') {
            $assignable = [
                'id',
                'vehicle_images',
                'vehicle_features',
            ];
            $noSP = true;
        }
        else {
            $assignable = [
                'type',
                'country_id',
                'manufacturer',
                'license_plate',
                'model',
                'fuel_type',
                'year',
                'date_of_registration',
                'vehicle_features',
                'vehicle_license_front_side',
                'vehicle_license_back_side',
                'vehicle_images',
                'seat_positioning'
            ];

            if ($type == 'edit') {
                $assignable[] = 'id';
            }
            $noSP = false;
        }


        if (!$request->hasFile('vehicle_license_front_side') && $this->frontSide($request->id ?? null) && in_array('vehicle_license_front_side', $assignable)) {
            unset($assignable[array_search('vehicle_license_front_side', $assignable)]);
        }


        if (!$request->hasFile('vehicle_license_back_side') && $this->backSide($request->id ?? null) && in_array('vehicle_license_back_side', $assignable)) {
            unset($assignable[array_search('vehicle_license_back_side', $assignable)]);
        }


        if (!$request->hasFile('vehicle_images') && $this->vehicleImageExists($request->id ?? null) && in_array('vehicle_images', $assignable)) {
            unset($assignable[array_search('vehicle_images', $assignable)]);
        }


        $data = $request->only($assignable);


        $vehicle_images = $request->file('vehicle_images');

        $response = ValidationController::response($this->validator($data, $type), \Lang::get('auth.successfully_updated'));
        if ($response->original['status'] == 1) {
            if ($noSP == false) {
                $data['number_of_seats'] = count($data['seat_positioning']);
                $response_sit = ValidationController::response($this->validator($data, 'type_' . $data['type']), \Lang::get('auth.successfully_updated_sent_to_review'));
            }
            else {
                $response_sit = $response;
            }
            if ($response_sit->original['status'] == 1) {
                if ($type == 'add') {
                    $data['user_id'] = \Auth::user()->id;
                    $data['status'] = 2;
                }
                if ($noSP == false) {
                    $data['number_of_seats'] = count($data['seat_positioning']);
                    $data['seat_positioning'] = json_encode(array_values($data['seat_positioning']));
                }

                if ($type == 'edit') {
                    $id = $data['id'];
                    $this->update($data);
                }
                else {
                    $id = $this->store($data)->id;
                }

                if ($request->hasFile('vehicle_license_front_side') && $type == 'edit' && Vehicle::status(2)->where('id', $id)->exists() || $type == 'add') {
                    //front side
                    $image_front = $request->file('vehicle_license_front_side');
                    Storage::disk('s3')->putFileAs('drivers/vehicles/' . $id, $image_front, 'front_side.' . $image_front->extension());
                    Vehicle::whereId($id)->update(['front_side_extension' => $image_front->extension()]);
                }
                if ($request->hasFile('vehicle_license_back_side') && $type == 'edit' && Vehicle::status(2)->where('id', $id)->exists() || $type == 'add') {
                    //back side
                    $image_back = $request->file('vehicle_license_back_side');
                    Storage::disk('s3')->putFileAs('drivers/vehicles/' . $id, $image_back, 'back_side.' . $image_back->extension());
                    Vehicle::whereId($id)->update(['back_side_extension' => $image_back->extension()]);
                }

                //vehicle images
                if ($request->hasFile('vehicle_images')) {
                    if ($type == 'add') {
                        $imageExtensions = [];
                    }
                    else {
                        $vehicle = Vehicle::whereId($id)->first('images_extension');
                        $imageExtensions = json_decode($vehicle->images_extension, true);
                    }
                    foreach ($vehicle_images as $k => $vi) {
                        $filename = md5(uniqid());
                        $imageExtensions[] = $filename . '.' . $vi->extension();
                        Storage::disk('s3')->putFileAs('drivers/vehicles/' . $id, $vi, $filename . '.' . $vi->extension());
                    }
                    Vehicle::whereId($id)->update(['images_extension' => json_encode($imageExtensions)]);
                }
            }
            $response_sit->original['vehicle_id'] = $request->vehicle_id;
            return response()->json($response_sit->original);
        }
        return response()->json($response->original);
    }


    public function add(Request $request)
    {
        return $this->action($request, 'add');
    }


    public function edit(Request $request)
    {
        return $this->action($request, 'edit');
    }


    public function scheme(Request $request)
    {
        $all_route_types = Controller::essentialVars('all_route_types')['all_route_types'];
        $type = $request->only('type');
        $data['seat_positioning'] = $this->defaultSchemes($type['type'] ?? null);
        $data['route_type'] = $all_route_types[$type['type'] - 1]['key'] ?? null;
        $data['editable'] = true;
        return view('components.vehicle-schemes', $data)->render();
    }

    public function defaultSchemes($type)
    {
        if ($type == 1 ) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 85],
                ['value' => 2, 'top' => 190, 'left' => 190],
                ['value' => 3, 'top' => 100, 'left' => 190],
                ['value' => 4, 'top' => 50, 'left' => 190],
                ['value' => 5, 'top' => 190, 'left' => 275],
                ['value' => 6, 'top' => 100, 'left' => 275],
                ['value' => 7, 'top' => 50, 'left' => 275],
                ['value' => 8, 'top' => 190, 'left' => 360],
                ['value' => 9, 'top' => 100, 'left' => 360],
                ['value' => 10, 'top' => 50, 'left' => 360],
                ['value' => 11, 'top' => 190, 'left' => 445],
                ['value' => 12, 'top' => 100, 'left' => 445],
                ['value' => 13, 'top' => 50, 'left' => 445],
                ['value' => 14, 'top' => 190, 'left' => 530],
                ['value' => 15, 'top' => 100, 'left' => 530],
                ['value' => 16, 'top' => 50, 'left' => 530],
                ['value' => 17, 'top' => 190, 'left' => 615],
                ['value' => 18, 'top' => 100, 'left' => 615],
                ['value' => 19, 'top' => 50, 'left' => 615],
                ['value' => 20, 'top' => 190, 'left' => 700],
                ['value' => 21, 'top' => 100, 'left' => 700],
                ['value' => 22, 'top' => 50, 'left' => 700],
                ['value' => 23, 'top' => 190, 'left' => 785],
                ['value' => 24, 'top' => 145, 'left' => 785],
                ['value' => 25, 'top' => 100, 'left' => 785],
                ['value' => 26, 'top' => 50, 'left' => 785],
            ]);
        }
        if ($type == 2 ) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 90],
                ['value' => 2, 'top' => 200, 'left' => 190],
                ['value' => 3, 'top' => 160, 'left' => 190],
                ['value' => 4, 'top' => 80, 'left' => 190],
                ['value' => 5, 'top' => 40, 'left' => 190],
                ['value' => 6, 'top' => 200, 'left' => 280],
                ['value' => 7, 'top' => 160, 'left' => 280],
                ['value' => 8, 'top' => 80, 'left' => 280],
                ['value' => 9, 'top' => 40, 'left' => 280],
                ['value' => 10, 'top' => 200, 'left' => 370],
                ['value' => 11, 'top' => 160, 'left' => 370],
                ['value' => 12, 'top' => 80, 'left' => 370],
                ['value' => 13, 'top' => 40, 'left' => 370],
                ['value' => 14, 'top' => 200, 'left' => 460],
                ['value' => 15, 'top' => 160, 'left' => 460],
                ['value' => 16, 'top' => 80, 'left' => 460],
                ['value' => 17, 'top' => 40, 'left' => 460],
                ['value' => 18, 'top' => 200, 'left' => 550],
                ['value' => 19, 'top' => 160, 'left' => 550],
                ['value' => 20, 'top' => 80, 'left' => 550],
                ['value' => 21, 'top' => 40, 'left' => 550],
                ['value' => 22, 'top' => 200, 'left' => 640],
                ['value' => 23, 'top' => 160, 'left' => 640],
                ['value' => 24, 'top' => 80, 'left' => 640],
                ['value' => 25, 'top' => 40, 'left' => 640],
                ['value' => 26, 'top' => 200, 'left' => 730],
                ['value' => 27, 'top' => 160, 'left' => 730],
                ['value' => 28, 'top' => 80, 'left' => 730],
                ['value' => 29, 'top' => 40, 'left' => 730],
                ['value' => 30, 'top' => 200, 'left' => 820],
                ['value' => 31, 'top' => 160, 'left' => 820],
                ['value' => 32, 'top' => 120, 'left' => 820],
                ['value' => 33, 'top' => 80, 'left' => 820],
                ['value' => 34, 'top' => 40, 'left' => 820]
            ]);
        }
        if ($type == 3) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 90],
                ['value' => 2, 'top' => 200, 'left' => 190],
                ['value' => 3, 'top' => 160, 'left' => 190],
                ['value' => 4, 'top' => 80, 'left' => 190],
                ['value' => 5, 'top' => 40, 'left' => 190],
                ['value' => 6, 'top' => 200, 'left' => 270],
                ['value' => 7, 'top' => 160, 'left' => 270],
                ['value' => 8, 'top' => 80, 'left' => 270],
                ['value' => 9, 'top' => 40, 'left' => 270],
                ['value' => 10, 'top' => 200, 'left' => 350],
                ['value' => 11, 'top' => 160, 'left' => 350],
                ['value' => 12, 'top' => 80, 'left' => 350],
                ['value' => 13, 'top' => 40, 'left' => 350],
                ['value' => 14, 'top' => 200, 'left' => 430],
                ['value' => 15, 'top' => 160, 'left' => 430],
                ['value' => 16, 'top' => 80, 'left' => 430],
                ['value' => 17, 'top' => 40, 'left' => 430],
                ['value' => 18, 'top' => 200, 'left' => 510],
                ['value' => 19, 'top' => 160, 'left' => 510],
                ['value' => 20, 'top' => 80, 'left' => 510],
                ['value' => 21, 'top' => 40, 'left' => 510],
                ['value' => 22, 'top' => 200, 'left' => 590],
                ['value' => 23, 'top' => 160, 'left' => 590],
                ['value' => 24, 'top' => 80, 'left' => 590],
                ['value' => 25, 'top' => 40, 'left' => 590],
                ['value' => 26, 'top' => 200, 'left' => 670],
                ['value' => 27, 'top' => 160, 'left' => 670],
                ['value' => 28, 'top' => 80, 'left' => 670],
                ['value' => 29, 'top' => 40, 'left' => 670],
                ['value' => 30, 'top' => 200, 'left' => 750],
                ['value' => 31, 'top' => 160, 'left' => 750],
                ['value' => 32, 'top' => 120, 'left' => 750],
                ['value' => 33, 'top' => 80, 'left' => 750],
                ['value' => 34, 'top' => 40, 'left' => 750]
            ]);
        }
        if ($type == 4) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 90],
                ['value' => 2, 'top' => 205, 'left' => 190],
                ['value' => 3, 'top' => 170, 'left' => 190],
                ['value' => 4, 'top' => 100, 'left' => 190],
                ['value' => 5, 'top' => 65, 'left' => 190],
                ['value' => 6, 'top' => 30, 'left' => 190],
                ['value' => 7, 'top' => 205, 'left' => 270],
                ['value' => 8, 'top' => 170, 'left' => 270],
                ['value' => 9, 'top' => 100, 'left' => 270],
                ['value' => 10, 'top' => 65, 'left' => 270],
                ['value' => 11, 'top' => 30, 'left' => 270],
                ['value' => 12, 'top' => 205, 'left' => 350],
                ['value' => 13, 'top' => 170, 'left' => 350],
                ['value' => 14, 'top' => 100, 'left' => 350],
                ['value' => 15, 'top' => 65, 'left' => 350],
                ['value' => 16, 'top' => 30, 'left' => 350],
                ['value' => 17, 'top' => 205, 'left' => 430],
                ['value' => 18, 'top' => 170, 'left' => 430],
                ['value' => 19, 'top' => 100, 'left' => 430],
                ['value' => 20, 'top' => 65, 'left' => 430],
                ['value' => 21, 'top' => 30, 'left' => 430],
                ['value' => 22, 'top' => 205, 'left' => 510],
                ['value' => 23, 'top' => 170, 'left' => 510],
                ['value' => 24, 'top' => 100, 'left' => 510],
                ['value' => 25, 'top' => 65, 'left' => 510],
                ['value' => 26, 'top' => 30, 'left' => 510],
                ['value' => 27, 'top' => 205, 'left' => 590],
                ['value' => 28, 'top' => 170, 'left' => 590],
                ['value' => 29, 'top' => 100, 'left' => 590],
                ['value' => 30, 'top' => 65, 'left' => 590],
                ['value' => 31, 'top' => 30, 'left' => 590],
                ['value' => 32, 'top' => 205, 'left' => 670],
                ['value' => 33, 'top' => 170, 'left' => 670],
                ['value' => 34, 'top' => 100, 'left' => 670],
                ['value' => 35, 'top' => 65, 'left' => 670],
                ['value' => 36, 'top' => 30, 'left' => 670],
                ['value' => 37, 'top' => 205, 'left' => 750],
                ['value' => 38, 'top' => 170, 'left' => 750],
                ['value' => 39, 'top' => 100, 'left' => 750],
                ['value' => 40, 'top' => 65, 'left' => 750],
                ['value' => 41, 'top' => 30, 'left' => 750]
            ]);
        }
     if ($type == 5) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 90],
                ['value' => 2, 'top' => 200, 'left' => 190],
                ['value' => 3, 'top' => 160, 'left' => 190],
                ['value' => 4, 'top' => 80, 'left' => 190],
                ['value' => 5, 'top' => 40, 'left' => 190],
                ['value' => 6, 'top' => 200, 'left' => 270],
                ['value' => 7, 'top' => 160, 'left' => 270],
                ['value' => 8, 'top' => 80, 'left' => 270],
                ['value' => 9, 'top' => 40, 'left' => 270],
                ['value' => 10, 'top' => 200, 'left' => 350],
                ['value' => 11, 'top' => 160, 'left' => 350],
                ['value' => 12, 'top' => 80, 'left' => 350],
                ['value' => 13, 'top' => 40, 'left' => 350],
                ['value' => 14, 'top' => 200, 'left' => 430],
                ['value' => 15, 'top' => 160, 'left' => 430],
                ['value' => 16, 'top' => 80, 'left' => 430],
                ['value' => 17, 'top' => 40, 'left' => 430],
                ['value' => 18, 'top' => 200, 'left' => 510],
                ['value' => 19, 'top' => 160, 'left' => 510],
                ['value' => 20, 'top' => 80, 'left' => 510],
                ['value' => 21, 'top' => 40, 'left' => 510],
                ['value' => 22, 'top' => 200, 'left' => 590],
                ['value' => 23, 'top' => 160, 'left' => 590],
                ['value' => 24, 'top' => 80, 'left' => 590],
                ['value' => 25, 'top' => 40, 'left' => 590],
                ['value' => 26, 'top' => 200, 'left' => 670],
                ['value' => 27, 'top' => 160, 'left' => 670],
                ['value' => 28, 'top' => 80, 'left' => 670],
                ['value' => 29, 'top' => 40, 'left' => 670],
                ['value' => 30, 'top' => 200, 'left' => 750],
                ['value' => 31, 'top' => 160, 'left' => 750],
                ['value' => 32, 'top' => 80, 'left' => 750],
                ['value' => 33, 'top' => 40, 'left' => 750],
                ['value' => 34, 'top' => 200, 'left' => 830],
                ['value' => 35, 'top' => 160, 'left' => 830],
                ['value' => 36, 'top' => 80, 'left' => 830],
                ['value' => 37, 'top' => 40, 'left' => 830],
                ['value' => 38, 'top' => 200, 'left' => 910],
                ['value' => 39, 'top' => 160, 'left' => 910],
                ['value' => 40, 'top' => 120, 'left' => 910],
                ['value' => 41, 'top' => 80, 'left' => 910],
                ['value' => 42, 'top' => 40, 'left' => 910]
            ]);
        }
        if ($type == 6) {
            return json_encode([
                ['value' => 1, 'top' => 170, 'left' => 90],
                ['value' => 2, 'top' => 205, 'left' => 190],
                ['value' => 3, 'top' => 170, 'left' => 190],
                ['value' => 4, 'top' => 100, 'left' => 190],
                ['value' => 5, 'top' => 65, 'left' => 190],
                ['value' => 6, 'top' => 30, 'left' => 190],
                ['value' => 7, 'top' => 205, 'left' => 270],
                ['value' => 8, 'top' => 170, 'left' => 270],
                ['value' => 9, 'top' => 100, 'left' => 270],
                ['value' => 10, 'top' => 65, 'left' => 270],
                ['value' => 11, 'top' => 30, 'left' => 270],
                ['value' => 12, 'top' => 205, 'left' => 350],
                ['value' => 13, 'top' => 170, 'left' => 350],
                ['value' => 14, 'top' => 100, 'left' => 350],
                ['value' => 15, 'top' => 65, 'left' => 350],
                ['value' => 16, 'top' => 30, 'left' => 350],
                ['value' => 17, 'top' => 205, 'left' => 430],
                ['value' => 18, 'top' => 170, 'left' => 430],
                ['value' => 19, 'top' => 100, 'left' => 430],
                ['value' => 20, 'top' => 65, 'left' => 430],
                ['value' => 21, 'top' => 30, 'left' => 430],
                ['value' => 22, 'top' => 205, 'left' => 510],
                ['value' => 23, 'top' => 170, 'left' => 510],
                ['value' => 24, 'top' => 100, 'left' => 510],
                ['value' => 25, 'top' => 65, 'left' => 510],
                ['value' => 26, 'top' => 30, 'left' => 510],
                ['value' => 27, 'top' => 205, 'left' => 590],
                ['value' => 28, 'top' => 170, 'left' => 590],
                ['value' => 29, 'top' => 100, 'left' => 590],
                ['value' => 30, 'top' => 65, 'left' => 590],
                ['value' => 31, 'top' => 30, 'left' => 590],
                ['value' => 32, 'top' => 205, 'left' => 670],
                ['value' => 33, 'top' => 170, 'left' => 670],
                ['value' => 34, 'top' => 100, 'left' => 670],
                ['value' => 35, 'top' => 65, 'left' => 670],
                ['value' => 36, 'top' => 30, 'left' => 670],
                ['value' => 37, 'top' => 205, 'left' => 750],
                ['value' => 38, 'top' => 170, 'left' => 750],
                ['value' => 39, 'top' => 100, 'left' => 750],
                ['value' => 40, 'top' => 65, 'left' => 750],
                ['value' => 41, 'top' => 30, 'left' => 750],
                ['value' => 42, 'top' => 205, 'left' => 830],
                ['value' => 43, 'top' => 170, 'left' => 830],
                ['value' => 44, 'top' => 135, 'left' => 830],
                ['value' => 45, 'top' => 100, 'left' => 830],
                ['value' => 46, 'top' => 65, 'left' => 830],
                ['value' => 47, 'top' => 30, 'left' => 830]
            ]);
        }
        else {
            return false;
        }
    }

    private function vehicleImageExists($id = null)
    {
        $images = Vehicle::whereId($id)->first('images_extension');
        if($images) {
            $decoded = json_decode($images->images_extension, true);
            if (!empty($decoded)) {
                return true;
            }
        }

        return false;
    }

    private function frontSide($id = null)
    {
        return $this->vehicleFrontSide($id);
    }

    private function backSide($id = null)
    {
        return $this->vehicleBackSide($id);
    }


    public function deleteSingle(Request $request)
    {
        $data = $request->only('id', 'path');
        $check = Vehicle::whereId($data['id'])->first('images_extension');
        $images = json_decode($check->images_extension, true);
        $exp = explode('drivers/vehicles/' . $data['id'] . '/', $data['path']);
        if (in_array($exp[1], $images) && sizeof($images) > 1) {
            Storage::disk('s3')->delete($data['path']);
            if (($key = array_search($exp[1], $images)) !== false) {
                unset($images[$key]);
            }
            $images = array_values($images);
            Vehicle::whereId($data['id'])->update(['images_extension' => json_encode($images)]);
            $response = array('status' => 1, 'text' => \Lang::get('validation.image_removed'));
        }
        else {
            $response = array('status' => 0, 'text' => \Lang::get('validation.image_not_removed'));
        }
        return response()->json($response);
    }

    public function deleteFront(Request $request)
    {
        $id = $request->only('id')['id'];
        $extension = Vehicle::whereId($id)->first('front_side_extension');
        if ($this->frontSide($id) && Vehicle::where('status', '!=', 1)->whereId($id)->exists()) {
            Storage::disk('s3')->delete('drivers/vehicles/' . $id . '/front_side.' . $extension->front_side_extension);
            $response = array('status' => 1, 'text' => \Lang::get('validation.image_removed'));
        }
        else {
            $response = array('status' => 0, 'text' => \Lang::get('validation.image_not_removed'));
        }
        return response()->json($response);
    }

    public function deleteBack(Request $request)
    {
        $id = $request->only('id')['id'];
        $extension = Vehicle::whereId($id)->first('back_side_extension');
        if ($this->backSide($id) && Vehicle::where('status', '!=', 1)->whereId($id)->exists()) {
            Storage::disk('s3')->delete('drivers/vehicles/' . $id . '/back_side.' . $extension->back_side_extension);
            $response = array('status' => 1, 'text' => \Lang::get('auth.image_removed'));
        }
        else {
            $response = array('status' => 0, 'text' => \Lang::get('auth.image_not_removed'));
        }
        return response()->json($response);
    }


    public function viewAll()
    {
        $agent = new Agent();
        if ($agent->isMobile()) {
            $data['title'] = \Lang::get('titles.main');
            return view('mobile.main', $data);
        }
        else {
            $data = Controller::essentialVars();
            return view('driver.registered-vehicles', $data);
        }
    }

    public function allVehicleData()
    {
        $vehs = Vehicle::current()->with('routeTypes:id', 'routeTypes.translated', 'manufacturers:id,name as manufacturer_name')->
        get(['id', 'type', 'model', 'manufacturer', 'license_plate', 'year', 'number_of_seats', 'status'])->toArray();

        $data = collect($vehs)->map(function ($v) {
            $actions = [
                [
                    'url' => route('vehicle_edit', ['id' => $v['id']]),
                    'faicon' => 'fa-pencil',
                    'url_class' => 'blue route-edit',
                ],
                [
                    'faicon' => 'fa-times-circle',
                    'url' => '#',
                    'url_class' => 'vehicle_delete_alertify',
                    'alertify' => [
                        'confirm-msg' => Lang::get('alerts.confirm_vehicle_delete'),
                        'success-msg' => Lang::get('alerts.success_vehicle_delete'),
                        'error-msg' => Lang::get('alerts.error_vehicle_delete'),
                        'title' => Lang::get('alerts.title_vehicle_delete'),
                        'ok' => Lang::get('alerts.ok_vehicle_delete'),
                        'cancel' => Lang::get('alerts.cancel_vehicle_delete'),
                        'id' => $v['id']
                    ],
                ],
            ];
            $v['status'] = StatusController::fetch($v['status'], route('vehicle_edit', ['id' => $v['id']]));
            $v['actions'] = view('components.table-actions', ['actions' => $actions])->render();
            $v['manufacturer_model'] = $v['manufacturers']['manufacturer_name'] . ' ' . $v['model'];
            return $v;
        });

        return datatables()->of($data ?? [])->rawColumns(['status', 'actions'])->toJson();
    }


    protected function dataLoad($essentials = true)
    {
        if ($essentials) {
            $data = Controller::essentialVars();
        }
        $data['status'] = Driver::current()->pluck('status')->first();
        $data['route_types'] = RouteTypes::with('translated')->get()->toArray();
        $data['fuel_types'] = FuelTypes::with('translated')->get()->toArray();
        $data['countries'] = Country::with('translated')->get()->toArray();
        $data['vehicle_specs'] = VehicleSpecs::with('translated')->get()->toArray();
        $data['manufacturers'] = Manufacturer::all(['id', 'name'])->toArray();
        for ($i = date('Y'); $i >= date('Y') - 100; $i--) {
            $data['year_manufactured'][] = $i;
        }
        if ($essentials) {
            $data['scheme'] = $this->defaultSchemes(1);
        }
        return $data;
    }

    public function viewAdd()
    {
        $agent = new Agent();
        if ($agent->isMobile()) {
            $data['title'] = \Lang::get('titles.main');
            return view('mobile.main', $data);
        }
        else {
            $data = $this->dataLoad();
            return view('driver.vehicle-registration', $data);
        }
    }

    public function viewEdit(Request $request)
    {
        $agent = new Agent();
        if (!$agent->isMobile()) {
            $id = $request->id;
            $data = $this->dataLoad();
            $hashids = new Hashids('', 16);
            if (isset($request->ticket) && isset($request->message) &&
                SupportTicketMessages::whereTicketId($hashids->decode($request->ticket)[0])->whereId($hashids->decode($request->message)[0])->exists()
            ) {
                $data['ticketId'] = $request->ticket;
                $data['latestMessage'] = $request->message;
                $data['message'] = SupportTicketMessages::whereTicketId($hashids->decode($request->ticket)[0])->whereId($hashids->decode($request->message)[0])->first('message')->message;
            }

            $data['vehicle'] = Vehicle::with('fullspecifications:vehicle_id,vehicle_specification_id', 'routeTypes')->current()->where('id', $id)->first()->toArray();
            $vehicleImages = json_decode($data['vehicle']['images_extension'], true);
            foreach ($vehicleImages as $k => $image) {
                if (Storage::disk('s3')->exists('drivers/vehicles/' . $id . '/' . $image)) {
                    $data['vehicle_images'][$k] = 'drivers/vehicles/' . $id . '/' . $image;
                }
            }
            $data['front_side'] = 'drivers/vehicles/' . $id . '/front_side.' . $data['vehicle']['front_side_extension'];
            $data['back_side'] = 'drivers/vehicles/' . $id . '/back_side.' . $data['vehicle']['back_side_extension'];
            return view('driver.vehicle-edit', $data);
        }
        else {
            $data['title'] = \Lang::get('titles.main');
            return view('mobile.main', $data);
        }
    }


}
