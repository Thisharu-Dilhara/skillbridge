import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { JobApplication } from '@/types';

interface DashboardStats {
    total: number;
    saved: number;
    applied: number;
    interview: number;
    technical_test: number;
    offer: number;
    rejected: number;
    upcoming_interviews: number;
}

interface Props {
    stats: DashboardStats;
    recentApplications: JobApplication[];
    upcomingInterviews: JobApplication[];
}

const statusConfig: Record<JobApplication['status'], { label: string; classes: string }> = {
    saved: { label: 'Saved', classes: 'bg-gray-100 text-gray-700 ring-gray-600/20' },
    applied: { label: 'Applied', classes: 'bg-blue-50 text-blue-700 ring-blue-700/10' },
    interview: { label: 'Interview', classes: 'bg-amber-50 text-amber-700 ring-amber-700/10' },
    technical_test: { label: 'Technical Test', classes: 'bg-purple-50 text-purple-700 ring-purple-700/10' },
    offer: { label: 'Offer', classes: 'bg-green-50 text-green-700 ring-green-600/20' },
    rejected: { label: 'Rejected', classes: 'bg-red-50 text-red-700 ring-red-600/10' },
};

function StatusBadge({ status }: { status: JobApplication['status'] }) {
    const config = statusConfig[status];
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.classes}`}>
            {config.label}
        </span>
    );
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                        {icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">{label}</dt>
                            <dd className="text-2xl font-bold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Icons as small components ---
function BriefcaseIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
    );
}

function BookmarkIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
    );
}

function PaperAirplaneIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
    );
}

function ChatBubbleIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
    );
}

function CodeBracketIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
    );
}

function TrophyIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721M16.27 9.728a6.036 6.036 0 0 1-3.77 1.395.617.617 0 0 0-.5.254c-.68.862-1.704 1.373-2.82 1.06a3.132 3.132 0 0 1-.798-.39c-.573-.393-1.132-.856-1.612-1.369" />
        </svg>
    );
}

function XCircleIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
    );
}

export default function Dashboard({ stats, recentApplications, upcomingInterviews }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('applications.index')}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            View All
                        </Link>
                        <Link
                            href={route('applications.create')}
                            className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                        >
                            + New Application
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Stat Cards */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                            Overview
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Total Applications"
                                value={stats.total}
                                icon={<BriefcaseIcon />}
                                color="bg-gray-600"
                            />
                            <StatCard
                                label="Saved"
                                value={stats.saved}
                                icon={<BookmarkIcon />}
                                color="bg-gray-500"
                            />
                            <StatCard
                                label="Applied"
                                value={stats.applied}
                                icon={<PaperAirplaneIcon />}
                                color="bg-blue-500"
                            />
                            <StatCard
                                label="Interview"
                                value={stats.interview}
                                icon={<ChatBubbleIcon />}
                                color="bg-amber-500"
                            />
                            <StatCard
                                label="Technical Test"
                                value={stats.technical_test}
                                icon={<CodeBracketIcon />}
                                color="bg-purple-500"
                            />
                            <StatCard
                                label="Offer"
                                value={stats.offer}
                                icon={<TrophyIcon />}
                                color="bg-green-500"
                            />
                            <StatCard
                                label="Rejected"
                                value={stats.rejected}
                                icon={<XCircleIcon />}
                                color="bg-red-500"
                            />
                            <StatCard
                                label="Upcoming Interviews"
                                value={stats.upcoming_interviews}
                                icon={<CalendarIcon />}
                                color="bg-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Two-Column Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Recent Applications */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900">Recent Applications</h3>
                                    <Link
                                        href={route('applications.index')}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                    >
                                        View all →
                                    </Link>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentApplications.length === 0 ? (
                                    <div className="px-6 py-10 text-center">
                                        <p className="text-sm text-gray-500">No applications yet.</p>
                                        <Link
                                            href={route('applications.create')}
                                            className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Create your first application →
                                        </Link>
                                    </div>
                                ) : (
                                    recentApplications.map((app) => (
                                        <Link
                                            key={app.id}
                                            href={route('applications.show', app.id)}
                                            className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {app.position}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {app.company_name}
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <StatusBadge status={app.status} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Upcoming Interviews */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="text-base font-semibold text-gray-900">Upcoming Interviews</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {upcomingInterviews.length === 0 ? (
                                    <div className="px-6 py-10 text-center">
                                        <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">No upcoming interviews scheduled.</p>
                                    </div>
                                ) : (
                                    upcomingInterviews.map((app) => (
                                        <Link
                                            key={app.id}
                                            href={route('applications.show', app.id)}
                                            className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {app.position}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {app.company_name}
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0 text-right">
                                                    <p className="text-sm font-medium text-indigo-600">
                                                        {formatDateTime(app.interview_at)}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatDate(app.interview_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
