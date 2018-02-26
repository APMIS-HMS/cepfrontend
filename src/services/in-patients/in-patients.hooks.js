const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        personDetails: () => async(inPatient, context) => {
            const patient = await context.app.service('patients').get(inPatient.patientId, {});
            const employee = await context.app.service('employees').get(inPatient.admittedBy, {});
            const facility = await context.app.service('facilities').get(inPatient.facilityId, {});
            const minorLocation = facility.minorLocations.filter(x => x._id.toString() === inPatient.currentWard.toString());
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
            inPatient.minorLocation = minorLocation[0];
            inPatient.patient = patient;
            inPatient.employee = employee;
        }
    }
};

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
        all: [],
        find: [],
        get: [fastJoin(resolvers)],
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