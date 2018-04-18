const { authenticate } = require('@feathersjs/authentication').hooks;
// const { fastJoin } = require('feathers-hooks-common');
// const resolvers = {
//     joins: {
//         patientDetails: () => async(prescription, context) => {
//             const personDetails = await context.app.service('patients').get(prescription.patientId, {});
//             prescription.personDetails = personDetails.personDetails;
//         },
//         employeeDetails: () => async(prescription, context) => {
//             const employee = await context.app.service('employees').get(prescription.employeeId, {});
//             prescription.employeeDetails = employee.personDetails;
//         }
//     }
// };

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