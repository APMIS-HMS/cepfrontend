const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');
// var differenceInYears = require('date-fns/difference_in_years');
// var differenceInMonths = require('date-fns/difference_in_months');
// var differenceInWeeks = require('date-fns/difference_in_weeks');
// var differenceInDays = require('date-fns/difference_in_days');
const resolvers = {
    joins: {
        patientDetails: () => async(request, context) => {
            const patient = await context.app.service('patients').get(request.patientId, {});
            request.personDetails = patient.personDetails;
        },
        employeeDetails: () => async(request, context) => {
            const employee = await context.app.service('employees').get(request.createdBy, {});
            request.employeeDetails = employee.personDetails;
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