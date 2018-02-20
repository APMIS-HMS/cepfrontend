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

    async find(params) {
        // // Get inpatient
        // console.log('-------- params ----------');
        // console.log(params);
        // console.log('-------- End params ----------');
        // const inPatientListService = this.app.service('inpatient-waiting-lists');
        // const patientService = this.app.service('patients');
        // const locationService = this.app.service('locations');
        // const employeeService = this.app.service('employees');
        // const facilityId = params.query.facilityId;
        // const action = params.query;

        // //Check for facility Id
        // if (facilityId !== undefined) {
        //     let prescriptions = await inPatientListService.find({ query: { facilityId: facilityId } });

        //     const pLength = prescriptions.data.length;
        //     let i = prescriptions.data.length;
        //     let counter = 0;
        //     if (pLength === 0) {
        //         return jsend.success([]);
        //     } else if (pLength > 0) {
        //         prescriptions = prescriptions.data;
        //         while (i--) {
        //             let prescription = prescriptions[i];
        //             let patientId = prescription.patientId;
        //             let employeeId = prescription.employeeId;

        //             const patient = await patientService.get(patientId);
        //             delete patient.personDetails.wallet;
        //             prescription.personDetails = patient.personDetails;
        //             let employee = await employeeService.get(employeeId);
        //             delete employee.personDetails.wallet;
        //             prescription.employeeDetails = employee.personDetails;
        //             counter++;
        //         }
        //         if (pLength === counter) {
        //             return jsend.success(prescriptions);
        //         }
        //     } else {
        //         return jsend.error('Prescription not properly referenced!');
        //     }
        // } else {
        //     return jsend.error('Facility does not exist!');
        // }
    }

    async get(data, params) {
        // Get inpatient
        console.log('-------- data ----------');
        console.log(data);
        console.log('-------- End data ----------');
        console.log('-------- params ----------');
        console.log(params);
        console.log('-------- End params ----------');
        const inPatientListService = this.app.service('inpatient-waiting-lists');
        const patientService = this.app.service('patients');
        const locationService = this.app.service('locations');
        const employeeService = this.app.service('employees');
        const facilityService = this.app.service('facilities');
        const facilityId = params.query.facilityId;
        const action = data.action;

        //Check for facility Id
        if (facilityId !== undefined) {
            // Get inpatientwaiting list
            if (action === 'getInPatientWaitingList') {
                let facility = await facilityService.get(facilityId);
                console.log('-------- facility ----------');
                console.log(facility);
                console.log('-------- End facility ----------');
                let waitingLists = await inPatientListService.find(params);
                console.log('-------- waitingLists ----------');
                console.log(waitingLists);
                console.log('-------- End waitingLists ----------');

                const pLength = waitingLists.data.length;
                let i = waitingLists.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    waitingLists = waitingLists.data;
                    while (i--) {
                        let waitingList = waitingLists[i];
                        let patientId = waitingList.patientId;
                        let employeeId = waitingList.employeeId;
                        let minorLocationId = waitingList.minorLocationId;

                        const patient = await patientService.get(patientId);
                        delete patient.personDetails.wallet;
                        waitingList.personDetails = patient.personDetails;
                        let employee = await employeeService.get(employeeId);
                        delete employee.personDetails.wallet;
                        waitingList.employeeDetails = employee.personDetails;
                        // Attach minorLocation.
                        const minorLocation = facility.minorLocations.filter(x => x._id.toString() === minorLocationId.toString());
                        console.log('-------- minorLocation ----------');
                        console.log(minorLocation);
                        console.log('-------- End minorLocation ----------');
                        waitingList.minorLocation = minorLocation[0];
                        counter++;
                    }
                    if (pLength === counter) {
                        return jsend.success(waitingLists);
                    }
                } else {
                    return jsend.error('Prescription not properly referenced!');
                }
            } else if (action === 'getTransferredPatients') {

            } else if (action === 'getAdmittedPatients') {

            } else if (action === 'getDischargedPatients') {

            }
        } else {
            return jsend.error('Facility does not exist!');
        }
    }

    async create(data, params) {
        console.log('-------- data ----------');
        console.log(data);
        console.log('-------- End data ----------');
        console.log('-------- params ----------');
        console.log(params);
        console.log('-------- End params ----------');
        const prescriptionService = this.app.service('prescriptions');
        const billingService = this.app.service('billings');
        const appointmentService = this.app.service('appointments');
        const inpatientService = this.app.service('inpatient-waiting-lists');
        const facilityId = data.facilityId;
        const inPatientId = data.inPatientId;
        const patientId = data.patientId;
        const statusId = data.statusId;
        const action = data.action;
        const ward = data.ward;
        const room = data.room;
        const bed = data.bed;
        const desc = data.desc;
        const type = data.type; // Type of transaction e.g admitPatient or acceptTransfer.

        // Send patient for admission.
        if (action === 'sendForAdmission') {
            // Create inpatient waiting list
            const createInpatient = await inpatientService.create(data);

            if (createInpatient._id !== undefined) {
                const findAppointment = await appointmentService.find({ query: { 'facilityId': facilityId, 'patientId': patientId, isCheckedOut: false } });

                if (findAppointment.data.length > 0) {
                    // There is an appointment
                    let updateData = findAppointment.data[0];
                    updateData.isCheckedOut = true;
                    updateData.attendance.dateCheckOut = new Date();

                    const updateAppointment = await appointmentService.patch(updateData._id, updateData, {});

                    if (updateAppointment._id !== undefined) {
                        return jsend.success(updateAppointment);
                    }
                } else {
                    return jsend.error('There is no appointment for the patient.');
                }
            } else {
                return jsend.error('There was a problem sending patient for admission.');
            }
        } else if (action === 'admitPatient') {
            if (ward !== undefined || bed !== undefined || room !== undefined) {
                if (type === 'admitPatient') {
                    // Admit patient into the selected ward.
                    // Get the patient from the inpatientwaitinglists.
                    this.app.service('inpatientwaitinglists').find({
                        query: {
                            'facilityId._id': facilityId,
                            'patientId._id': patientId,
                            isAdmitted: false
                        }
                    }).then(inPatientWaiting => {
                        if (inPatientWaiting.data.length > 0) {
                            inPatientWaiting.data[0].isAdmitted = true;
                            inPatientWaiting.data[0].admittedDate = new Date();

                            // Update the inpatientWaitingList.
                            this.app.service('inpatientwaitinglists').update(inPatientWaiting.data[0]._id, inPatientWaiting.data[0]).then(inPatientWaitingUpdated => {

                                // Delete Items that are not relevant in the room
                                delete inPatientWaitingUpdated.patientId.personDetails.countryItem;
                                delete inPatientWaitingUpdated.patientId.personDetails.nationalityObject;
                                delete inPatientWaitingUpdated.patientId.personDetails.addressObj;
                                delete inPatientWaitingUpdated.patientId.personDetails.nationality;
                                delete inPatientWaitingUpdated.patientId.personDetails.maritalStatus;
                                delete inPatientWaitingUpdated.patientId.personDetails.nextOfKin;
                                delete inPatientWaitingUpdated.patientId.personDetails.genderId;
                                delete inPatientWaitingUpdated.patientId.personDetails.homeAddress;
                                delete inPatientWaitingUpdated.patientId.personDetails.wallet;

                                let transfers = [];
                                let transfer = {
                                    minorLocationId: ward,
                                    roomId: room,
                                    bedId: bed,
                                    description: desc,
                                    checkInDate: new Date()
                                };
                                transfers.push(transfer);

                                let payload = {
                                    facilityId: inPatientWaitingUpdated.facilityId,
                                    statusId: statusId,
                                    admitByEmployeeId: inPatientWaitingUpdated.employeeId.employeeDetails,
                                    patientId: inPatientWaitingUpdated.patientId,
                                    transfers: transfers,
                                    admissionDate: new Date(),
                                    currentWard: inPatientWaitingUpdated.wardId
                                };

                                // Create inpatient
                                this.app.service('inpatients').create(payload).then(inPatient => {
                                    // Update the wardAdmissionService
                                    this.app.service('warddetails').find({
                                        query: { 'facilityId._id': inPatient.facilityId._id }
                                    }).then(wardDetails => {
                                        // Delete the patient from the room and bed
                                        let i = wardDetails.data[0].locations.length;
                                        while (i--) {
                                            let location = wardDetails.data[0].locations[i];
                                            // Update the new room
                                            if (ward === location.minorLocationId._id) {
                                                let j = location.rooms.length;
                                                while (j--) {
                                                    let loopRoom = location.rooms[j];
                                                    if (room._id == loopRoom._id) {
                                                        let k = loopRoom.beds.length;
                                                        while (k--) {
                                                            let loopBed = loopRoom.beds[k];
                                                            if (bed._id == loopBed._id) {
                                                                loopBed.occupant = inPatient.patientId;
                                                                loopBed.state = 'In-use';
                                                                loopBed.isAvailable = false;
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        // Update wardDetails.
                                        this.app.service('warddetails').update(wardDetails.data[0]._id, wardDetails.data[0]).then(wardDetailsUpdate => {

                                            res.jsend.success(wardDetailsUpdate);
                                        }).catch(err => {
                                            res.jsend.error(err);
                                        });
                                    }).catch(err => {
                                        res.jsend.error(err);
                                    });
                                }).catch(err => {
                                    res.jsend.error(err);
                                });
                            }).catch(err => {
                                res.jsend.error(err);
                            });
                        } else {
                            res.jsend.error('Sorry! We could not find the patient');
                        }
                    }).catch(err => {
                        res.jsend.error(err);
                    });
                } else if (type === 'acceptTransfer') {
                    app.service('inpatients').get(inPatientId).then(inPatient => {
                        // Get the number of days the patient has stayed in the ward.
                        let lastTransfer = inPatient.transfers[inPatient.transfers.length - 1];
                        let startDate;
                        if (lastTransfer.lastBillDate !== undefined) {
                            startDate = new Date(lastTransfer.lastBillDate);
                        } else {
                            startDate = new Date(lastTransfer.checkInDate);
                        }

                        let endDate = new Date();
                        let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        // Update the wardAdmissionService
                        app.service('warddetails').find({
                            query: { 'facilityId._id': inPatient.facilityId._id }
                        }).then(wardDetails => {
                            const wardId = inPatient.transfers[inPatient.transfers.length - 1].minorLocationId;
                            const prevRoom = inPatient.transfers[inPatient.transfers.length - 1].roomId;
                            const prevBed = inPatient.transfers[inPatient.transfers.length - 1].bedId;
                            let serviceId = '';
                            // Delete the patient from the room and bed
                            let i = wardDetails.data[0].locations.length;
                            while (i--) {
                                let location = wardDetails.data[0].locations[i];
                                // Remove the patient from the current room.
                                if (wardId === location.minorLocationId._id) {
                                    let j = location.rooms.length
                                    while (j--) {
                                        let loopRoom = location.rooms[j];
                                        if (prevRoom._id == loopRoom._id) {
                                            serviceId = loopRoom.serviceId._id;
                                            let k = loopRoom.beds.length;
                                            while (k--) {
                                                let loopBed = loopRoom.beds[k];
                                                if (prevBed._id == loopBed._id) {
                                                    delete loopBed.occupant;
                                                    loopBed.state = 'Available';
                                                    loopBed.isAvailable = true;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }

                                // Update the new room
                                if (ward === location.minorLocationId._id) {
                                    let y = location.rooms.length;
                                    while (y--) {
                                        let loopRoom = location.rooms[y];
                                        if (room._id == loopRoom._id) {
                                            let z = loopRoom.beds.length;
                                            while (z--) {
                                                let loopBed = loopRoom.beds[z];
                                                if (bed._id == loopBed._id) {
                                                    loopBed.occupant = inPatient.patientId;
                                                    loopBed.state = 'In-use';
                                                    loopBed.isAvailable = false;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                            }

                            // Update wardDetails.
                            app.service('warddetails').update(wardDetails.data[0]._id, wardDetails.data[0]).then(wardDetailsUpdate => {

                                if (serviceId !== undefined || serviceId !== null || serviceId !== '') {
                                    // Get the current price for the ward
                                    app.service('facilityprices').get(serviceId).then(servicePrice => {
                                        // Generate bill for the patient
                                        let price = servicePrice.price;
                                        let billItemArray = [];
                                        let billItem = {
                                            facilityServiceId: servicePrice.facilityServiceId,
                                            serviceId: servicePrice.serviceId,
                                            facilityId: servicePrice.facilityId,
                                            patientId: inPatient.patientId._id,
                                            description: 'Ward bill',
                                            quantity: diffDays,
                                            totalPrice: price * diffDays,
                                            unitPrice: price,
                                            unitDiscountedAmount: 0,
                                            totalDiscoutedAmount: 0,
                                        };
                                        billItemArray.push(billItem);
                                        let bill = {
                                            facilityId: servicePrice.facilityId,
                                            patientId: inPatient.patientId._id,
                                            billItems: billItemArray,
                                            discount: 0,
                                            subTotal: price * diffDays,
                                            grandTotal: price * diffDays,
                                        };

                                        // Generate bill for the patient based on the last room he or she was in.
                                        app.service('billings').create(bill).then(bill => {
                                            inPatient.statusId = statusId;
                                            lastTransfer.checkOutDate = new Date();
                                            let transfer = {
                                                minorLocationId: ward,
                                                roomId: room,
                                                bedId: bed,
                                                description: desc,
                                                checkInDate: new Date()
                                            };

                                            inPatient.transfers.push(transfer);
                                            inPatient.prevWard = inPatient.currentWard;
                                            inPatient.currentWard = transfer;
                                            // Updated Inpatient data
                                            app.service('inpatients').update(inPatient._id, inPatient).then(updateInpatient => {
                                                res.jsend.success(bill);
                                            }).catch(err => {});
                                        }).catch(err => {
                                            res.jsend.error(err);
                                        });
                                    }).catch(err => {
                                        res.jsend.error(err);
                                    });
                                }
                            });
                        }).catch(err => {
                            res.jsend.error(err);
                        });
                    }).catch(err => {
                        res.jsend.error(err);
                    });
                }
            } else {
                res.jsend.error('Please pass in the required parameters e.g ward, room, and bed.');
            }
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