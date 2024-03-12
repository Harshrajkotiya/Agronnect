<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SearchEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private $conversation;

    /**
     * Create a new event instance.
     */
    public function __construct($Message)
    {
        $this->conversation = $Message;
    }

    public function broadcastWith()
    {
        return $this->conversation;
    }
  
    public function broadcastOn()
    {
        return ['chat'];
    }
  
    public function broadcastAs()
    {
        return 'searchResults';
    }
}
