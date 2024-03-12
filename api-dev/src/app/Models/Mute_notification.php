<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mute_notification extends Model
{
    use HasFactory;
    protected $table = "mute_notifications";
    
    protected $fillable = [
        "consultation_id",
        "mute_duration",
        "muted_time",
        'user_id',
        'user_type',
        'isMuted'
    ];
}
