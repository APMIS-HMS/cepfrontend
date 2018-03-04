const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');


const resolvers = {
  joins: {
    patientObject: () => async (item, context) => {
      try {
        if (item.familyCovers !== undefined) {
          const len = item.familyCovers.length;
          for (let i = 0; i < len; i++) {
            if(item.familyCovers[i].patientId !== undefined){
              const patient = await context.app.service('patients').get(item.familyCovers[i].patientId, {});
              item.familyCovers[i].patientObject = patient;
            }
          }
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
