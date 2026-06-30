<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_name',
        'position',
        'location',
        'job_link',
        'salary_range',
        'status',
        'applied_date',
        'interview_at',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'interview_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the job application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
