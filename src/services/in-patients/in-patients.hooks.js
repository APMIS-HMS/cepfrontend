const { authenticate } = require('@feathersjs/authentication').hooks;
const differenceInYears = require('date-fns/difference_in_years');
const differenceInMonths = require('date-fns/difference_in_months');
const differenceInWeeks = require('date-fns/difference_in_weeks');
const differenceInDays = require('date-fns/difference_in_days');
const { fastJoin } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        personDetails: () => async(inPatient, context) => {
            let transferred = {};
            let dischargedByObj = {};
            const patient = await context.app.service('patients').get(inPatient.patientId, {});
            const employee = await context.app.service('employees').get(inPatient.admittedBy, {});
            const facility = await context.app.service('facilities').get(inPatient.facilityId, {});
            if (inPatient.transferredBy !== undefined) {
                transferred = await context.app.service('employees').get(inPatient.transferredBy, {});
            }
            if (inPatient.dischargedBy !== undefined) {
                dischargedByObj = await context.app.service('employees').get(inPatient.dischargedBy, {});
            }

            const minorLocation = facility.minorLocations.filter(x => x._id.toString() === inPatient.currentWard.toString());
            // Attach the details of the room and bed in the last transfer.
            if (inPatient.transfers.length > 0) {
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
                inPatient.minorLocation = minorLocation[0];
            }
            patient.personDetails.age = checkAge(patient.personDetails.dateOfBirth);
            inPatient.patient = patient;
            inPatient.employee = employee;
            inPatient.transferred = transferred.personDetails;
            inPatient.dischargedByObj = dischargedByObj.personDetails;
        }
    }
};

function checkAge(dateOfBirth) {
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

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [fastJoin(resolvers)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};