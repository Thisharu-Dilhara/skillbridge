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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('company_name');
            $table->string('position');
            $table->string('location')->nullable();
            $table->string('job_link', 2048)->nullable();
            $table->string('salary_range')->nullable();
            $table->enum('status', [
                'saved',
                'applied',
                'interview',
                'technical_test',
                'offer',
                'rejected',
            ])->default('saved');
            $table->date('applied_date')->nullable();
            $table->datetime('interview_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
