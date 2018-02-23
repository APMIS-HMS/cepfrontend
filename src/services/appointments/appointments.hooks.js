const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');

const resolvers = {
    joins: {
        patientDetails: () => async(appointment, context) => {
            const patient = await context.app
                .service('patients')
                .get(appointment.patientId, {});
            appointment.patientDetails = patient;
        },
        providerDetails: () => async(appointment, context) => {
            if (appointment.doctorId !== undefined) {
                const employee = await context.app
                    .service('employees')
                    .get(appointment.doctorId, {});
                appointment.providerDetails = employee;
            }
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