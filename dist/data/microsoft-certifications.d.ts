export interface MicrosoftCertification {
    code: string;
    title: string;
    description: string;
    category: 'fundamentals' | 'associate' | 'expert' | 'specialty';
    level: string;
    requiredExams: string[];
    skills: string[];
    product?: string[];
    role?: string[];
    credentialType?: 'Certification' | 'Applied Skills' | 'Exam';
}
export declare const microsoftCertifications: MicrosoftCertification[];
export declare const getCertificationByCode: (code: string) => MicrosoftCertification | undefined;
export declare const getCertificationsByCategory: (category: string) => MicrosoftCertification[];
//# sourceMappingURL=microsoft-certifications.d.ts.map