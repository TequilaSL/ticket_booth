<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GT06Server extends Command
{
    protected $signature = 'gt06:run';
    protected $description = 'Start the GT06 GPS Tracker Socket Server';

    public function handle()
    {
        $host = "0.0.0.0"; // Listen on all interfaces
        $port = 5000;

        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_bind($socket, $host, $port);
        socket_listen($socket);

        $this->info("GT06 Socket Server started on $host:$port");

        while ($client = socket_accept($socket)) {
            $input = socket_read($client, 1024);
            $this->info("Received: " . bin2hex($input));

            // Parse GT06 data
            $gpsData = $this->parseGT06Data($input);
            if ($gpsData) {
                $this->saveLocation($gpsData);
            }

            // Acknowledge the device
            socket_write($client, hex2bin("787805013526721090832380A"));
            socket_close($client);
        }

        socket_close($socket);
    }

    private function parseGT06Data($binaryData)
    {
        $hex = bin2hex($binaryData);
        if (strpos($hex, "7878") === 0) { // Validate start bytes
            $lat = hexdec(substr($hex, 20, 8)) / 1800000; // Example parsing
            $lng = hexdec(substr($hex, 28, 8)) / 1800000;
            return ['lat' => $lat, 'lng' => $lng];
        }
        return null;
    }

    private function saveLocation($location)
    {
        DB::table('locations')->insert([
            'latitude' => $location['lat'],
            'longitude' => $location['lng'],
            'created_at' => now(),
        ]);
    }
}
