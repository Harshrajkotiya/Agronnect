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
        Schema::create('manage_user_statuses', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->enum('user_status',['online','offline','in call']);
            $table->integer('active_chat_id')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'user_status','active_chat_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manage_user_statuses');
    }
};
