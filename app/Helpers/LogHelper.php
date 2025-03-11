<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class LogHelper
{
    /**
     * Get the calling class, method, and line number.
     *
     * @return string
     */
    private static function getCallerInfo()
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3); // We go up 3 levels to get the caller's class and method
        $caller = $backtrace[2]; // 2 levels up to get the caller method
        $class = isset($caller['class']) ? $caller['class'] : 'Unknown Class';
        $method = isset($caller['function']) ? $caller['function'] : 'Unknown Method';
        $line = isset($caller['line']) ? $caller['line'] : 'Unknown Line';

        return "{$class}@{$method} (Line: {$line})";
    }

    /**
     * Log info messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function info($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::info("[{$callerInfo}] - {$message}", $context);
    }

    /**
     * Log error messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function error($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::error("[{$callerInfo}] - {$message}", $context);
    }


    /**
     * Log API call error details.
     *
     * @param string $message
     * @param string $url
     * @param int    $statusCode
     * @param string $responseBody
     * @param array  $context
     * @return void
     */
    public static function apiCallError($message, $statusCode, $responseBody)
    {
        $callerInfo = self::getCallerInfo();

        $logData = [
            'status_code' => $statusCode,
            'response_body' => $responseBody,
        ];

        Log::error("[{$callerInfo}] - {$message}", $logData);
    }

    /**
     * Log critical messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function critical($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::critical("[{$callerInfo}] - {$message}", $context);
    }

    /**
     * Log warning messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function warning($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::warning("[{$callerInfo}] - {$message}", $context);
    }

    /**
     * Log alert messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function alert($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::alert("[{$callerInfo}] - {$message}", $context);
    }

    /**
     * Log emergency messages to the log file with class, method, and line number.
     *
     * @param string $message
     * @param array  $context
     * @return void
     */
    public static function emergency($message, array $context = [])
    {
        $callerInfo = self::getCallerInfo();
        Log::emergency("[{$callerInfo}] - {$message}", $context);
    }
}
