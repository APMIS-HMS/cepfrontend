import { DispenseByPrescription } from './dispense-by-prescription';
import { DispenseByNoprescription } from './dispense-by-noprescription';
export interface Dispense {
    facilityId: string,
    prescription?: DispenseByPrescription,
    nonPrescription?: DispenseByNoprescription,
    storeId: string,
}