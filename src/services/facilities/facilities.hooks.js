const { authenticate } = require('@feathersjs/authentication').hooks;

const facilityToken = require('../../hooks/facility-token');

const alerts = require('../../hooks/alerts');


module.exports = {
    before: {
        all: [],
        find: [],
        get: [authenticate('jwt')],
        create: [facilityToken()],
        update: [authenticate('jwt')],
        patch: [authenticate('jwt')],
        remove: [authenticate('jwt')]
    },

    after: {
        all: [],
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
