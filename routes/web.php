<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResumeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('applications', JobApplicationController::class);

    // Resume routes (nested under applications)
    Route::post('/applications/{application}/resumes', [ResumeController::class, 'store'])->name('resumes.store');
    Route::get('/applications/{application}/resumes/{resume}/download', [ResumeController::class, 'download'])->name('resumes.download');
    Route::delete('/applications/{application}/resumes/{resume}', [ResumeController::class, 'destroy'])->name('resumes.destroy');
});

require __DIR__.'/auth.php';
