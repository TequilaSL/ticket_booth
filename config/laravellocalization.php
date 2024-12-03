<?php

return [
    'supportedLocales' => [
        'en' => ['name' => 'Eng', 'id' => 1],
        'sn' => ['name' => 'Sin', 'id' => 2],
        'ta' => ['name' => 'Tam', 'id' => 3],
    ],
    'useAcceptLanguageHeader' => true,
    'hideDefaultLocaleInURL' => true,
    'localesOrder' => [],
    'localesMapping' => [],
    'utf8suffix' => env('LARAVELLOCALIZATION_UTF8SUFFIX', '.UTF-8'),
    'urlsIgnored' => ['/admin/*'],
];
