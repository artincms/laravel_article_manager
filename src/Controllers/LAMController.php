<?php

namespace ArtinCMS\LAM\Controllers;

use App\Http\Controllers\Controller;

class LAMController extends Controller
{
    public function index()
    {
        return view('LAM::backend.index');
    }
}