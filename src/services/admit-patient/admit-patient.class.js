/* eslint-disable no-unused-vars */
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
        console.log('-------- data -----------');
        console.log(data);
        console.log('-------- End data -----------');
        console.log('-------- params -----------');
        console.log(params);
        console.log('-------- End params -----------');
        const prescriptionService = this.app.service('prescriptions');
        const billingService = this.app.service('billings');
        const facilityId = data.query.facilityId;
        const inPatientId = data.query.inPatientId;
        const patientId = data.query.patientId;
        const statusId = data.query.statusId;
        const ward = data.query.ward;
        const room = data.query.room;
        const bed = data.query.bed;
        const desc = data.query.desc;
        const type = data.query.type; // Type of transaction e.g admitPatient or acceptTransfer.
        if (ward !== undefined || bed !== undefined || room !== undefined) {
            if (type === 'admitPatient') {
                // Admit patient into the selected ward.
                // Get the patient from the inpatientwaitinglists.
                app.service('inpatientwaitinglists').find({
                    query: {
                        'facilityId._id': facilityId,
                        'patientId._id': patientId,
                        isAdmitted: false
                    }
                }).then(inPatientWaiting => {
                    console.log('----------- inPatientWaiting -----------');
                    console.log(inPatientWaiting);
                    console.log('----------- End inPatientWaiting -----------');
                    if (inPatientWaiting.data.length > 0) {
                        inPatientWaiting.data[0].isAdmitted = true;
                        inPatientWaiting.data[0].admittedDate = new Date();

                        // Update the inpatientWaitingList.
                        app.service('inpatientwaitinglists').update(inPatientWaiting.data[0]._id, inPatientWaiting.data[0]).then(inPatientWaitingUpdated => {
                            console.log('----------- inPatientWaitingUpdated -----------');
                            console.log(inPatientWaitingUpdated);
                            console.log('----------- End inPatientWaitingUpdated -----------');
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
                            app.service('inpatients').create(payload).then(inPatient => {
                                // Update the wardAdmissionService
                                app.service('warddetails').find({
                                    query: { 'facilityId._id': inPatient.facilityId._id }
                                }).then(wardDetails => {
                                    console.log('----------- wardDetails -----------');
                                    console.log(wardDetails);
                                    console.log('----------- End wardDetails -----------');
                                    // Delete the patient from the room and bed
                                    let i = wardDetails.data[0].locations.length;
                                    while (i--) {
                                        let location = wardDetails.data[0].locations[i];
                                        // Update the new room
                                        if (ward === location.minorLocationId._id) {
                                            let j = location.rooms.length;
                                            console.log('j');
                                            while (j--) {
                                                let loopRoom = location.rooms[j];
                                                if (room._id == loopRoom._id) {
                                                    let k = loopRoom.beds.length;
                                                    console.log('k');
                                                    while (k--) {
                                                        let loopBed = loopRoom.beds[k];
                                                        if (bed._id == loopBed._id) {
                                                            console.log('k 2');
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
                                        console.log('----------- wardDetailsUpdate -----------');
                                        console.log(wardDetailsUpdate);
                                        console.log('----------- End wardDetailsUpdate -----------');
                                        res.jsend.success(wardDetailsUpdate);
                                    }).catch(err => {
                                        console.log(err);
                                        res.jsend.error(err);
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    res.jsend.error(err);
                                });
                            }).catch(err => {
                                console.log(err);
                                res.jsend.error(err);
                            });
                        }).catch(err => {
                            console.log(err);
                            res.jsend.error(err);
                        });
                    } else {
                        res.jsend.error('Sorry! We could not find the patient');
                    }
                }).catch(err => {
                    console.log(err);
                    res.jsend.error(err);
                });
            } else if (type === 'acceptTransfer') {
                app.service('inpatients').get(inPatientId).then(inPatient => {
                    console.log('----------- InPatient -----------');
                    console.log(inPatient);
                    console.log('----------- End inPatient -----------');
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
                        console.log('----------- wardDetails -----------');
                        console.log(wardDetails);
                        console.log('----------- End wardDetails -----------');
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
                                let j = location.rooms.length;
                                console.log('j');
                                while (j--) {
                                    let loopRoom = location.rooms[j];
                                    if (prevRoom._id == loopRoom._id) {
                                        serviceId = loopRoom.serviceId._id;
                                        let k = loopRoom.beds.length;
                                        while (k--) {
                                            console.log('k');
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
                                console.log('y');
                                while (y--) {
                                    let loopRoom = location.rooms[y];
                                    if (room._id == loopRoom._id) {
                                        let z = loopRoom.beds.length;
                                        console.log('z');
                                        while (z--) {
                                            let loopBed = loopRoom.beds[z];
                                            if (bed._id == loopBed._id) {
                                                console.log('z 2');
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
                            console.log('----------- wardDetailsUpdate -----------');
                            console.log(wardDetailsUpdate);
                            console.log('----------- End wardDetailsUpdate -----------');
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

                                        console.log('----------- transfer -----------');
                                        console.log(transfer);
                                        console.log('----------- End transfer -----------');
                                        inPatient.transfers.push(transfer);
                                        inPatient.prevWard = inPatient.currentWard;
                                        inPatient.currentWard = transfer;
                                        // Updated Inpatient data
                                        app.service('inpatients').update(inPatient._id, inPatient).then(updateInpatient => {
                                            res.jsend.success(bill);
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        res.jsend.error(err);
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    res.jsend.error(err);
                                });
                            }
                        });
                    }).catch(err => {
                        console.log(err);
                        res.jsend.error(err);
                    });
                }).catch(err => {
                    console.log(err);
                    res.jsend.error(err);
                });
            }
        } else {
            res.jsend.error('Please pass in the required parameters e.g ward, room, and bed.');
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