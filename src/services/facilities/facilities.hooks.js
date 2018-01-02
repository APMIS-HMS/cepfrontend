// const { authenticate } = require('@feathersjs/authentication').hooks;

const facilityToken = require('../../hooks/facility-token');

const alerts = require('../../hooks/alerts');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [facilityToken()],
    update: [],
    patch: [],
    remove: []
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
