const { authenticate } = require('@feathersjs/authentication').hooks;

const getApmisId = require('../../hooks/get-apmis-id');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [authenticate('jwt')],
    create: [getApmisId()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
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
