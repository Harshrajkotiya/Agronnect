<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\ManageUserStatus as statusUpdateEvent;
use App\Events\UpdateActiveChatEvent;
use App\Events\userOnlineEvent;
use App\Events\userOfflineEvent;
use App\Models\ManageUserStatus;
use App\Models\RegisterConversation;
use Flugg\Responder\Responder;
use Illuminate\Support\Facades\Validator;

class UserStatusController extends Controller
{
    protected $responder;

    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }

    /**
     * Updating Message sent to delivered
     */
    public function userStatusUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            $errors = $validator->errors()->toArray();
            $errorResponse = '';
            
            foreach($validator->errors()->toArray() as $errorField => $errorMessage){
                $errorResponse = $errorResponse.$errorField.': '.$errorMessage[0].' , ';
            }

            return $this->responder->error('Validation failed',$errorResponse)->respond(422);
        } else {
            
            try {
                $ManageUserStatus = ManageUserStatus::select('id','user_id','user_status')->where('user_id',request('user_id'))->first();

                if($ManageUserStatus){
                    $ManageUserStatus->user_status = request('status');
                    
                    if(request('chatId')){
                        $ManageUserStatus->active_chat_id = request('chatId');
                    }
                    $ManageUserStatus->save();
                } else {
                    $ManageUserStatus = new ManageUserStatus();
                    $ManageUserStatus->user_id = request('user_id');
                    $ManageUserStatus->user_status = request('status');
                    
                    if(request('chatId')){
                        $ManageUserStatus->active_chat_id = request('chatId');
                    }
                    $ManageUserStatus->save();
                }
                $ManageUserStatus->user_status = request('status');
                $ManageUserStatus->save();

                if(strtolower(request('status')) == "online"){
                    broadcast(new userOnlineEvent($ManageUserStatus))->toOthers();
                } else if(strtolower(request('status')) == "offline"){
                    broadcast(new userOfflineEvent($ManageUserStatus))->toOthers();
                }
                broadcast(new statusUpdateEvent($ManageUserStatus))->toOthers();

                return $this->responder->success(['message' => 'User Status Updated Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    public function onlineOfflineUserList(){
        try {
            $ManageUserStatus = ManageUserStatus::select('user_id','user_status','active_chat_id')->get();
            return $this->responder->success(['message' => 'User Status Updated Successfully','user_list'=>$ManageUserStatus])->respond(200);
        } catch (\Exception $e) {
            return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
        }
    }

    public function updateActiveChat(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'chatId' => 'required',
        ]);

        if ($validator->fails()) {

            $errors = $validator->errors()->toArray();
            $errorResponse = '';
            
            foreach($validator->errors()->toArray() as $errorField => $errorMessage){
                $errorResponse = $errorResponse.$errorField.': '.$errorMessage[0].' , ';
            }

            return $this->responder->error('Validation failed',$errorResponse)->respond(422);
        } else {
            try {
                $ManageUserStatus = ManageUserStatus::select('*')->where('user_id',request('user_id'))->get()->first();

                
                if($ManageUserStatus){
                    $ManageUserStatus->active_chat_id = request('chatId');
                    $ManageUserStatus->save();
                    
                    $Conversation = RegisterConversation::select('id')->where('consultation_id',request('chatId'))->get()->first();
                    
                    $broadcastData =[
                        'user_id' => $ManageUserStatus['user_id'],
                        'status' => $ManageUserStatus['user_status'],
                        'ChatId' => $ManageUserStatus['active_chat_id'],
                    ];
                    
                    $broadcastData['isInSameConversationChannel'] = $Conversation ? true : false;
                 
                    broadcast(new UpdateActiveChatEvent($broadcastData))->toOthers();
                    return $this->responder->success(['message' => 'User Active Chat Updated Successfully'])->respond(200);
                } else {
                    return $this->responder->success(['message' => 'Userid Not Found'])->respond(200);
                }

            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            }
        }     
    }
}

