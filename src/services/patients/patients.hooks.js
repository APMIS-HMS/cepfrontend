const { authenticate } = require('@feathersjs/authentication').hooks;
const alerts = require('../../hooks/alerts');
const { fastJoin } = require('feathers-hooks-common');

const resolvers = {
    joins: {
        personDetails: () => async(patient, context) => {
            const person = await context.app
                .service('people')
                .get(patient.personId, {});
            patient.personDetails = person;
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
        create: [alerts()],
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