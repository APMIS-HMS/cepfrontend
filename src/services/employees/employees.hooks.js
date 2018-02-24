const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');


const resolvers = {
  joins: {
    personDetails: () => async (employee, context) => {
      const person = await context.app
        .service('people')
        .get(employee.personId, {});
      employee.personDetails = person;
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
