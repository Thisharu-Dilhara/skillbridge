<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'job_link' => ['nullable', 'url', 'max:2048'],
            'salary_range' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in([
                'saved',
                'applied',
                'interview',
                'technical_test',
                'offer',
                'rejected',
            ])],
            'applied_date' => ['nullable', 'date'],
            'interview_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'resume_file' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'resume_title' => ['nullable', 'string', 'max:255'],
            'resume_version' => ['nullable', 'string', 'max:50'],
        ];
    }
}
