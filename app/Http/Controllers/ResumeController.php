<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResumeRequest;
use App\Models\JobApplication;
use App\Models\Resume;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResumeController extends Controller
{
    /**
     * Store a newly uploaded resume.
     */
    public function store(StoreResumeRequest $request, JobApplication $application): RedirectResponse
    {
        $file = $request->file('file');
        $path = $file->store("resumes/{$application->id}", 'local');

        $application->resumes()->create([
            'user_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'version' => $request->validated('version'),
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
        ]);

        return Redirect::route('applications.show', $application)
            ->with('success', 'Resume uploaded successfully.');
    }

    /**
     * Download a resume file.
     */
    public function download(JobApplication $application, Resume $resume): StreamedResponse
    {
        $this->authorizeAccess($resume);

        if (!Storage::disk('local')->exists($resume->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('local')->download($resume->file_path, $resume->original_filename);
    }

    /**
     * Delete a resume.
     */
    public function destroy(JobApplication $application, Resume $resume): RedirectResponse
    {
        $this->authorizeAccess($resume);

        Storage::disk('local')->delete($resume->file_path);
        $resume->delete();

        return Redirect::route('applications.show', $application)
            ->with('success', 'Resume deleted successfully.');
    }

    /**
     * Ensure the authenticated user owns the resume.
     */
    private function authorizeAccess(Resume $resume): void
    {
        if ($resume->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
