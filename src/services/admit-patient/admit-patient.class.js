'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const differenceInYears = require('date-fns/difference_in_years');
const differenceInMonths = require('date-fns/difference_in_months');
const differenceInWeeks = require('date-fns/difference_in_weeks');
const differenceInDays = require('date-fns/difference_in_days');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    find(params) {}

    async get(data, params) {
        // Get inpatient
        // console.log('-------- data ----------');
        // console.log(data);
        // console.log('-------- End data ----------');
        // console.log('-------- params ----------');
        // console.log(params);
        // console.log('-------- End params ----------');
        const inPatientListService = this.app.service('inpatient-waiting-lists');
        const inPatientService = this.app.service('in-patients');
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
                let waitingLists = await inPatientListService.find(params);

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
                        patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        waitingList.personDetails = patient.personDetails;
                        let employee = await employeeService.get(employeeId);
                        delete employee.personDetails.wallet;
                        waitingList.employeeDetails = employee.personDetails;
                        // Attach minorLocation.
                        const minorLocation = facility.minorLocations.filter(x => x._id.toString() === minorLocationId.toString());
                        waitingList.minorLocation = minorLocation[0];
                        counter++;
                    }
                    if (pLength === counter) {
                        return jsend.success(waitingLists);
                    }
                } else {
                    return jsend.error('Inpatient waiting list not properly referenced!');
                }
            } else if (action === 'getTransferredPatients') {

            } else if (action === 'getAdmittedPatients') {
                let facility = await facilityService.get(facilityId);
                let inPatients = await inPatientService.find(params);

                const pLength = inPatients.data.length;
                let i = inPatients.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    inPatients = inPatients.data;
                    while (i--) {
                        let inPatient = inPatients[i];
                        let patientId = inPatient.patientId;
                        let employeeId = inPatient.admittedBy;
                        let minorLocationId = inPatient.currentWard;

                        const patient = await patientService.get(patientId);
                        delete patient.personDetails.wallet;
                        patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        inPatient.personDetails = patient.personDetails;
                        let employee = await employeeService.get(employeeId);
                        delete employee.personDetails.wallet;
                        inPatient.employeeDetails = employee.personDetails;
                        // Attach minorLocation.
                        const minorLocation = facility.minorLocations.filter(x => x._id.toString() === minorLocationId.toString());
                        inPatient.minorLocation = minorLocation[0];
                        // Attach the details of the room and bed in the last transfer.
                        const lastTransfer = inPatient.transfers[inPatient.transfers.length - 1];
                        const room = minorLocation[0].wardSetup.rooms.filter(x => x._id.toString() === lastTransfer.roomId.toString());
                        const roomObj = {
                            '_id': room[0]._id,
                            name: room[0].name,
                            group: room[0].group,
                            service: room[0].service
                        };
                        lastTransfer.room = roomObj;
                        const bed = room[0].beds.filter(x => x._id.toString() === lastTransfer.bedId.toString());
                        lastTransfer.bed = bed[0];
                        counter++;
                    }
                    if (pLength === counter) {
                        return jsend.success(inPatients);
                    }
                } else {
                    return jsend.error('Inpatient list not properly referenced!');
                }
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
        const bedOccupancyService = this.app.service('bed-occupancy');
        const billingService = this.app.service('billings');
        const appointmentService = this.app.service('appointments');
        const inpatientWaitingService = this.app.service('inpatient-waiting-lists');
        const inpatientService = this.app.service('in-patients');
        const facilityId = data.facilityId;
        const inPatientId = data.inPatientId;
        const patientId = data.patientId;
        const status = data.status;
        const action = data.action;
        const minorLocationId = data.minorLocationId;
        const roomId = data.roomId;
        const bedId = data.bedId;
        const employeeId = data.employeeId;
        const desc = data.desc;
        const type = data.type; // Type of transaction e.g admitPatient or acceptTransfer.

        if (patientId !== undefined) {
            // Send patient for admission.
            if (action === 'sendForAdmission') {
                // Create inpatient waiting list
                const createInpatientWaiting = await inpatientWaitingService.create(data);

                if (createInpatientWaiting._id !== undefined) {
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
                if (minorLocationId !== undefined || bedId !== undefined || roomId !== undefined) {
                    if (type === 'admitPatient') {
                        // Admit patient into the selected ward.
                        // Get the patient from the inpatientwaitinglists.
                        const getInPatientWaiting = await inpatientWaitingService.get(inPatientId);
                        console.log('-------- getInPatientWaiting ----------');
                        console.log(getInPatientWaiting);
                        console.log('-------- End getInPatientWaiting ----------');
                        if (getInPatientWaiting._id !== undefined) {
                            getInPatientWaiting.isAdmitted = true;
                            getInPatientWaiting.admittedDate = new Date();

                            // Update the inpatientWaitingList.
                            const updateInpatientWaiting = await inpatientWaitingService.patch(getInPatientWaiting._id, getInPatientWaiting, {});

                            console.log('-------- updateInpatientWaiting ----------');
                            console.log(updateInpatientWaiting);
                            console.log('-------- End updateInpatientWaiting ----------');
                            if (updateInpatientWaiting._id !== undefined) {
                                let transfers = [];
                                const transfer = {
                                    minorLocationId: minorLocationId,
                                    roomId: roomId,
                                    bedId: bedId,
                                    description: desc,
                                    admittedDate: new Date()
                                };
                                transfers.push(transfer);

                                let payload = {
                                    facilityId: facilityId,
                                    status: status,
                                    admittedBy: employeeId,
                                    patientId: patientId,
                                    transfers: transfers,
                                    admissionDate: new Date(),
                                    currentWard: minorLocationId
                                };

                                console.log('-------- payload ----------');
                                console.log(payload);
                                console.log('-------- End payload ----------');
                                // Create inpatient
                                const createInpatient = await inpatientService.create(payload);
                                console.log('-------- createInpatient ----------');
                                console.log(createInpatient);
                                console.log('-------- End createInpatient ----------');
                                if (createInpatient._id !== undefined) {
                                    const bedOccupancy = {
                                        facilityId: facilityId,
                                        minorLocationId: minorLocationId,
                                        roomId: roomId,
                                        bedId: bedId,
                                        patientId: patientId,
                                        admittedDate: Date.now(),
                                        bedState: 'Occupied',
                                        isAvailable: false,
                                        admittedBy: employeeId
                                    };
                                    // Create bed occupancy
                                    const createBedOccupancy = await bedOccupancyService.create(bedOccupancy);
                                    console.log('-------- createBedOccupancy ----------');
                                    console.log(createBedOccupancy);
                                    console.log('-------- End createBedOccupancy ----------');

                                    if (createBedOccupancy._id !== undefined) {
                                        return jsend.success(createBedOccupancy);
                                    } else {
                                        return jsend.error('There was a problem admitting patient.');
                                    }
                                    // Delete the patient from the room and bed.
                                    // let i = wardDetails.data[0].locations.length;
                                    // while (i--) {
                                    //     let location = wardDetails.data[0].locations[i];
                                    //     // Update the new room
                                    //     if (ward === location.minorLocationId._id) {
                                    //         let j = location.rooms.length;
                                    //         while (j--) {
                                    //             let loopRoom = location.rooms[j];
                                    //             if (room._id == loopRoom._id) {
                                    //                 let k = loopRoom.beds.length;
                                    //                 while (k--) {
                                    //                     let loopBed = loopRoom.beds[k];
                                    //                     if (bed._id == loopBed._id) {
                                    //                         loopBed.occupant = inPatient.patientId;
                                    //                         loopBed.state = 'In-use';
                                    //                         loopBed.isAvailable = false;
                                    //                         break;
                                    //                     }
                                    //                 }
                                    //                 break;
                                    //             }
                                    //         }
                                    //     }
                                    // }

                                    // // Update wardDetails.
                                    // this.app.service('warddetails').update(wardDetails.data[0]._id, wardDetails.data[0]).then(wardDetailsUpdate => {

                                    //     return jsend.success(wardDetailsUpdate);
                                    // }).catch(err => {
                                    //     return jsend.error(err);
                                    // });
                                }
                            }
                        } else {
                            return jsend.error('Sorry! We could not find the patient');
                        }

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
                    return jsend.error('Please pass in the required parameters e.g ward, room, and bed.');
                }
            }
        } else {
            return jsend.error('No patient has been provided.');
        }
    }

    checkAge(dateOfBirth) {
        let age = differenceInYears(Date.now(), dateOfBirth);
        if (age < 1) {
            const monthResult = differenceInMonths(Date.now(), dateOfBirth);
            if (monthResult < 1) {
                const weekResult = differenceInWeeks(Date.now(), dateOfBirth);
                if (weekResult < 1) {
                    const dayResult = differenceInDays(Date.now(), dateOfBirth);
                    age = dayResult + ' days';
                } else { age = weekResult + ' weeks'; }
            } else { age = monthResult + ' months'; }
        } else { age = age + ' years'; }
        return age;
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