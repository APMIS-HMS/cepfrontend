const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin, getByDot } = require('feathers-hooks-common');

const resolvers = {
    joins: {
        formDetails: () => async(template, context) => {
            const temp = await context.app
                .service('forms')
                .get(template.form, {});
            const title = getByDot(temp, 'title');
            template.formDetails = title;
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