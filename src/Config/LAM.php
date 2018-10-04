<?php

return [

    /* Important Settings */

    // ======================================================================
    // never remove 'web', . just put your middleware like auth or admin (if you have) here. eg: ['web','auth']
    'private_middlewares'  => explode(',', env('BACKEND_LUM_MIDDLEWARES', 'web')),
    'public_middlewares'   => explode(',', env('BACKEND_LUM_MIDDLEWARES', 'web')),
    // you can change default route from sms-admin to anything you want
    'private_route_prefix' => env('BACKEND_LAM_ROUTE_PREFIX', 'LUM'),
    'public_route_prefix'  => env('FRONTEND_LAM_ROUTE_PREFIX', 'LUM'),
    // ======================================================================

];