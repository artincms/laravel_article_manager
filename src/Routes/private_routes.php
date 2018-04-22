<?php
Route::group(['prefix' => config('laravel_article_manager.private_route_prefix'), 'namespace' => 'ArtinCMS\LAM\Controllers', 'middleware' => config('laravel_article_manager.private_middlewares')], function () {
    Route::get('index', ['as' => 'LAM.Index', 'uses' => 'LAMController@index']);
    Route::post('get_articles', ['as' => 'LAM.GridMyFiles', 'uses' => 'LAMController@get_articles']);
});

