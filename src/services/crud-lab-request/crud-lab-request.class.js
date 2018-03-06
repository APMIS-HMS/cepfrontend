/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        let requestService = this.app.service('laboratory-requests');
        const patientService = this.app.service('patients');
        const peopleService = this.app.service('people');
        const employeeService = this.app.service('employees');
        const accessToken = params.accessToken;
        const facilityId = params.query.facilityId;
        const cQuery = params;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Get workbenches
                let requests = await requestService.find(cQuery);
                if (requests.data.length > 0) {
                    requests = requests.data;
                    const rLength = requests.length;
                    let i = requests.length;
                    let counter = 0;

                    while (i--) {
                        const request = requests[i];
                        const patientId = request.patientId;
                        const employeeId = request.createdBy;
                        const patient = await patientService.get(patientId);
                        delete patient.personDetails.wallet;
                        request.personDetails = patient.personDetails;
                        const employee = await employeeService.get(employeeId);
                        delete employee.personDetails.wallet;
                        request.employeeDetails = employee.personDetails;

                        counter++;
                    }

                    if (rLength === counter) {
                        return jsend.success(requests);
                    }
                } else {
                    return jsend.success([]);
                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
        }
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const requestService = this.app.service('laboratory-requests');
        const billingService = this.app.service('billings');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const patientId = data.patientId;
        const investigations = data.investigations;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Billing Model
                const billGroup = {
                    discount: 0,
                    facilityId: facilityId,
                    grandTotal: 0,
                    isWalkIn: false,
                    patientId: patientId,
                    subTotal: 0
                };
                // Billing Items
                billGroup.billItems = [];
                investigations.forEach(investigation => {
                    if (!investigation.isExternal) {
                        const billItem = {};
                        billItem.unitPrice = investigation.investigation.LaboratoryWorkbenches[0].workbenches[0].price;
                        billItem.facilityId = facilityId;
                        billItem.description = '';
                        billItem.facilityServiceId = investigation.investigation.facilityServiceId;
                        billItem.serviceId = investigation.investigation.serviceId;
                        billItem.itemName = investigation.investigation.name;
                        billItem.patientId = patientId;
                        billItem.quantity = 1;
                        billItem.isBearerConfirmed = true,
                        billItem.covered = {
                            coverType: 'wallet'
                        },
                        billItem.totalPrice = billItem.quantity * billItem.unitPrice;
                        billItem.unitDiscountedAmount = 0;
                        billItem.totalDiscoutedAmount = 0;
                        billGroup.subTotal = billGroup.subTotal + billItem.totalPrice;
                        billGroup.grandTotal = billGroup.subTotal;
                        billGroup.billItems.push(billItem);
                    }
                });

                if (billGroup.billItems.length > 0) {
                    const saveBilling = await billingService.create(billGroup);
                    if (saveBilling._id !== undefined) {
                        // Attach billing items before saving.
                        data.billingId = saveBilling;
                        const saveRequest = await requestService.create(data);
                        if (saveRequest._id !== undefined) {
                            return jsend.success(saveRequest);
                        } else {
                            return jsend.error('There was a problem trying to save to billing.');
                        }
                    } else {
                        return jsend.error('There was a problem trying to save to billing.');
                    }
                } else {
                    const saveRequest = await requestService.create(data);
                    if (saveRequest._id !== undefined) {
                        return jsend.success(saveRequest);
                    } else {
                        return jsend.error('There was a problem trying to save to billing.');
                    }
                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({
            id
        });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
