const { authenticate } = require('@feathersjs/authentication').hooks;
const { validateSchema } = require('feathers-hooks-common');
const Ajv = require('ajv');
// const createSchema = {
//   personId: { type: Schema.Types.ObjectId, required: true },
//   facilityId: { type: Schema.Types.ObjectId, required: true },
//   isActive: { type: Boolean, 'default': false },
//   paymentPlan: [paymentPlanSchema],
//   orders: [{ type: String, required: false }],
//   tags: [{ type: String, required: false }],
//   clientsNo: [{ type: Schema.Types.Mixed }],
//   timeLines: [{ type: Schema.Types.Mixed, required: false }],
// };
const createSchema = {
  'properties': {
    'personId': {
      'type': 'string'
    },
    'facilityId': {
      'type': 'string'
    },
    'isActive': {
      'type': 'boolean'
    }
  },
  'required': [ 'personId', 'facilityId' ]

};
// module.before({
//   create: validateSchema(createSchema, Ajv)
// });

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [validateSchema(createSchema, Ajv)],
    update: [],
    patch: [],
    remove: []
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
