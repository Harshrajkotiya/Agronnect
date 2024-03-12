<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class userOfflineEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $UserStatus;

    /**
     * Create a new event instance.
     */
    public function __construct($UserData)
    {
        $this->UserStatus = $UserData;
    }

    public function broadcastWith()
    {
        return [
            'user_id' => $this->UserStatus['user_id']
        ];
    }
  
    public function broadcastOn()
    {
        return ['user_status'];
    }
  
    public function broadcastAs()
    {
        return 'user-offline';
    }
}
