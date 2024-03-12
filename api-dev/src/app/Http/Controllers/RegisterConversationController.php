<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegisterConversation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Flugg\Responder\Responder;
use App\Events\Message;
use App\Models\Message as MessageModel;


class RegisterConversationController extends Controller
{
    protected $responder;

    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * create_conversation
     */
    public function create_conversation(Request $request)
    {   
        // Validating data...
        $validationMessage =  [
            'farmer_id.required' => 'The farmer_id field is required.',
            'specialist_id.required' => 'The specialist_id field is required.',
            'consultation_id.required' => 'The consultation_id field is required.',
            'consultation_id.unique' => 'With This consultation_id conversation is created.',
        ];

        $validator = Validator::make($request->all(), [
            'farmer_id' => 'required',
            'specialist_id' => 'required',
            'consultation_id' => 'required|unique:register_conversations',
        ],$validationMessage);

        if ($validator->fails()) {

            $errors = $validator->errors()->toArray();
            $errorResponse = '';
            
            foreach($validator->errors()->toArray() as $errorField => $errorMessage){
                $errorResponse = $errorResponse.$errorField.': '.$errorMessage[0].' , ';
            }

            return $this->responder->error('Validation failed',$errorResponse)->respond(422);

        } else {
            
            try {
                $newConversation = new RegisterConversation();
                $newConversation->farmer_id = $request->farmer_id;
                $newConversation->specialist_id = $request->specialist_id;
                $newConversation->consultation_id = $request->consultation_id;
                $newConversation->consultation_status = 'ongoing';

                if($newConversation->save()){
                    $message = new MessageModel();
                    $message->sender_id = $request->farmer_id;
                    $message->receiver_id = $request->specialist_id;
                    $message->consultation_id = $newConversation->consultation_id;
                    $message->status = "Read";
                    $message->message = $request->farmer_id.' First Message send to '.$request->specialist_id;
                    $message->save();
                    // event(new Message(request('sender_id'),$request->input('message')));
                    broadcast(new Message($message))->toOthers();
                }

                return $this->responder->success(['message' => 'Conversation Created Successfully'])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RegisterConversation $registerConversation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RegisterConversation $registerConversation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RegisterConversation $registerConversation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RegisterConversation $registerConversation)
    {
        //
    }
}
