<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Auth\GenericUser;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Route::post('v1/broadcasting/auth', function () {
    return  "OK called";
    $user = new GenericUser(['id' => microtime()]);

    request()->setUserResolver(function () use ($user) {
        return $user;
    });

    return Broadcast::auth(request());
})->middleware(['cors']);

Broadcast::channel('userStatus', function ($user) {
    // return $user;
    return ['id' => $user->id];
    // return true;
 })->middleware(['cors']);