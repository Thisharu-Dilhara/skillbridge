<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Requests\UpdateJobApplicationRequest;
use App\Models\JobApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of the user's job applications.
     */
    public function index(Request $request): Response
    {
        $applications = $request->user()
            ->jobApplications()
            ->latest()
            ->get();

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Show the form for creating a new job application.
     */
    public function create(): Response
    {
        return Inertia::render('Applications/Create');
    }

    /**
     * Store a newly created job application.
     */
    public function store(StoreJobApplicationRequest $request): RedirectResponse
    {
        $application = $request->user()->jobApplications()->create(
            $request->safe()->except(['resume_file', 'resume_title', 'resume_version'])
        );

        if ($request->hasFile('resume_file')) {
            $file = $request->file('resume_file');
            $path = $file->store("resumes/{$application->id}", 'local');

            $application->resumes()->create([
                'user_id' => $request->user()->id,
                'title' => $request->validated('resume_title') ?? 'Resume',
                'version' => $request->validated('resume_version'),
                'file_path' => $path,
                'original_filename' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
            ]);
        }

        return Redirect::route('applications.show', $application)
            ->with('success', 'Job application created successfully.');
    }

    /**
     * Display the specified job application.
     */
    public function show(JobApplication $application): Response
    {
        $this->authorizeAccess($application);

        $application->load('resumes');

        return Inertia::render('Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Show the form for editing the specified job application.
     */
    public function edit(JobApplication $application): Response
    {
        $this->authorizeAccess($application);

        return Inertia::render('Applications/Edit', [
            'application' => $application,
        ]);
    }

    /**
     * Update the specified job application.
     */
    public function update(UpdateJobApplicationRequest $request, JobApplication $application): RedirectResponse
    {
        $this->authorizeAccess($application);

        $application->update($request->validated());

        return Redirect::route('applications.show', $application)
            ->with('success', 'Job application updated successfully.');
    }

    /**
     * Remove the specified job application.
     */
    public function destroy(JobApplication $application): RedirectResponse
    {
        $this->authorizeAccess($application);

        $application->delete();

        return Redirect::route('applications.index')
            ->with('success', 'Job application deleted successfully.');
    }

    /**
     * Ensure the authenticated user owns the job application.
     */
    private function authorizeAccess(JobApplication $application): void
    {
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
