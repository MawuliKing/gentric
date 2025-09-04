import { FIELD_TYPE } from '../generics/enums';

export interface FormSection {
    id: string;
    name: string;
    description?: string;
    order: number;
    fields: FormField[];
}

export interface FormField {
    id: string;
    type: FIELD_TYPE;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
    order: number;
    categoryId: string;
}

export interface FormFieldValue {
    fieldId: string;
    fieldType: FIELD_TYPE;
    label: string;
    value: any;
    sectionId: string;
    sectionName: string;
}

export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    projectTypeId: string;
    sections: FormSection[];
    createdAt: string;
    updatedAt: string;
}

export interface FormSubmission {
    id: string;
    templateId: string;
    projectId?: string;
    submittedBy: string;
    submittedAt: string;
    data: FormFieldValue[];
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
}
