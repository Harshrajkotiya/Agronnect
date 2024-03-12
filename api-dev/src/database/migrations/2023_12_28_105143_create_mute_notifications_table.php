<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mute_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('mute_duration');
            $table->timestamp('muted_time');
            $table->bigInteger('user_id');
            $table->bigInteger('consultation_id');
            $table->string('user_type');
            $table->boolean('isMuted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mute_notifications');
    }
};
