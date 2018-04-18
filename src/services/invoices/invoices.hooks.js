const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const {
  fastJoin
} = require('feathers-hooks-common');


const resolvers = {
  joins: {
    patientObject: () => async (item, context) => {
      try {
        if (item.patientId !== undefined) {
          const patient = await context.app.service('patients').get(item.patientId, {});
          item.patientObject = patient;
        }
      } catch (error) {
        item.patientObject = {};
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
