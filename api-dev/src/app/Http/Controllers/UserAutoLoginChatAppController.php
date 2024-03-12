<?php

namespace App\Http\Controllers;

use Flugg\Responder\Responder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Auth\GenericUser;

class UserAutoLoginChatAppController extends Controller
{
    protected $responder;
    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
    }

    public function userLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required'
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
                
                if(!Auth::check()){
                    // Check if the email already exists
                    $user = User::where('email', request('email'))->first();
                    
                    if (!$user) {
                        // Email does not exist, so insert a new user
                        $user = User::create([
                            'email' => request('email'),
                            'password' => Hash::make(request('email')),
                        ]);
                    }
    
                    if (!Auth::attempt(['email'=>request('email'),'password'=>request('email')])) {
                        return $this->responder->error(['message' => 'failed_to_login_at_chat_system'])->respond(500);
                    } else {
                        return $this->responder->success(['message' => 'login_success'])->respond(200);
                    }
                }
                
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    public function getLoggedInUserDetails(Request $request){
        if(Auth::check()){
            $user = Auth::user();
            // $userDetails = [
            //     'user_id' => $user->id,
            // ];
            return ['id' => $user->id];
            // return $this->responder->success(['user_details'=>$userDetails])->respond(200);
        } else {
            // Check if the email already exists
            $user = User::where('email', request('email'))->first();
                    
            if (!$user) {
                // Email does not exist, so insert a new user
                $user = User::create([
                    'email' => request('email'),
                    'password' => Hash::make(request('email')),
                ]);
            }

            if (!Auth::attempt(['email'=>request('email'),'password'=>request('email')])) {
                return $this->responder->error(['message' => 'failed_to_login_at_chat_system'])->respond(500);
            } else {
                $user = Auth::user();
                // $userDetails = [
                //     'user_id' => $user->id,
                // ];
                return ['id' => $user->id];
                // return $this->responder->success(['user_details'=>$userDetails])->respond(200);
            }
            return $this->responder->success(['mes'=>"no user found"])->respond(200);
        }
    }
}
