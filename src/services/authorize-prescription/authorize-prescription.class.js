'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const prescriptionService = this.app.service('prescriptions');
        const billingService = this.app.service('billings');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const prescription = data;
        console.log('Data => ', data);
        console.log('Params => ', params);

        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(x => x.facilityId === facilityId);
            if (userRole.length > 0) {
                /* Create Billing for any item that has been billed */
                const billingItems = prescription.prescriptionItems.filter(x => x.isBilled);

                console.log('billingItems => ', billingItems);
                if (billingItems.length > 0) {
                    const totalCost = prescription.prescriptionItems.reduce((acc, obj) => { return acc + obj.cost; }, 0);
                    const bill = {
                        facilityId: this.facility._id,
                        patientId: this.prescriptions.patientId,
                        billItems: billingItems,
                        discount: 0,
                        subTotal: totalCost,
                        grandTotal: totalCost,
                    };

                    const createBill = await billingService.create(bill);
                    if (createBill._id !== undefined) {
                        const createPrescription = await prescriptionService.create(prescription);
                        if (createPrescription._id !== undefined) {
                            return jsend.success(createPrescription);
                        } else {
                            return jsend.error('There was a problem trying to create prescription');
                        }
                    } else {
                        return jsend.error('There was a problem trying to create prescription');
                    }
                } else {
                    try {
                        const createPrescription = await prescriptionService.create(prescription);

                        console.log(createPrescription);
                        if (createPrescription._id !== undefined) {
                            return jsend.success(createPrescription);
                        } else {
                            return jsend.error('There was a problem trying to create prescription');
                        }
                    } catch (e) {
                        console.log(e);
                        return jsend.error('There was a problem trying to create prescription');
                    }
                }
            } else {
                return jsend.error('You have not been assigned to this facility.');
            }
        } else {
            return jsend.error('You need to log in to perform this transaction');
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;