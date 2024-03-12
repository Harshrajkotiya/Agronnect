<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\RegisterConversationController;
use App\Http\Controllers\MessageModificationController;
use App\Http\Controllers\MessageStatusController;
use App\Http\Controllers\UserStatusController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    Route::middleware(['x-api-token'])->post('register-conversations',[RegisterConversationController::class,'create_conversation']);
    
    Route::post('messages',[ChatController::class,'handleMessages']);
    Route::post('get-conversation',[ChatController::class,'getConversation']);
    Route::post('get-latest-conversation',[ChatController::class,'getLatestConversation']);
    Route::post('end-conversations',[ChatController::class,'endChat']);
    Route::post('archived-chat-user-list',[ChatController::class,'archivedChatUserList']);
    Route::post('archived-chat',[ChatController::class,'archivedChat']);
    Route::post('upload_chunk',[ChatController::class,'uploadChunk']);
    Route::post('get-mediafile',[ChatController::class,'getMediaFileFromAWS']);
    Route::post('save-voice_note',[ChatController::class,'saveVoiceNote']);
    
    Route::post('delete-message',[MessageModificationController::class,'destroy']);
    Route::post('update-message',[MessageModificationController::class,'update']);
    Route::post('search-message',[MessageModificationController::class,'search']);

    Route::post('conversations/update_message_status',[MessageStatusController::class,'messageStatusUpdate']);
    Route::post('conversations/update_messages_status',[MessageStatusController::class,'messageStatusUpdateWithOutInterptUser']);
    
    Route::post('conversations/update_user_status',[UserStatusController::class,'userStatusUpdate']);
    Route::get('conversations/online_offline_user_list',[UserStatusController::class,'onlineOfflineUserList']);
    Route::post('conversations/update_active_chat',[UserStatusController::class,'updateActiveChat']);


    Route::post('conversations/mute_notification',[NotificationController::class,'muteNotification']);
    Route::put('conversations/unmute_notification',[NotificationController::class,'unMuteNotification']);
    Route::get('get-mute-conversations',[NotificationController::class,'getMuteConversationsList']);

    Route::post('broadcasting', function () {
        return true;
    });

    Route::get('ping',function(){                                                                             
        echo 'pong';                                                                                         
    });
});