import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { JobApplication } from '@/types';

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
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.classes}`}
        >
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

export default function Index({
    applications,
}: {
    applications: JobApplication[];
}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Job Applications
                    </h2>
                    <Link
                        href={route('applications.create')}
                        className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                    >
                        + New Application
                    </Link>
                </div>
            }
        >
            <Head title="Job Applications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {applications.length === 0 ? (
                        /* Empty State */
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                    No applications yet
                                </h3>
                                <p className="mt-2 max-w-sm text-sm text-gray-500">
                                    Start tracking your job search by creating your first application. Keep all your opportunities organized in one place.
                                </p>
                                <Link
                                    href={route('applications.create')}
                                    className="mt-6 inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                                >
                                    Create Your First Application
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Application Cards */
                        <div className="space-y-4">
                            {applications.map((application) => (
                                <div
                                    key={application.id}
                                    className="overflow-hidden bg-white shadow-sm transition-shadow duration-200 hover:shadow-md sm:rounded-lg"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={route('applications.show', application.id)}
                                                        className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                                                    >
                                                        {application.position}
                                                    </Link>
                                                    <StatusBadge status={application.status} />
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-600">
                                                    {application.company_name}
                                                </p>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                                    {application.location && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                                                            </svg>
                                                            {application.location}
                                                        </span>
                                                    )}
                                                    {application.salary_range && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                            {application.salary_range}
                                                        </span>
                                                    )}
                                                    {application.applied_date && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                            </svg>
                                                            Applied {formatDate(application.applied_date)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Link
                                                    href={route('applications.show', application.id)}
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('applications.edit', application.id)}
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
