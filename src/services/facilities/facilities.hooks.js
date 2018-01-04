const { authenticate } = require('@feathersjs/authentication').hooks;

const facilityToken = require('../../hooks/facility-token');

const alerts = require('../../hooks/alerts');
const { populate } = require('feathers-hooks-common');

const userRoleSchema = {
  include: {
    service: 'facility-types',
    nameAs: 'facilityType',
    parentField: 'facilityTypeId',
    childField: '_id',
    query: {
      $select: ['name'],
      $sort: {createdAt: -1}
    },
  }
};

const userRoleSchema2 = {
  include: {
    service: 'facility-types',
    nameAs: 'facilityClass',
    parentField: 'facilityClassId',
    childField: 'facilityClasses._id'
  }
};

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
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
