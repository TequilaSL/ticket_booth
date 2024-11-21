<?php

namespace App\Http\Controllers\Passenger;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ValidationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;


class LocationTrackerController extends Controller
{
    public function loadLocation(Request $request)
    {
        Log::info('test lgo');
        try {
            $mds = $this->generateUserMfd();
            if ($mds === null) {
                return response()->json(['error' => 'Failed to retrieve mds value.'], 500);
            }

            $queryParams = [
                'method' => 'getOnlineGpsInfoByIDUtc',
                'callback' => 'TrackOBJ.updateDataCallBack',
                'school_id' => '9e81ee7f-a67a-4606-8588-f161fe2c97a4',
                'custid' => '9e81ee7f-a67a-4606-8588-f161fe2c97a4',
                'userIDs' => '9e81ee7f-a67a-4606-8588-f161fe2c97a4',
                'mapType' => 'GOOGLE',
                'option' => 'en',
                't' => time(),
                'minTime' => time() - 10000,
                'mds' => $mds,
                'timestamp' => time(),
            ];

            $response = Http::get('https://www.dagps.net/TrackService.aspx', $queryParams);

            Log::error('response JSON.', [$response]);

            $responseBody = preg_replace('/^TrackOBJ\.updateDataCallBack\((.*)\)$/', '$1', $response->body());
            $data = json_decode($responseBody, true);

            if ($data === null) {
                Log::error('Failed to decode JSON.');
                return response()->json(['error' => 'Failed to process location data'], 500);
            }

            $records = $data['records'] ?? [];
            if (!empty($records)) {
                $firstRecord = $records[0];
                $longitude = $firstRecord[1];
                $latitude = $firstRecord[2];

                Log::info("Extracted Longitude: $longitude, Latitude: $latitude");

                return response()->json([
                    'longitude' => $longitude,
                    'latitude' => $latitude,
                ], 200);
            }
            return response()->json(['message' => 'No location data available'], 404);
        } catch (\Exception $e) {
            return response()->body(['error' => $e->getMessage()], 500);
        }
    }

    public function generateUserMfd()
    {
        try {
            $response = Http::asForm()->post('https://www.dagps.net/LoginByUser.aspx?method=loginSystem', [
                'userName' => '352672109083238',
                'pwd_' => '',
                'loginType' => 'USER',
                'loginUrl' => 'https://www.dagps.net/Skins/DefaultIndex/',
                'pwd' => '123456',
                'timeZone' => '5.5',
                'language' => 'en',
                'checkPwd' => '1',
                'x' => '49',
                'y' => '20',
                'monitor' => '0',
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'API request failed.'], $response->status());
            }

            $responseBody = $response->body();
            $matches = [];
            preg_match('/window\.location\.href="[^?]+\?mds=([^"]+)";/', $responseBody, $matches);

            if (!empty($matches) && isset($matches[1])) {
                Log::info('test lgo4');
                return $matches[1];
            } else {
                throw new \Exception('Unable to extract mds value from the response.');
            }
        } catch (\Exception $e) {
            throw new \Exception('Unable to extract mds value from the response.');
        }
    }

}
