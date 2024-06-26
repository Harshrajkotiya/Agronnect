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
        Schema::create('manage_media_files', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('path');
            $table->string('thumb_path')->nullable();
            $table->string('size');
            $table->integer('consultation_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manage_media_files');
    }
};
