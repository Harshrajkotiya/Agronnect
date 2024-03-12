<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\MessageHistory;

class Message extends Model
{
    use HasFactory;
    protected $guarded=[];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function messageHistory()
    {
        return $this->hasMany(MessageHistory::class);
    }
}
