<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mute_notification;
use Flugg\Responder\Responder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class NotificationController extends Controller
{
    protected $responder;

    // Inilization of Responder to class variable...
    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }

    /**
     * Mute the User Notification.
     */
    public function muteNotification(Request $request){

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_type' => 'required',
            'consultation_id' => 'required',
            'mute_duration' => 'required',
        ]);
    
        if ($validator->fails()) {
            $errors = $validator->errors()->toArray();
            $errorResponse = '';
    
            foreach($validator->errors()->toArray() as $errorField => $errorMessage){
                $errorResponse = $errorResponse.$errorField.': '.$errorMessage[0].' , ';
            }
    
            return $this->responder->error('Validation failed', $errorResponse)->respond(422);
        } else {
            try {
                $data = Mute_notification::updateOrCreate(
                    [
                        'user_id' => $request->user_id,
                        'consultation_id' => $request->consultation_id,
                    ],
                    [
                        'user_type' => $request->user_type,
                        'mute_duration' => $request->mute_duration,
                        'isMuted' => 1,
                    ]
                );
    
                if ($data) {
                    return $this->responder->success(['message' => 'Chat Muted Successfully'])->respond(200);
                } else {
                    return $this->responder->success(['message' => 'Something Went Wroung Please Try Again'])->respond(200);
                }
    
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error', $e->getMessage())->respond(500);
            }
        }
    }
    
    /**
     * UnMute the User Notification.
     */
    public function unMuteNotification(Request $request){
        $validationMessage =  [
            'consultation_id.required' => 'The consultation_id field is required.',
        ];
 
        $validator = Validator::make($request->all(), [
            'consultation_id' => 'required',
        ],$validationMessage);
 
        if ($validator->fails()) {
 
            $errors = $validator->errors()->toArray();
            $errorResponse = '';
           
            foreach($validator->errors()->toArray() as $errorField => $errorMessage){
                $errorResponse = $errorResponse.$errorField.': '.$errorMessage[0].' , ';
            }
            return $this->responder->error('Validation failed',$errorResponse)->respond(422);
        } else {
            $userData = Mute_notification::where('consultation_id', request('consultation_id'))->first();

            if(!$userData){
                return $this->responder->success(['message' => 'No Users Found'])->respond(200); 
            }
            try {
                $CurrentTime = Carbon::now();
 
                $userData->update([
                    'isMuted'=> 0 
                ]);
 
                if($userData){
                    return $this->responder->success(['message' => 'Conversation Unmuted Successfully'])->respond(200);
                } else {
                    return $this->responder->error('Something Went Wrong at Server Please Try Again')->respond(500);    
                }
 
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            }
        }
    }

    /**
     * List Of Mute User...
     */
    public function getMuteConversationsList(){
        try {
            $MuteConversations = Mute_notification::select('consultation_id','isMuted','muted_time','mute_duration')->get();
            return $this->responder->success(['muted_conversations_list'=>$MuteConversations])->respond(200);
        } catch (\Exception $e) {
            return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
        }
    }
}
