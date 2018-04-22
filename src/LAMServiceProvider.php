<?php

namespace ArtinCMS\LAM;

use Illuminate\Support\ServiceProvider;

class LAMServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */

    public function boot()
    {
    	// the main router
	    include_once __DIR__.'/Routes/private_routes.php';
	    include_once __DIR__.'/Routes/public_routes.php';
	    // the main views folder
	    $this->loadViewsFrom(__DIR__ . '/Views', 'LAM');
	    // the main migration folder for create sms_ir tables

	    // for publish the views into main app
	    $this->publishes([
		    __DIR__ . '/Views' => resource_path('views/vendor/laravel_article_manager'),
	    ]);

	    $this->publishes([
		    __DIR__ . '/Migrations/' => database_path('migrations')
	    ], 'migrations');

	    // for publish the assets files into main app
	    $this->publishes([
		    __DIR__.'/assets' => public_path('vendor/LAM'),
	    ], 'public');

	    // for publish the sms_ir config file to the main app config folder
	    $this->publishes([
		    __DIR__ . '/Config/LAM.php' => config_path('laravel_article_manager.php'),
	    ]);
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
    	// set the main config file
	    $this->mergeConfigFrom(
		    __DIR__ . '/Config/LAM.php', 'laravel_article_manager'
	    );

		// bind the LFMC Facade
	    $this->app->bind('LAMC', function () {
		    return new LAMC;
	    });
    }
}
