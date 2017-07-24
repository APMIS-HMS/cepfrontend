import {PersonDocumentation } from '../../../models/facility-manager/setup/person-documentation';
export interface Documentation {
    _id: string;
    personId: any,
    documentations: PersonDocumentation[],
    createdAt: Date,
    updatedAt: Date
}
