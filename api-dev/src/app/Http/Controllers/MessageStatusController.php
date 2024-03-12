<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageStatusUpdateEvent;
use App\Models\Message as MessageModel;
use Flugg\Responder\Responder;
use Illuminate\Support\Facades\Validator;

class MessageStatusController extends Controller
{
    protected $responder;

    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }

    /**
     * Updating Message sent to delivered
     */
    public function messageStatusUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message_id' => 'required',
            'message_status' => 'required',
            'consultation_id' => 'required'
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
                $messageIds = (array) $request->message_id;

                // Use the "whereIn" method to update conversations with the specified IDs
                MessageModel::whereIn('id', $messageIds)
                    ->update(['status' => $request->message_status]);

                $broadcast = [
                    'id' => $messageIds,
                    'status' => $request->message_status,
                    'consultation_id' => $request->consultation_id
                ];

                broadcast(new MessageStatusUpdateEvent($broadcast));

                return $this->responder->success(['message' => 'Message Status Updated Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    /**
     * Updating Message sent to received
     */
    public function messageStatusUpdateWithOutInterptUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
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
                MessageModel::where('receiver_id', $request->user_id)
                    ->where('status', 'Sent')
                    ->update(['status' => 'Receive']);

                return $this->responder->success(['message' => 'Message Status Updated Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }
}
