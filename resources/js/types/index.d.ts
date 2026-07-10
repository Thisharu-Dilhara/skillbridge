export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface JobApplication {
    id: number;
    user_id: number;
    company_name: string;
    position: string;
    location: string | null;
    job_link: string | null;
    salary_range: string | null;
    status: 'saved' | 'applied' | 'interview' | 'technical_test' | 'offer' | 'rejected';
    applied_date: string | null;
    interview_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    resumes?: Resume[];
}

export interface Resume {
    id: number;
    user_id: number;
    job_application_id: number;
    title: string;
    version: string | null;
    file_path: string;
    original_filename: string;
    file_size: number;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
