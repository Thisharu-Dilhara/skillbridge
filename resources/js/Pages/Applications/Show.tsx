import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, FormEvent } from 'react';
import { JobApplication, Resume } from '@/types';

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

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{children}</dd>
        </div>
    );
}

function ResumesSection({ application }: { application: JobApplication }) {
    const resumes = application.resumes || [];
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        version: '',
        file: null as File | null,
    });

    const deleteForm = useForm({});
    const fileInput = useRef<HTMLInputElement>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('resumes.store', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
        });
    };

    const deleteResume = () => {
        if (!resumeToDelete) return;
        deleteForm.delete(route('resumes.destroy', [application.id, resumeToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => setResumeToDelete(null),
        });
    };

    return (
        <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumes</h3>
                <p className="mt-1 text-sm text-gray-500">Manage resumes submitted for this application.</p>
            </div>

            <div className="px-6 py-6">
                {/* Upload Form */}
                <form onSubmit={submit} className="mb-8 rounded-md bg-gray-50 p-4 border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Upload New Resume</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <InputLabel htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Software Engineer Resume"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="version" value="Version (Optional)" />
                            <TextInput
                                id="version"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.version}
                                onChange={(e) => setData('version', e.target.value)}
                                placeholder="e.g. v1.2"
                            />
                            <InputError message={errors.version} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="file" value="PDF File (Max: 5MB)" />
                            <input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100"
                                ref={fileInput}
                                onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            />
                            <InputError message={errors.file} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <PrimaryButton disabled={processing || !data.file || !data.title}>
                            {processing ? 'Uploading...' : 'Upload Resume'}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Resumes List */}
                {resumes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No resumes uploaded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {resumes.map((resume) => (
                                    <tr key={resume.id}>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{resume.title}</div>
                                            {resume.version && (
                                                <div className="text-xs text-gray-500">Version: {resume.version}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]" title={resume.original_filename}>
                                            {resume.original_filename}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatFileSize(resume.file_size)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(resume.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a
                                                href={route('resumes.download', [application.id, resume.id])}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Download
                                            </a>
                                            <button
                                                onClick={() => setResumeToDelete(resume)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal show={resumeToDelete !== null} onClose={() => setResumeToDelete(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Delete this resume?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete <span className="font-semibold">{resumeToDelete?.title}</span>? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setResumeToDelete(null)}>Cancel</SecondaryButton>
                        <DangerButton onClick={deleteResume} disabled={deleteForm.processing}>
                            {deleteForm.processing ? 'Deleting...' : 'Delete Resume'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
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

                    <ResumesSection application={application} />
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
