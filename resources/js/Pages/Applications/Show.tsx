import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
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
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${config.classes}`}
        >
            {config.label}
        </span>
    );
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatDateTime(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{children}</dd>
        </div>
    );
}

export default function Show({ application }: { application: JobApplication }) {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const { delete: destroy, processing } = useForm({});

    const deleteApplication = () => {
        destroy(route('applications.destroy', application.id), {
            onSuccess: () => setConfirmingDeletion(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('applications.index')}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Application Details
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('applications.edit', application.id)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Edit
                        </Link>
                        <DangerButton onClick={() => setConfirmingDeletion(true)}>
                            Delete
                        </DangerButton>
                    </div>
                </div>
            }
        >
            <Head title={`${application.position} at ${application.company_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {/* Main Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Header Section */}
                        <div className="border-b border-gray-100 px-6 py-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {application.position}
                                    </h3>
                                    <p className="mt-1 text-lg text-gray-600">
                                        {application.company_name}
                                    </p>
                                </div>
                                <StatusBadge status={application.status} />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="px-6">
                            <dl className="divide-y divide-gray-100">
                                <DetailRow label="Location">
                                    {application.location || <span className="text-gray-400">Not specified</span>}
                                </DetailRow>

                                <DetailRow label="Salary Range">
                                    {application.salary_range || <span className="text-gray-400">Not specified</span>}
                                </DetailRow>

                                <DetailRow label="Job Link">
                                    {application.job_link ? (
                                        <a
                                            href={application.job_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 transition-colors"
                                        >
                                            {application.job_link}
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Not provided</span>
                                    )}
                                </DetailRow>

                                <DetailRow label="Applied Date">
                                    {formatDate(application.applied_date)}
                                </DetailRow>

                                <DetailRow label="Interview">
                                    {formatDateTime(application.interview_at)}
                                </DetailRow>

                                <DetailRow label="Notes">
                                    {application.notes ? (
                                        <p className="whitespace-pre-wrap">{application.notes}</p>
                                    ) : (
                                        <span className="text-gray-400">No notes</span>
                                    )}
                                </DetailRow>

                                <DetailRow label="Created">
                                    {formatDate(application.created_at)}
                                </DetailRow>

                                <DetailRow label="Last Updated">
                                    {formatDate(application.updated_at)}
                                </DetailRow>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete this application?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete your application for{' '}
                        <span className="font-semibold">{application.position}</span> at{' '}
                        <span className="font-semibold">{application.company_name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeletion(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={deleteApplication} disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete Application'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
