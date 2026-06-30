<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with analytics.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $applications = $user->jobApplications();

        // Status counts
        $statusCounts = $user->jobApplications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $stats = [
            'total' => array_sum($statusCounts),
            'saved' => $statusCounts['saved'] ?? 0,
            'applied' => $statusCounts['applied'] ?? 0,
            'interview' => $statusCounts['interview'] ?? 0,
            'technical_test' => $statusCounts['technical_test'] ?? 0,
            'offer' => $statusCounts['offer'] ?? 0,
            'rejected' => $statusCounts['rejected'] ?? 0,
        ];

        // Upcoming interviews
        $upcomingInterviews = $user->jobApplications()
            ->whereNotNull('interview_at')
            ->where('interview_at', '>=', now())
            ->orderBy('interview_at', 'asc')
            ->get();

        $stats['upcoming_interviews'] = $upcomingInterviews->count();

        // Recent 5 applications
        $recentApplications = $user->jobApplications()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'upcomingInterviews' => $upcomingInterviews,
        ]);
    }
}
