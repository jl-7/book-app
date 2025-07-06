<?php

use App\Http\Controllers\BookController;


Route::prefix('books')->controller(BookController::class)->group(function () {
    Route::post('/', 'store');
    Route::delete('/{id}', 'destroy');
    Route::put('/author/{id}', 'update');
    Route::get('/', 'index');
});
