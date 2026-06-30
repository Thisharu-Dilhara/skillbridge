import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const STATUS_OPTIONS = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'technical_test', label: 'Technical Test' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
] as const;

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        position: '',
        location: '',
        job_link: '',
        salary_range: '',
        status: 'saved',
        applied_date: '',
        interview_at: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('applications.store'));
    };

    return (
        <AuthenticatedLayout
            header={
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
                        New Application
                    </h2>
                </div>
            }
        >
            <Head title="New Application" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Company Name */}
                            <div>
                                <InputLabel htmlFor="company_name" value="Company Name *" />
                                <TextInput
                                    id="company_name"
                                    className="mt-1 block w-full"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    required
                                    isFocused
                                    placeholder="e.g. Google"
                                />
                                <InputError message={errors.company_name} className="mt-2" />
                            </div>

                            {/* Position */}
                            <div>
                                <InputLabel htmlFor="position" value="Position *" />
                                <TextInput
                                    id="position"
                                    className="mt-1 block w-full"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    required
                                    placeholder="e.g. Full Stack Developer"
                                />
                                <InputError message={errors.position} className="mt-2" />
                            </div>

                            {/* Location & Salary Range */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="location" value="Location" />
                                    <TextInput
                                        id="location"
                                        className="mt-1 block w-full"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. San Francisco, CA"
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="salary_range" value="Salary Range" />
                                    <TextInput
                                        id="salary_range"
                                        className="mt-1 block w-full"
                                        value={data.salary_range}
                                        onChange={(e) => setData('salary_range', e.target.value)}
                                        placeholder="e.g. $80k - $120k"
                                    />
                                    <InputError message={errors.salary_range} className="mt-2" />
                                </div>
                            </div>

                            {/* Job Link */}
                            <div>
                                <InputLabel htmlFor="job_link" value="Job Link" />
                                <TextInput
                                    id="job_link"
                                    type="url"
                                    className="mt-1 block w-full"
                                    value={data.job_link}
                                    onChange={(e) => setData('job_link', e.target.value)}
                                    placeholder="https://..."
                                />
                                <InputError message={errors.job_link} className="mt-2" />
                            </div>

                            {/* Status & Applied Date */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <select
                                        id="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="applied_date" value="Applied Date" />
                                    <TextInput
                                        id="applied_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.applied_date}
                                        onChange={(e) => setData('applied_date', e.target.value)}
                                    />
                                    <InputError message={errors.applied_date} className="mt-2" />
                                </div>
                            </div>

                            {/* Interview Date */}
                            <div>
                                <InputLabel htmlFor="interview_at" value="Interview Date & Time" />
                                <TextInput
                                    id="interview_at"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.interview_at}
                                    onChange={(e) => setData('interview_at', e.target.value)}
                                />
                                <InputError message={errors.interview_at} className="mt-2" />
                            </div>

                            {/* Notes */}
                            <div>
                                <InputLabel htmlFor="notes" value="Notes" />
                                <textarea
                                    id="notes"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add any notes about this application..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                                <Link
                                    href={route('applications.index')}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Application'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
