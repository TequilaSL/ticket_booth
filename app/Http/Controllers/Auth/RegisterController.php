<?php

namespace App\Http\Controllers\Auth;

use App\Admins;
use App\AffiliateCodes;
use App\Country;
use App\Driver;
use App\Gender;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MailController;
use App\Http\Controllers\Partners\GeneratorController;
use App\Http\Controllers\ValidationController;
use App\Partner;
use App\Routes;
use App\Sales;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RegisterController extends ValidationController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getAllUser()
    {
        $users = Admins::select('id', 'user_id', 'ip')->get();

        return response()->json($users, 200);
    }

    public static function store(array $data)
    {
        if (isset($data['name'])) {
            $data['name'] = ValidationController::removeCommas($data['name']);
        }
        $data['country_id'] = 1;
        $user = User::create($data);

        if (!empty($data['affiliate_code'])) {
            $afUser = AffiliateCodes::where('code', $data['affiliate_code'])->first('user_id')->user_id;
            GeneratorController::generate($afUser);
            AffiliateCodes::where('code', $data['affiliate_code'])->update(['user_used' => $user->id]);
        }

        return $user;
    }

    protected function validatorFields($ignoreCaptcha = false, $ignorePassword = false)
    {
        $vals = [
            'phone_number' => ['required', 'regex:/^\+94\d{9}$/', 'unique:users'],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'sometimes|required|email|unique:users',
            'gender_id' => 'sometimes|required|string|' . Rule::exists('genders', 'id'),
            'terms_and_condition' => 'required',
            'affiliate_code' => 'nullable|unique:users|' . Rule::exists('affiliate_codes', 'code')->where('status', 2),
        ];
        if(!$ignorePassword) {
            $vals['password'] = 'required|string|min:5';
        }
        if (!$ignoreCaptcha) {
            $vals['g-recaptcha-response'] = 'nullable';
        }
        return $vals;
    }


    protected function validator(array $data, array $addition = null, $ignoreCaptcha = false, $ignorePassword = false)
    {

        $vals = $this->validatorFields($ignoreCaptcha, $ignorePassword);

        if ($addition) {
            $vals = array_merge($vals, $addition);
        }
        return Validator::make($data, $vals);
    }

    protected function driverValidator(array $data, array $addition = null, $ignorePassword = false)
    {
        $vals = [
            'phone_number' => ['required', 'regex:/^\+94\d{9}$/', 'unique:users'],
            'email' => 'sometimes|required|email|unique:users',
            'gender_id' => 'sometimes|required|string|' . Rule::exists('genders', 'id'),
            'affiliate_code' => 'nullable|unique:users|' . Rule::exists('affiliate_codes', 'code')->where('status', 2),
        ];
        if(!$ignorePassword) {
            $vals['password'] = 'required|string|min:5';
        }

        if ($addition) {
            $vals = array_merge($vals, $addition);
        }
        return Validator::make($data, $vals);
    }

    public function __invoke(Request $request)
    {
        // $data = $request->only('name', 'email', 'password', 'phone_number', 'affiliate_code', 'gender_id', 'g-recaptcha-response');
        $data = $request->only('first_name','last_name', 'email', 'password', 'phone_number',  'gender_id', 'affiliate_code', 'terms_and_condition');
        $validator = $this->validator($data);
        $errors = $validator->errors();
        if ($validator->fails()) {
            $response = array('status' => 0, 'text' => $errors->first());
        } else {
                $data['password'] = Hash::make($data['password']);
                $data['name'] = $data['first_name'].' '.$data['last_name'];
                $this->store($data);

                 $mailSend=new MailController();
                 $data['subject'] = 'TicketBooth registration successfull !';
                 $data['body'] = 'We hereby inform you that you have registered with TicketBooth.lk successfully';
                 $mailSend->sendMail($data);
                 $this->sendMassageForMobile($data);

                $response = array('status' => 1, 'text' => \Lang::get('auth.registration_successful'));

        }

        return response()->json($response);
    }

    protected function invokeDriverPartner($request, $page, $ignoreCaptcha = false, $ignorePassword = false)
    {
        $assignable = ['country_id', 'gender_id', 'id_number'];
        if (empty($request->id_number)) {
            unset($assignable[array_search('id_number', $assignable)]);
        }


        $assignable = array_merge($assignable, ['name', 'email', 'password', 'phone_number', 'affiliate_code']);
        //$assignable = array_merge($assignable, ['name', 'email', 'password', 'phone_number']);

        $data['user'] = $request->only($assignable);
        if ($ignoreCaptcha) {
            $data['user']['g-recaptcha-response'] = 'not required';
        }
        if($ignorePassword) {
            unset($assignable[array_search('password', $assignable)]);
        }
        $response = ValidationController::response($this->driverValidator($data['user'], null, $ignorePassword), \Lang::get('auth.registration_successful'));
        if (!$ignoreCaptcha) {
            if ($response->original['status'] == 1) {
                // if (!$this->validateRecaptcha($data['user']['g-recaptcha-response'])) {
                //     $response->original = ['status' => 0, 'text' => \Lang::get('validation.recaptcha_verification_failed')];
                // }
            }
            unset($data['user']['g-recaptcha-response']);
        }
        $return['response'] = $response;
        $return['data'] = $data;
        return $return;
    }

    protected function viewPage($page)
    {
        $data = Controller::essentialVars();
        $data['total_drivers'] = Driver::where('status', 1)->count();
        $data['total_partners'] = Partner::where('status', 1)->count();
        $data['sold_tickets'] = Sales::status([1, 3])->count();
        $data['total_routes'] = Routes::where('status', 1)->count();
        $countries = Country::with('translated')->get()->toArray();
        foreach ($countries as $key => $val) {
            $data['countries'][$key]['id'] = $val['id'];
            $data['countries'][$key]['name'] = $val['translated']['name'];
        }
        if (\Auth::check()) {
            $genders = Gender::with('translated')->get()->toArray();
            foreach ($genders as $key => $val) {
                $data['gender'][$key]['id'] = $val['id'];
                $data['gender'][$key]['name'] = $val['translated']['name'];
            }
            if (isset($data['isPartner'])) {
                $data['affiliateCode'] = AffiliateCodes::current()->whereStatus(2)->pluck('code')->first();
            }

        }
        return view('register-as-' . $page, $data);
    }

    public function sendMassageForMobile($data)
    {
        $contact = $data['phone_number'];

            $queryParams = http_build_query([
                'recipient' =>  $contact,
                'sender_id' => 'TextLKDemo',
                'message' => $data['body'],
            ]);

            $url = 'https://app.text.lk/api/v3/sms/send?'.$queryParams;

            $response = Http::withToken('62|u9MhYN6e0faDAOlFyWznAxII9cDFtbCNo65IEKvNdcd92f65')
            ->post($url);

            Log::info($response->body());
    }


}
