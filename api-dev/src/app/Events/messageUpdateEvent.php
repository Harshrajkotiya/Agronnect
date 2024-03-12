<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class messageUpdateEvent implements ShouldBroadcast
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
            'new_message' => $this->conversation['message'],
            'message_id' => $this->conversation['message_id'],
            'consultation_id' => $this->conversation['consultation_id'],
        ];
    }
  
    public function broadcastOn()
    {
        return ['conversation.' . $this->conversation['consultation_id']];
    }
  
    public function broadcastAs()
    {
        return 'messageUpdateEvent';
    }
}
