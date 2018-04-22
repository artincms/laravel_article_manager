<?php
namespace ArtinCMS\LAM;
use Illuminate\Support\Facades\Facade;

class LAMFacade extends Facade
{
	protected static function getFacadeAccessor() {
		return 'LAMC';
	}
}