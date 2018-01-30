const { authenticate } = require('@feathersjs/authentication').hooks;

const extractbill = require('../../hooks/extractbill');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [extractbill()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [extractbill()],
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
