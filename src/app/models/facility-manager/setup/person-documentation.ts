import { Document } from './document'
export interface PersonDocumentation {
    _id: string;
    facilityId: any,
    patientId: any,
    documents: Document[],
    createdAt: Date,
    updatedAt: Date
}
