<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');

Route::get('/reset-password/{token}', function (string $token) {
    return false;
})->name('password.reset');
