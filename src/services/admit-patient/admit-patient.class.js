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
                let waitingLists = await inPatientListService.find({
                    query: params.query
                });

                const pLength = waitingLists.data.length;
                let i = waitingLists.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    waitingLists = waitingLists.data;
                    while (i--) {
                        let waitingList = waitingLists[i];
                        // let patientId = waitingList.patientId;
                        // let employeeId = waitingList.employeeId;
                        let minorLocationId = waitingList.minorLocationId;

                        // const patient = await patientService.get(patientId);
                        // delete patient.personDetails.wallet;
                        // patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        // waitingList.personDetails = patient.personDetails;
                        // let employee = await employeeService.get(employeeId);
                        // delete employee.personDetails.wallet;
                        // waitingList.employeeDetails = employee.personDetails;
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
            } else if (action === 'getInPatientTransferList') {
                let facility = await facilityService.get(facilityId);
                let inPatients = await inPatientService.find({
                    query: params.query
                });

                const pLength = inPatients.data.length;
                let i = inPatients.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    inPatients = inPatients.data;
                    while (i--) {
                        let inPatient = inPatients[i];
                        // const patientId = inPatient.patientId;
                        // const employeeId = inPatient.admittedBy;
                        // const transferredById = inPatient.transferredBy;
                        const proposedWard = inPatient.proposedWard;
                        const currentWard = inPatient.currentWard;

                        // const patient = await patientService.get(patientId);
                        // delete patient.personDetails.wallet;
                        // patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        // inPatient.personDetails = patient.personDetails;
                        // let employee = await employeeService.get(employeeId);
                        // delete employee.personDetails.wallet;
                        // inPatient.employeeDetails = employee.personDetails;
                        // let transferred = await employeeService.get(transferredById);
                        // delete transferred.personDetails.wallet;
                        // inPatient.transferred = transferred.personDetails;
                        // Attach minorLocation.
                        const currentWardObj = facility.minorLocations.filter(x => x._id.toString() === currentWard.toString());
                        inPatient.currentWardObj = currentWardObj[0];
                        const proposedWardObj = facility.minorLocations.filter(x => x._id.toString() === proposedWard.toString());
                        inPatient.proposedWardObj = proposedWardObj[0];
                        counter++;
                    }
                    if (pLength === counter) {
                        return jsend.success(inPatients);
                    }
                } else {
                    return jsend.error('Inpatient waiting list not properly referenced!');
                }
            } else if (action === 'getAdmittedPatients') {
                let facility = await facilityService.get(facilityId);
                let inPatients = await inPatientService.find({
                    query: params.query
                });

                const pLength = inPatients.data.length;
                let i = inPatients.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    inPatients = inPatients.data;
                    while (i--) {
                        let inPatient = inPatients[i];
                        // let patientId = inPatient.patientId;
                        // let employeeId = inPatient.admittedBy;
                        let minorLocationId = inPatient.currentWard;

                        // const patient = await patientService.get(patientId);
                        // delete patient.personDetails.wallet;
                        // patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        // inPatient.personDetails = patient.personDetails;
                        // let employee = await employeeService.get(employeeId);
                        // delete employee.personDetails.wallet;
                        // inPatient.employeeDetails = employee.personDetails;
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
                let facility = await facilityService.get(facilityId);
                let inPatients = await inPatientService.find({ query: params.query });

                const pLength = inPatients.data.length;
                let i = inPatients.data.length;
                let counter = 0;
                if (pLength === 0) {
                    return jsend.success([]);
                } else if (pLength > 0) {
                    inPatients = inPatients.data;
                    while (i--) {
                        let inPatient = inPatients[i];
                        // const patientId = inPatient.patientId;
                        // const employeeId = inPatient.admittedBy;
                        // const dischargedBy = inPatient.dischargedBy;
                        const currentWard = inPatient.currentWard;

                        // const patient = await patientService.get(patientId);
                        // delete patient.personDetails.wallet;
                        // patient.personDetails.age = this.checkAge(patient.personDetails.dateOfBirth);
                        // inPatient.personDetails = patient.personDetails;
                        // let employee = await employeeService.get(employeeId);
                        // delete employee.personDetails.wallet;
                        // inPatient.employeeDetails = employee.personDetails;
                        // let dischargedByObj = await employeeService.get(dischargedBy);
                        // delete dischargedByObj.personDetails.wallet;
                        // inPatient.dischargedByObj = dischargedByObj.personDetails;
                        // Attach minorLocation.
                        const currentWardObj = facility.minorLocations.filter(x => x._id.toString() === currentWard.toString());
                        inPatient.currentWardObj = currentWardObj[0];
                        counter++;
                    }
                    if (pLength === counter) {
                        return jsend.success(inPatients);
                    }
                } else {
                    return jsend.error('Inpatient waiting list not properly referenced!');
                }
            }
        } else {
            return jsend.error('Facility does not exist!');
        }
    }

    async create(data, params) {
        const patientService = this.app.service('patients');
        const bedOccupancyService = this.app.service('bed-occupancy');
        const billingService = this.app.service('billings');
        const billCreatorService = this.app.service('bill-creators');
        const appointmentService = this.app.service('appointments');
        const inpatientWaitingService = this.app.service('inpatient-waiting-lists');
        const inpatientService = this.app.service('in-patients');
        const facilityService = this.app.service('facilities');
        const facilityPriceService = this.app.service('facility-prices');
        const facilityId = data.facilityId;
        const inPatientId = data.inPatientId;
        const patientId = data.patientId;
        const status = data.status;
        const newStatus = data.newStatus;
        const action = data.action;
        const minorLocationId = data.minorLocationId;
        const roomId = data.roomId;
        const bedId = data.bedId;
        const discharge = data.discharge;
        const employeeId = data.employeeId;
        const desc = data.desc;
        const type = data.type; // Type of transaction e.g admitPatient or acceptTransfer.

        if (patientId !== undefined) {
            // Send patient for admission.
            if (action === 'sendForAdmission') {
                // Create inpatient waiting list
                const createInpatientWaiting = await inpatientWaitingService.create(data);

                if (createInpatientWaiting._id !== undefined) {
                    const findAppointment = await appointmentService.find({
                        query: {
                            'facilityId': facilityId,
                            'patientId': patientId,
                            isCheckedOut: false
                        }
                    });

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

                        if (getInPatientWaiting._id !== undefined) {
                            getInPatientWaiting.isAdmitted = true;
                            getInPatientWaiting.admittedDate = new Date();

                            // Update the inpatientWaitingList.
                            const updateInpatientWaiting = await inpatientWaitingService.patch(getInPatientWaiting._id, getInPatientWaiting, {});

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

                                try {
                                    // Create inpatient
                                    const createInpatient = await inpatientService.create(payload);
                                    if (createInpatient._id !== undefined) {
                                        // Find and update bedOccupancy
                                        let findBedOccupancy = await bedOccupancyService.find({
                                            query: {
                                                facilityId: facilityId,
                                                patientId: patientId,
                                                minorLocationId: minorLocationId,
                                                roomId: roomId,
                                                bedId: bedId,
                                                isAvailable: false
                                            }
                                        });

                                        if (findBedOccupancy.data.length > 0) {
                                            findBedOccupancy = findBedOccupancy.data[0];
                                            findBedOccupancy.patientId = patientId;
                                            findBedOccupancy.admittedDate = new Date();
                                            findBedOccupancy.bedState = 'Occupied';
                                            findBedOccupancy.admittedBy = employeeId;
                                            findBedOccupancy.isAvailable = false;

                                            const updateBedOccupancy = await bedOccupancyService.patch(findBedOccupancy._id, findBedOccupancy, {});
                                            if (updateBedOccupancy._id !== undefined) {
                                                return jsend.success(updateBedOccupancy);
                                            } else {
                                                return jsend.error('There was a problem admitting patient.');
                                            }
                                        } else {
                                            // Create bedOccupancy
                                            const bedOccupancy = {
                                                facilityId: facilityId,
                                                minorLocationId: minorLocationId,
                                                roomId: roomId,
                                                bedId: bedId,
                                                patientId: patientId,
                                                admittedDate: new Date(),
                                                bedState: 'Occupied',
                                                isAvailable: false,
                                                admittedBy: employeeId
                                            };
                                            // Create bed occupancy
                                            const createBedOccupancy = await bedOccupancyService.create(bedOccupancy);

                                            if (createBedOccupancy._id !== undefined) {
                                                return jsend.success(createBedOccupancy);
                                            } else {
                                                return jsend.error('There was a problem admitting patient.');
                                            }
                                        }
                                    }
                                } catch (e) {
                                    return jsend.error('There was a problem admitting patient.');
                                }
                            }
                        } else {
                            return jsend.error('Sorry! We could not find the patient');
                        }
                    } else if (type === 'acceptTransfer') {
                        const getInPatient = await inpatientService.get(inPatientId);

                        if (getInPatient._id !== undefined) {
                            // Get the number of days the patient has stayed in the ward.
                            const lastTransfer = getInPatient.transfers[getInPatient.transfers.length - 1];
                            const lastMinorLocationId = getInPatient.transfers[getInPatient.transfers.length - 1].minorLocationId;
                            const lastRoomId = getInPatient.transfers[getInPatient.transfers.length - 1].roomId;
                            const lastBedId = getInPatient.transfers[getInPatient.transfers.length - 1].bedId;

                            let startDate;
                            if (lastTransfer.lastBillDate !== undefined) {
                                startDate = new Date(lastTransfer.lastBillDate);
                            } else {
                                startDate = new Date(lastTransfer.checkInDate);
                            }

                            let endDate = new Date();
                            let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                            let findBedOccupancy = await bedOccupancyService.find({
                                query: {
                                    facilityId: facilityId,
                                    patientId: patientId,
                                    minorLocationId: lastMinorLocationId,
                                    roomId: lastRoomId,
                                    bedId: lastBedId,
                                    isAvailable: false
                                }
                            });

                            if (findBedOccupancy.data.length > 0) {
                                findBedOccupancy = findBedOccupancy.data[0];

                                const bedOccupancyHistory = {
                                    admittedDate: getInPatient.admissionDate,
                                    dischargedDate: new Date(),
                                    dischargedBy: getInPatient.transferredBy,
                                    admittedBy: employeeId,
                                    patientId: getInPatient.patientId,
                                    dischargeType: 'Transfer'
                                };

                                findBedOccupancy.isAvailable = true;
                                findBedOccupancy.bedState = 'Available';
                                findBedOccupancy.admittedDate = undefined;
                                findBedOccupancy.patientId = undefined;
                                findBedOccupancy.admittedBy = undefined;
                                findBedOccupancy.history.push(bedOccupancyHistory);

                                let updateBedOccupancy = await bedOccupancyService.patch(findBedOccupancy._id, findBedOccupancy, {});

                                if (updateBedOccupancy._id !== undefined) {
                                    // Get serviceId from room and bill the patient for the number of days stayed.
                                    const facility = await facilityService.get(facilityId);

                                    if (facility._id !== undefined) {
                                        const minorLocation = facility.minorLocations.filter(x => x._id.toString() === lastMinorLocationId.toString());
                                        const room = minorLocation[0].wardSetup.rooms.filter(x => x._id.toString() === lastRoomId.toString());
                                        const serviceId = room[0].service.serviceId;

                                        let findFacilityPrice = await facilityPriceService.find({
                                            query: {
                                                facilityId: facilityId,
                                                serviceId: serviceId
                                            }
                                        });

                                        if (findFacilityPrice.data.length > 0) {
                                            findFacilityPrice = findFacilityPrice.data[0];

                                            // Generate bill for the patient
                                            let price = findFacilityPrice.price;
                                            let billItemArray = [];
                                            let billItem = {
                                                facilityServiceId: findFacilityPrice.facilityServiceId,
                                                serviceId: findFacilityPrice.serviceId,
                                                facilityId: findFacilityPrice.facilityId,
                                                patientId: getInPatient.patientId,
                                                description: 'Ward bill',
                                                quantity: diffDays,
                                                totalPrice: price * diffDays,
                                                unitPrice: price,
                                                unitDiscountedAmount: 0,
                                                totalDiscoutedAmount: 0,
                                            };
                                            billItemArray.push(billItem);
                                            //   let bill = {
                                            //     facilityId: findFacilityPrice.facilityId,
                                            //     patientId: getInPatient.patientId,
                                            //     billItems: billItemArray,
                                            //     discount: 0,
                                            //     subTotal: price * diffDays,
                                            //     grandTotal: price * diffDays,
                                            //   };
                                            const patientDetail = await patientService.get(getInPatient.patientId);
                                            const patientDefaultPaymentPlan = patientDetail.paymentPlan.find(x => x.isDefault === true);
                                            const bill = [];
                                            let covered = {};
                                            if (patientDefaultPaymentPlan.planType === 'wallet') {
                                                covered = {
                                                    coverType: patientDefaultPaymentPlan.planType
                                                };
                                            } else if (patientDefaultPaymentPlan.planType === 'insurance') {
                                                covered = {
                                                    coverType: patientDefaultPaymentPlan.planType,
                                                    hmoId: patientDefaultPaymentPlan.planDetails.hmoId
                                                };
                                            } else if (patientDefaultPaymentPlan.planType === 'company') {
                                                covered = {
                                                    coverType: patientDefaultPaymentPlan.planType,
                                                    companyId: patientDefaultPaymentPlan.planDetails.companyId
                                                };
                                            } else if (patientDefaultPaymentPlan.planType === 'family') {
                                                covered = {
                                                    coverType: patientDefaultPaymentPlan.planType,
                                                    familyId: patientDefaultPaymentPlan.planDetails.familyId
                                                };
                                            }
                                            billItemArray.forEach(element => {
                                                bill.push({
                                                    unitPrice: element.unitPrice,
                                                    facilityId: facilityId,
                                                    facilityServiceId: element.facilityServiceId,
                                                    serviceId: element.serviceId,
                                                    patientId: element.patientId,
                                                    quantity: diffDays,
                                                    active: true,
                                                    totalPrice: element.totalPrice,
                                                    covered: covered
                                                });
                                            });

                                            // Generate bill for the patient based on the last room he or she was in.
                                            const billing = await billCreatorService.create(bill, { query: { facilityId: facilityId, patientId: patientId } });

                                            if (billing.length > 0) {
                                                // Change status to onAdmission.
                                                getInPatient.status = newStatus;
                                                lastTransfer.checkOutDate = new Date();
                                                let transfer = {
                                                    minorLocationId: minorLocationId,
                                                    roomId: roomId,
                                                    bedId: bedId,
                                                    description: desc,
                                                    admittedDate: new Date(),
                                                    lastBillDate: new Date()
                                                };

                                                getInPatient.transfers.push(transfer);
                                                getInPatient.prevWard = getInPatient.currentWard;
                                                getInPatient.currentWard = minorLocationId;
                                                getInPatient.admissionDate = new Date();
                                                getInPatient.admittedBy = employeeId;
                                                // Updated getInPatient data
                                                const updateInPatient = await inpatientService.patch(getInPatient._id, getInPatient, {});

                                                if (updateInPatient._id !== undefined) {
                                                    // Find and update bedOccupancy
                                                    let findBedOccupancy = await bedOccupancyService.find({
                                                        query: {
                                                            facilityId: facilityId,
                                                            patientId: patientId,
                                                            minorLocationId: minorLocationId,
                                                            roomId: roomId,
                                                            bedId: bedId,
                                                            isAvailable: false
                                                        }
                                                    });

                                                    if (findBedOccupancy.data.length > 0) {
                                                        findBedOccupancy = findBedOccupancy.data[0];
                                                        findBedOccupancy.patientId = patientId;
                                                        findBedOccupancy.admittedDate = new Date();
                                                        findBedOccupancy.bedState = 'Occupied';
                                                        findBedOccupancy.admittedBy = employeeId;
                                                        findBedOccupancy.isAvailable = false;

                                                        const updateBedOccupancy = await bedOccupancyService.patch(findBedOccupancy._id, findBedOccupancy, {});
                                                        if (updateBedOccupancy._id !== undefined) {
                                                            return jsend.success(billing);
                                                        } else {
                                                            return jsend.error('There was a problem admitting patient.');
                                                        }
                                                    } else {
                                                        // Create bedOccupancy
                                                        const bedOccupancy = {
                                                            facilityId: facilityId,
                                                            minorLocationId: minorLocationId,
                                                            roomId: roomId,
                                                            bedId: bedId,
                                                            patientId: patientId,
                                                            admittedDate: new Date(),
                                                            bedState: 'Occupied',
                                                            isAvailable: false,
                                                            admittedBy: employeeId
                                                        };
                                                        // Create bed occupancy
                                                        const createBedOccupancy = await bedOccupancyService.create(bedOccupancy);

                                                        if (createBedOccupancy._id !== undefined) {
                                                            return jsend.success(createBedOccupancy);
                                                        } else {
                                                            return jsend.error('There was a problem admitting patient.');
                                                        }
                                                    }
                                                } else {
                                                    return jsend.error('Could not update inpatient service.');
                                                }
                                            } else {
                                                return jsend.error('Could not create billing for the patient.');
                                            }
                                        } else {
                                            return jsend.error('Could not find price for the serviceId selected.');
                                        }
                                    }
                                } else {
                                    return jsend.error('There was a problem updating bed occupancy.');
                                }
                            } else {
                                return jsend.error('Could not find bed this patient was assign to');
                            }
                        } else {
                            return jsend.error('Can find patient in inPatient list.');
                        }
                    }
                } else {
                    return jsend.error('Please pass in the required parameters e.g ward, room, and bed.');
                }
            } else if (action === 'transferPatient') {
                //Get patient from the inpatient
                const getInPatient = await inpatientService.get(inPatientId);

                if (getInPatient._id !== undefined) {
                    getInPatient.status = status;
                    getInPatient.proposedWard = minorLocationId;
                    getInPatient.transferredBy = employeeId;
                    const updateInPatient = await inpatientService.patch(getInPatient._id, getInPatient, {});

                    if (updateInPatient._id !== undefined) {
                        return jsend.success(updateInPatient);
                    } else {
                        return jsend.error('There was a problem transferring a patient.');
                    }
                } else {
                    return jsend.error('There was a problem getting inPatients record.');
                }
            } else if (action === 'dischargePatient') {
                //Get patient from the inpatient
                const getInPatient = await inpatientService.get(inPatientId);

                if (getInPatient._id !== undefined) {
                    const dischargeData = {
                        dischargeTypeId: discharge.dischargeType,
                        reason: discharge.comment,
                        isConfirmed: true
                    };

                    getInPatient.discharge = dischargeData;
                    getInPatient.dischargedBy = employeeId;
                    getInPatient.status = status;
                    getInPatient.isDischarged = true;
                    getInPatient.transfers[getInPatient.transfers.length - 1].checkOutDate = new Date();
                    const updateInPatient = await inpatientService.patch(getInPatient._id, getInPatient, {});

                    if (updateInPatient._id !== undefined) {
                        // Get the number of days the patient has stayed in the ward.
                        const lastTransfer = updateInPatient.transfers[updateInPatient.transfers.length - 1];
                        const lastMinorLocationId = updateInPatient.transfers[updateInPatient.transfers.length - 1].minorLocationId;
                        const lastRoomId = updateInPatient.transfers[updateInPatient.transfers.length - 1].roomId;
                        const lastBedId = updateInPatient.transfers[updateInPatient.transfers.length - 1].bedId;

                        let startDate;
                        if (lastTransfer.lastBillDate !== undefined) {
                            startDate = new Date(lastTransfer.lastBillDate);
                        } else {
                            startDate = new Date(lastTransfer.checkInDate);
                        }

                        let endDate = new Date();
                        let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
                        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        let findBedOccupancy = await bedOccupancyService.find({
                            query: {
                                facilityId: facilityId,
                                patientId: patientId,
                                minorLocationId: lastMinorLocationId,
                                roomId: lastRoomId,
                                bedId: lastBedId,
                                isAvailable: false
                            }
                        });

                        if (findBedOccupancy.data.length > 0) {
                            findBedOccupancy = findBedOccupancy.data[0];

                            const bedOccupancyHistory = {
                                admittedDate: updateInPatient.admissionDate,
                                dischargedDate: new Date(),
                                dischargedBy: employeeId,
                                admittedBy: updateInPatient.admittedBy,
                                patientId: updateInPatient.patientId,
                                dischargeType: 'Discharge'
                            };

                            findBedOccupancy.isAvailable = true;
                            findBedOccupancy.bedState = 'Available';
                            findBedOccupancy.admittedDate = undefined;
                            findBedOccupancy.patientId = undefined;
                            findBedOccupancy.admittedBy = undefined;
                            findBedOccupancy.history.push(bedOccupancyHistory);

                            let updateBedOccupancy = await bedOccupancyService.patch(findBedOccupancy._id, findBedOccupancy, {});

                            if (updateBedOccupancy._id !== undefined) {
                                // Get serviceId from room and bill the patient for the number of days stayed.
                                const facility = await facilityService.get(facilityId);

                                if (facility._id !== undefined) {
                                    const minorLocation = facility.minorLocations.filter(x => x._id.toString() === lastMinorLocationId.toString());
                                    const room = minorLocation[0].wardSetup.rooms.filter(x => x._id.toString() === lastRoomId.toString());
                                    const serviceId = room[0].service.serviceId;

                                    let findFacilityPrice = await facilityPriceService.find({
                                        query: {
                                            facilityId: facilityId,
                                            serviceId: serviceId
                                        }
                                    });

                                    if (findFacilityPrice.data.length > 0) {
                                        findFacilityPrice = findFacilityPrice.data[0];

                                        // Generate bill for the patient
                                        let price = findFacilityPrice.price;
                                        let billItemArray = [];
                                        let billItem = {
                                            facilityServiceId: findFacilityPrice.facilityServiceId,
                                            serviceId: findFacilityPrice.serviceId,
                                            facilityId: findFacilityPrice.facilityId,
                                            patientId: getInPatient.patientId,
                                            description: 'Ward bill',
                                            quantity: diffDays,
                                            totalPrice: price * diffDays,
                                            unitPrice: price,
                                            unitDiscountedAmount: 0,
                                            totalDiscoutedAmount: 0,
                                        };
                                        billItemArray.push(billItem);
                                        // let bill = {
                                        //   facilityId: findFacilityPrice.facilityId,
                                        //   patientId: getInPatient.patientId,
                                        //   billItems: billItemArray,
                                        //   discount: 0,
                                        //   subTotal: price * diffDays,
                                        //   grandTotal: price * diffDays,
                                        // };

                                        // Generate bill for the patient based on the last room he or she was in.
                                        const patientDetail = await patientService.get(getInPatient.patientId);
                                        const patientDefaultPaymentPlan = patientDetail.paymentPlan.find(x => x.isDefault === true);
                                        const bill = [];
                                        let covered = {};
                                        if (patientDefaultPaymentPlan.planType === 'wallet') {
                                            covered = {
                                                coverType: patientDefaultPaymentPlan.planType
                                            };
                                        } else if (patientDefaultPaymentPlan.planType === 'insurance') {
                                            covered = {
                                                coverType: patientDefaultPaymentPlan.planType,
                                                hmoId: patientDefaultPaymentPlan.planDetails.hmoId
                                            };
                                        } else if (patientDefaultPaymentPlan.planType === 'company') {
                                            covered = {
                                                coverType: patientDefaultPaymentPlan.planType,
                                                companyId: patientDefaultPaymentPlan.planDetails.companyId
                                            };
                                        } else if (patientDefaultPaymentPlan.planType === 'family') {
                                            covered = {
                                                coverType: patientDefaultPaymentPlan.planType,
                                                familyId: patientDefaultPaymentPlan.planDetails.familyId
                                            };
                                        }

                                        billItemArray.forEach(element => {
                                            bill.push({
                                                unitPrice: element.unitPrice,
                                                facilityId: facilityId,
                                                facilityServiceId: element.facilityServiceId,
                                                serviceId: element.serviceId,
                                                patientId: element.patientId,
                                                quantity: diffDays,
                                                active: true,
                                                totalPrice: element.totalPrice,
                                                covered: covered
                                            });
                                        });


                                        const billing = await billCreatorService.create(bill, { query: { facilityId: facilityId, patientId: patientId } });

                                        if (billing.length > 0) {
                                            return jsend.success(billing);
                                        } else {
                                            return jsend.error('Could not create billing for the patient.');
                                        }
                                    } else {
                                        return jsend.error('Could not find price for the serviceId selected.');
                                    }
                                }
                            } else {
                                return jsend.error('There was a problem updating bed occupancy.');
                            }
                        } else {
                            return jsend.error('Could not find bed this patient was assign to');
                        }
                    } else {
                        return jsend.error('There was a problem transferring a patient.');
                    }
                } else {
                    return jsend.error('There was a problem getting inPatients record.');
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
                } else {
                    age = weekResult + ' weeks';
                }
            } else {
                age = monthResult + ' months';
            }
        } else {
            age = age + ' years';
        }
        return age;
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