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
        const billingService = this.app.service('billings');
        const accessToken = params.accessToken;
        const facilityId = params.query.facilityId;
        const searchText = params.query.search;
        const cQuery = params;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Check if this is a search.
                if (searchText !== undefined) {
                    // Get all person ids in a facility from the patients service.
                    let patients = await patientService.find({ query: { facilityId: facilityId, $select: ['personId'] } });
                    if (patients.data.length > 0) {
                        // Filter only the personIds from the returned patients array.
                        const personIds = patients.data.map(x => x.personId);
                        // Use the filtered personIds and the search text to search the people service.
                        let people = await peopleService.find({
                            query: {
                                '_id': { $in: personIds },
                                $or: [
                                    { firstName: { $regex: searchText, '$options': 'i' } },
                                    { lastName: { $regex: searchText, '$options': 'i' } },
                                    { apmisId: { $regex: searchText, '$options': 'i' } },
                                    { email: { $regex: searchText, '$options': 'i' } },
                                    { otherNames: { $regex: searchText, '$options': 'i' } }
                                ]
                            }
                        });

                        if (people.data.length > 0) {
                            // Filter only the personIds from the returned patients array.
                            const personIds = people.data.map(x => x._id);
                            // Get all patient ids in a facility from the patients service that has been searched for.
                            let patients = await patientService.find({ query: { 'personId': { $in: personIds }, facilityId: facilityId } });
                            // Filter only the personIds from the returned patients array.
                            const patientIds = patients.data.map(x => x._id);

                            let requests = await requestService.find({
                                query: { facilityId: facilityId, patientId: { $in: patientIds } }
                            });

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

                                    if (request.billingId !== undefined) {
                                        const billing = await billingService.find({
                                            query: {
                                                facilityId: facilityId,
                                                '_id': request.billingId._id,
                                                patientId: request.patientId
                                            }
                                        });
                                        if (billing.data.length > 0) {
                                            const billingItem = billing.data[0];
                                            billingItem.billItems.forEach(billItem => {
                                                request.isPaid = billItem.paymentCompleted;
                                                request.isWaved = (billItem.isServiceEnjoyed === true && billItem.paymentCompleted === false) ? true : false;
                                            });
                                        }
                                    }

                                    counter++;
                                }

                                if (rLength === counter) {
                                    return jsend.success(requests);
                                }
                            } else {
                                return jsend.success([]);
                            }
                        } else {
                            return jsend.success([]);
                        }
                    }
                } else {
                    // This block of code is to get all requests.
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

                            if (request.billingId !== undefined) {
                                const billing = await billingService.find({
                                    query: {
                                        facilityId: facilityId,
                                        '_id': request.billingId._id,
                                        patientId: request.patientId
                                    }
                                });

                                if (billing.data.length > 0) {
                                    const billingItem = billing.data[0];
                                    billingItem.billItems.forEach(billItem => {
                                        request.isPaid = billItem.paymentCompleted;
                                        request.isWaved = (billItem.isServiceEnjoyed === true && billItem.paymentCompleted === false) ? true : false;
                                    });
                                }
                            }

                            counter++;
                        }

                        if (rLength === counter) {
                            return jsend.success(requests);
                        }
                    } else {
                        return jsend.success([]);
                    }
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
        const patientService = this.app.service('patients');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const patientId = data.patientId;
        const investigations = data.investigations;
        const labNumber = data.labNumber;
        const minorLocationId = data.minorLocationId;

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
                            billItem.covered = { coverType: 'wallet' },
                            billItem.totalPrice = billItem.quantity * billItem.unitPrice;
                        billItem.unitDiscountedAmount = 0;
                        billItem.totalDiscoutedAmount = 0;
                        billGroup.subTotal = billGroup.subTotal + billItem.totalPrice;
                        billGroup.grandTotal = billGroup.subTotal;
                        billGroup.billItems.push(billItem);
                    }
                });

                // Check if Lab number has been generated for this patient,
                // if not, create a new lab number for the patient in the new minorLocation.
                const getPatient = await patientService.get(patientId);

                if (getPatient._id !== undefined) {
                    getPatient.clientsNo = (getPatient.clientsNo !== undefined) ? getPatient.clientsNo : [];
                    const clientsNo = getPatient.clientsNo;

                    // Check if the patient has previous client number.
                    if (clientsNo.length > 0) {
                        if (minorLocationId !== undefined) {
                            const findPrevClientNo = clientsNo.filter(x => x.minorLocationId.toString() === minorLocationId.toString());

                            if (findPrevClientNo.length === 0) {
                                const clientNo = {
                                    clientNumber: (labNumber === undefined) ? 'N/A' : labNumber,
                                    minorLocationId: minorLocationId
                                };

                                clientsNo.push(clientNo);
                            }
                        }
                    } else if (minorLocationId !== undefined) {
                        const clientNo = {
                            clientNumber: (labNumber === undefined) ? 'N/A' : labNumber,
                            minorLocationId: minorLocationId
                        };

                        clientsNo.push(clientNo);
                    }

                    // Update the patient data with the clientNo
                    const updatePatient = await patientService.patch(getPatient._id, getPatient, {});

                    if (updatePatient._id !== undefined) {
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
                        return jsend.error('There was a problem processing this transaction.');
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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;