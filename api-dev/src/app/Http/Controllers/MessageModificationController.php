<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message as MessageModel;
use App\Models\MessageHistory;
use Illuminate\Support\Facades\Validator;
use Flugg\Responder\Responder;
use App\Events\SearchEvent;
use App\Events\messageUpdateEvent;
use App\Events\messageDeleteEvent;

class MessageModificationController extends Controller
{
    protected $responder;

    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }

    /**
     * Update the specified Message.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message_id' => 'required',
            'message' => 'required',
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
                
                $MessageHistory = new MessageHistory();
                $MessageHistory->message = $request->input('message');
                $MessageHistory->message_id = $request->input('message_id');
                $MessageHistory->save();
                
                $MessageUpdateEvent = [
                    'id' => $MessageHistory->id,
                    'message' => $request->input('message'),
                    'message_id' => $request->input('message_id'),  
                    'consultation_id' => $request->input('consultation_id'),  
                ];
                
                broadcast(new messageUpdateEvent($MessageUpdateEvent))->toOthers();
                return $this->responder->success(['message' => 'Message Updated Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    /**
     * Remove the specified Message.
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message_id' => 'required',
            'consultation_id' => 'required',
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
                MessageModel::whereIn('id',$request->input('message_id'))->delete();
                $deleteBroadcastData = [
                    'message_id' => $request->input('message_id'),  
                    'consultation_id' => $request->input('consultation_id'),  
                ];
                

                broadcast(new messageDeleteEvent($deleteBroadcastData))->toOthers();
                return $this->responder->success(['message' => 'Message Deleted Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    /**
     * Search the Message.
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('message');
            $message = MessageModel::where('message', 'like', '%' . $query . '%')
                ->Where('consultation_id', $request->input('consultation_id'))
                ->get()->toArray();
    
            //broadcast search results with Pusher channels
            event(new SearchEvent($message));
        
            return $this->responder->success(['message' => 'Message Search Completed Successfully','data'=>$message])->respond(200);
        } catch (\Exception $e) {
            return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
        }
    }
}
