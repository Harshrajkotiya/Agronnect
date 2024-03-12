<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private $conversation;
  
    public function __construct($MessageModel)
    {
        $this->conversation = $MessageModel;
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->conversation['id'],
            'message' => $this->conversation['message'],
            'media_files' => $this->conversation['media_files'],
            'status' => $this->conversation['status'],
            'sender_id' => $this->conversation['sender_id'],
            'consultation_id' => $this->conversation['consultation_id'],
            'receiver_id' => $this->conversation['receiver_id'],
            'replyMessageId' => $this->conversation['replay_message_id'],
            'created_at' => $this->conversation['created_at'],
        ];
    }
  
    public function broadcastOn()
    {
        return ['conversation.' . $this->conversation['consultation_id']];
    }
  
    public function broadcastAs()
    {
        return 'message';
    }
}
