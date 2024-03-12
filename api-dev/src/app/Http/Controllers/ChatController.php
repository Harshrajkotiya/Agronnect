<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\Message;
use App\Events\sentUserToArchiveChat;
use App\Models\Message as MessageModel;
use App\Models\RegisterConversation;
use App\Models\Mute_notification;
use App\Models\ManageMediaFiles;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Thumbnail;
use Illuminate\Support\Facades\DB;

// import the Intervention Image Manager Class
use Intervention\Image\ImageManagerStatic as Image;

use Illuminate\Support\Facades\Validator;
use Flugg\Responder\Responder;

class ChatController extends Controller
{

    protected $responder;
    protected $allowed_file_types;

    public function __construct(Responder $responder)
    {
        $this->responder = $responder;
        $this->allowed_file_types = [
            'docs'           => ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'csv'],
            'images'         => ['png', 'jpg', 'jpeg','webp'],
            'videos'         => ['mp4', 'avi', 'mov'],
            'geographical'   => ['kmz', 'kml']
         ];
    }
    
    public function handleMessages(Request $request){
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required',
            'receiver_id' => 'required',
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

                $message = new MessageModel();
                $message->sender_id = request('sender_id');
                $message->receiver_id = request('receiver_id');
                $message->consultation_id = request('consultation_id');
                $message->status = request('status');
                $message->message = request('message');
                $message->replay_message_id = request('replay_message_id');
                $message->save();

                broadcast(new Message($message))->toOthers();

                return $this->responder->success(['message' => 'Message Created Successfully','data'=>$message])->respond(200);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    public function getConversation(Request $request){
        $validator = Validator::make($request->all(), [
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
                $messages = MessageModel::select('messages.*', 'register_conversations.consultation_status', 'manage_media_files.id as mediaId', 'manage_media_files.name as mediaName', 'manage_media_files.type as mediaType', 'manage_media_files.path as mediaPath', 'manage_media_files.thumb_path as mediaThumbPath', 'manage_media_files.size as mediaSize', 'manage_media_files.created_at as mediaCreatedAt', 'manage_media_files.updated_at as mediaUpdatedAt','manage_media_files.duration as duration')
                ->selectSub(function ($query) {
                    $query->select('message')
                        ->from('message_histories')
                        ->whereColumn('message_id', 'messages.id')
                        ->latest('created_at')
                        ->limit(1);
                }, 'messageEdited')
                ->join('register_conversations', 'messages.consultation_id', '=', 'register_conversations.consultation_id')
                ->leftJoin('manage_media_files', 'messages.media_files', '=', 'manage_media_files.id')
                ->where('messages.consultation_id', request('consultation_id'))
                ->get();
                
                $data = $messages->map(function ($message) {
                    return [
                        "id" => $message->id,
                        "sender_id" => $message->sender_id,
                        "receiver_id" => $message->receiver_id,
                        "message" => $message->message,
                        "media_files" => $message->media_files ? [
                            "id" => $message->mediaId,
                            "name" => $message->mediaName,
                            "type" => $message->mediaType,
                            "path" => $message->mediaPath,
                            "thumb_path" => $message->mediaThumbPath,
                            "duration" => $message->duration,
                            "size" => $message->mediaSize,
                            "created_at" => $message->mediaCreatedAt,
                            "updated_at" => $message->mediaUpdatedAt,
                        ] : null,
                        "mute" => $message->isMuted ? [
                            "isMuted" => $message->isMute,
                            "mutedTime" => $message->muted_time,
                            "muteDuration" => $message->mute_duration,
                        ]: null,
                        "messageEdited" => $message->messageEdited ? $message->messageEdited : '',
                        "replyMessageId" => $message->replay_message_id ? $message->replay_message_id : 0,
                        "consultation_id" => $message->consultation_id,
                        "status" => $message->status,
                        "created_at" => $message->created_at,
                        "updated_at" => $message->updated_at,
                    ];
                });
                return $this->responder->success($data)->respond();
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }    
    }

    public function getLatestConversation(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_type' => 'required',
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
                if(request('user_type') == 'farmer'){
                    $consultation = RegisterConversation::select('register_conversations.*')
                    ->where('farmer_id', request('user_id'))
                    ->get();

                   
             
                } else if(request('user_type') == 'specialist'){
                    $consultation = RegisterConversation::select('register_conversations.*')
                    ->where('specialist_id', request('user_id'))
                    ->get();

                
                }
              
                    
                if($consultation){
                    
                    $consultationIds = $consultation->pluck('consultation_id')->toArray();

                    // $messages = MessageModel::select(DB::raw('COUNT(status) as unread_message'),'messages.*', 'rc.consultation_status')
                    // ->join('register_conversations as rc', 'messages.consultation_id', '=', 'rc.consultation_id')
                    // ->whereIn('messages.consultation_id', $consultationIds)
                    // ->whereIn(\DB::raw('(messages.consultation_id, messages.created_at)'), function ($query) use ($consultationIds) {
                    //     $query->select(\DB::raw('consultation_id, MAX(created_at)'))
                    //         ->from('messages')
                    //         ->whereIn('consultation_id', $consultationIds)
                    //         ->whereNull('messages.deleted_at')
                    //         ->groupBy('consultation_id');
                    // })
                    // ->where('rc.consultation_status', 'ongoing')
                    // ->orderBy('messages.created_at', 'desc')
                    // ->toSql();
                    $mute_consultation = Mute_notification::select('mute_notifications.*')
                    ->whereIn('consultation_id', $consultationIds)
                    ->get();
    
                    $messages = DB::table('messages')
                    ->select(DB::raw('(
                            SELECT COUNT(*)
                            FROM messages AS unread_messages
                            WHERE
                                unread_messages.consultation_id = messages.consultation_id
                                AND unread_messages.status != "Read"
                                AND unread_messages.deleted_at IS NULL
                                AND sender_id !='. request('user_id').'
                        ) AS unread_message_count'), 'messages.*', 'rc.consultation_status','mf.type','mf.name')
                    ->join('register_conversations as rc', 'messages.consultation_id', '=', 'rc.consultation_id')
                    ->leftJoin('manage_media_files as mf', 'messages.media_files', '=', 'mf.id')
                    ->whereIn('messages.consultation_id', $consultationIds)
                    ->whereIn(DB::raw('(messages.consultation_id, messages.created_at)'), function ($query) use ($consultationIds) {
                        $query->select(DB::raw('consultation_id, MAX(created_at)'))
                            ->from('messages')
                            ->whereIn('consultation_id', $consultationIds)
                            ->whereNull('messages.deleted_at')
                            ->groupBy('consultation_id');
                    })
                    ->where('rc.consultation_status', 'ongoing')
                    ->orderBy('messages.created_at', 'desc')
                    ->get();

                    return $this->responder->success(['message'=>$messages,'consultation_details'=>$consultation, "mute_Data" => $mute_consultation])->respond();
                }
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }    
    }

    public function endChat(Request $request) {   
        // Validating data...
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
            try {
                
                $ConversationEnded = RegisterConversation::where('consultation_id', '=', request('consultation_id'))->update(['consultation_status' => 'ended']);

                if($ConversationEnded){
                    
                    broadcast(new sentUserToArchiveChat(['consultation_id' => request('consultation_id')]))->toOthers();
                    return $this->responder->success(['message' => 'Conversation Ended Successfully'])->respond(200);
                } else {
                    return $this->responder->error('Something Went Wroung at Server Please Try Again')->respond(500);    
                }

            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }

    public function archivedChatUserList(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'user_type' => 'required',
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
                $consultation = RegisterConversation::select('register_conversations.*')
                ->where('register_conversations.consultation_status', 'ended');
                if(request('user_type') == 'farmer'){
                    $consultation->where('farmer_id', request('user_id'))->get();
                } else if(request('user_type') == 'specialist'){
                    $consultation->where('specialist_id', request('user_id'))->get();
                }

                if($consultation){
                    
                    $consultationIds = $consultation->pluck('consultation_id')->toArray();
                    
                    $messages = DB::table('messages')
                    ->select('messages.*', 'register_conversations.consultation_status')
                    ->join('register_conversations', 'messages.consultation_id', '=', 'register_conversations.consultation_id')
                    ->whereIn('messages.consultation_id', $consultationIds)
                    ->leftJoin('messages as m2', function ($join) {
                        $join->on('messages.consultation_id', '=', 'm2.consultation_id')
                            ->whereNull('messages.deleted_at')
                            ->whereRaw('messages.created_at < m2.created_at');
                    })
                    ->whereNull('m2.id')
                    ->groupBy('messages.consultation_id')
                    ->orderBy('messages.created_at', 'desc')
                    ->get();
                    
                    return $this->responder->success(['message'=>$messages,'consultation_details'=>$consultation])->respond();
                }

            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }
    }    

    public function archivedChat(Request $request){
        $validator = Validator::make($request->all(), [
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
                $messages = MessageModel::select('messages.*', 'register_conversations.consultation_status')
                ->join('register_conversations', 'messages.consultation_id', '=', 'register_conversations.consultation_id')
                ->where('messages.consultation_id', request('consultation_id'))
                ->where('register_conversations.consultation_status', 'ended')
                ->get();
                return $this->responder->success($messages)->respond();
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }    
    }    

    public function uploadChunk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_of_file' => 'required',
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'consultation_id' => 'required',
            'currentChunk' => 'required',
            'totalChunks' => 'required',
            'file' => 'required',
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
                $chunk = $request->file('file');
                $fileExtension = Str::after($request->input('name_of_file'), '.');
                $currentChunk = $request->input('currentChunk');
                $totalChunks = $request->input('totalChunks');
                $uploadId = 1;
                $chunkFilename = $uploadId . '_' . $currentChunk . '.part';
                $tmb = null;

                $s3Client = new \Aws\S3\S3Client([
                    'version' => 'latest',
                    'region' => env('AWS_DEFAULT_REGION'),
                    'credentials' => [
                        'key' => env('AWS_ACCESS_KEY_ID'),
                        'secret' => env('AWS_SECRET_ACCESS_KEY')
                    ],
                ]);
                
                $bucket = env('AWS_BUCKET');

                $s3Client->putObject([
                    'Bucket' => $bucket,
                    'Key' => 'uploads/' . $chunkFilename,
                    'Body' => file_get_contents($chunk),
                    'ACL' => 'public-read',
                ]);

                if ($currentChunk == $totalChunks - 1) {
                    $mergedFile = '';
                    for ($i = 0; $i < $totalChunks; $i++) {
                        $chunkFile = $uploadId . '_' . $i . '.part';
                        $chunkData = $s3Client->getObject([
                            'Bucket' => $bucket,
                            'Key' => 'uploads/' . $chunkFile,
                        ]);

                        $mergedFile .= $chunkData['Body'];
                    }
                    $filename = $request->sender_id . '_'.Str::random(10) .'.'.$fileExtension; 
                    $path = $request->consultation_id;
                    $fullImagePath = "$path/{$filename}";
                    $fileType = '';
                    
                    if(in_array($fileExtension, $this->allowed_file_types['docs'])){
                        $fileType = 'doc';
                    }else if(in_array($fileExtension, $this->allowed_file_types['images'])){
                        $fileType = 'image';
                    }else if(in_array($fileExtension, $this->allowed_file_types['videos'])){
                        $fileType = 'video';
                    }else if(in_array($fileExtension, $this->allowed_file_types['geographical'])){
                        $fileType = 'geographical';
                    }

                    Storage::disk('s3')->put($fullImagePath, $mergedFile, 'public');

                    for ($i = 0; $i < $totalChunks; $i++) {
                        $chunkFile = $uploadId . '_' . $i . '.part';
                        $s3Client->deleteObject([
                            'Bucket' => $bucket,
                            'Key' => 'uploads/' . $chunkFile,
                        ]);
                    }

                    $fileUrl = "https://$bucket.s3.amazonaws.com/$fullImagePath";
                
                    if(in_array($fileExtension, $this->allowed_file_types['images']))
                    {
                        $tmb = $this->generateThumbnailURL($fileUrl,$fileExtension);
                    }

                    $ManageMediaFiles = new ManageMediaFiles();
                    $ManageMediaFiles->name = $request->input('name_of_file');
                    $ManageMediaFiles->type = $fileType;
                    $ManageMediaFiles->path = $fileUrl;
                    $ManageMediaFiles->thumb_path = $tmb;
                    $ManageMediaFiles->size = $request->input('size');
                    $ManageMediaFiles->consultation_id = $request->input('consultation_id');

                    if($ManageMediaFiles->save()){
                        $message = new MessageModel();
                        $message->sender_id = request('sender_id');
                        $message->receiver_id = request('receiver_id');
                        $message->consultation_id = request('consultation_id');
                        $message->consultation_id = request('consultation_id');
                        $message->replay_message_id = request('replay_message_id');
                        $message->media_files = $ManageMediaFiles->id;
                        $message->status = "Sent";
                        $message->save();

                        $mediaFileData = [
                            "id" => $ManageMediaFiles->id,
                            "name" => $ManageMediaFiles->name,
                            "type" => $ManageMediaFiles->type,
                            "path" => $ManageMediaFiles->path,
                            "thumb_path" => $ManageMediaFiles->thumb_path,
                            "size" => $ManageMediaFiles->size,
                            "consultation_id" => $ManageMediaFiles->consultation_id,
                            "created_at" => $ManageMediaFiles->created_at,
                            "updated_at" => $ManageMediaFiles->updated_at ,
                        ];

                        $loopData = [
                            "id" => $message->id,
                            "sender_id" => $message->sender_id,
                            "receiver_id" => $message->receiver_id,
                            "message" => $message->message,
                            "media_files" => $mediaFileData,
                            "consultation_id" => $message->consultation_id,
                            "replay_message_id" => $message->replay_message_id ? $message->replay_message_id : 0,
                            "status" => $message->status,
                            "created_at" => $message->created_at,
                            "updated_at" => $message->updated_at,
                            "consultation_status" => $message->consultation_status,
                        ];
                        broadcast(new Message($loopData))->toOthers();
                    }
                    return responder()->success(['message'   => 'File Uploaded Successfully']);
                }

                $response = [
                    'message' => 'Chunk uploaded successfully',
                ];

                return responder()->success($response);    
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            }
        }    
    }

    public static function generateThumbnailURL($imageUrl,$ext)
    {
        $imageUrl = str_replace('\\/', '/', $imageUrl);

        $bucket = env('AWS_BUCKET');
        $path = substr($imageUrl, strpos($imageUrl, $bucket) + strlen($bucket) + 1);

        $filename = pathinfo($path, PATHINFO_FILENAME);

        $thumbnailPath = "thumbnails/$filename.$ext";

        $thumbnail = Image::make($imageUrl)->fit(200);

        $thumbnail->stream();
        Storage::disk('s3')->put($thumbnailPath, $thumbnail, 'public');

        $thumbnailUrl = Storage::disk('s3')->url($thumbnailPath);

        return $thumbnailUrl;
    }

    public function getMediaFileFromAWS(Request $request) {
        $validator = Validator::make($request->all(), [
            'media_file_id' => 'required',
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
                $mediaFile = ManageMediaFiles::find($request->input('media_file_id'));
                return $this->responder->success($mediaFile)->respond();
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            } 
        }    
    }

    public function saveVoiceNote(Request $request){
        
        $validator = Validator::make($request->all(), [
            'audio' => 'required',
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'consultation_id' => 'required',
            'duration' => 'required',
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
                $file = $request->file('audio');
                $filename = $request->sender_id . '_'.Str::random(10) .'.webm'; 
                // $filename =  $file->getClientOriginalName(); 
                $fileExtension = 'web';
                $bucket = env('AWS_BUCKET');
                
                $path = 'voice-notes/'.$request->sender_id;
                $fullAudioFilePath = "$path/$filename";
                // $fullAudioFilePath = "$path/{$filename}";
                    
                $fullAudioFilePath = Storage::disk('s3')->put($fullAudioFilePath, $file, 'public');
        
                $fileUrl = "https://$bucket.s3.amazonaws.com/$fullAudioFilePath";
        
                $ManageMediaFiles = new ManageMediaFiles();
                $ManageMediaFiles->name = $filename;
                $ManageMediaFiles->type = 'audio';
                $ManageMediaFiles->path = $fileUrl;
                $ManageMediaFiles->thumb_path = '';
                $ManageMediaFiles->duration = $request->duration;
                $ManageMediaFiles->size = $file->getSize();
                $ManageMediaFiles->consultation_id = $request->input('consultation_id');
                // $ManageMediaFiles->save();

                if($ManageMediaFiles->save()){
                    $message = new MessageModel();
                    $message->sender_id = request('sender_id');
                    $message->receiver_id = request('receiver_id');
                    $message->consultation_id = request('consultation_id');
                    $message->replay_message_id = request('replay_message_id');
                    $message->media_files = $ManageMediaFiles->id;
                    $message->status = "Sent";
                    $message->save();
                    
                    $mediaFileData = [
                        "id" => $ManageMediaFiles->id,
                        "name" => $ManageMediaFiles->name,
                        "type" => $ManageMediaFiles->type,
                        "path" => $ManageMediaFiles->path,
                        "thumb_path" => $ManageMediaFiles->thumb_path,
                        "size" => $ManageMediaFiles->size,
                        "duration" => $ManageMediaFiles->duration,
                        "consultation_id" => $ManageMediaFiles->consultation_id,
                        "created_at" => $ManageMediaFiles->created_at,
                        "updated_at" => $ManageMediaFiles->updated_at ,
                    ];
    
                    $loopData = [
                        "id" => $message->id,
                        "sender_id" => $message->sender_id,
                        "receiver_id" => $message->receiver_id,
                        "message" => $message->message,
                        "media_files" => $mediaFileData,
                        "consultation_id" => $message->consultation_id,
                        "replay_message_id" => $message->replay_message_id ? $message->replay_message_id : 0,
                        "status" => $message->status,
                        "created_at" => $message->created_at,
                        "updated_at" => $message->updated_at,
                        "consultation_status" => $message->consultation_status,
                    ];
                    broadcast(new Message($loopData))->toOthers();
                }
                return responder()->success(['message'   => 'Audio Note saved successfully']);
            } catch (\Exception $e) {
                return $this->responder->error('Internal Server Error',$e->getMessage())->respond(500);
            }
        }
    }
}
