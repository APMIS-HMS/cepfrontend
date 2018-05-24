const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const invNotification = require('../../hooks/inventory-notification');

const {
  fastJoin
} = require('feathers-hooks-common');

const emailer = require('../../templates/emailer');

const resolvers = {
  joins: {
    productObject: () => async (data, context) => {
      try {
        const getProduct = await context.app.service('formulary-products').get(data.productId, {});
        if (getProduct.data.id !== undefined) {
          const productConfig = await context.app.service('product-configs').find({
            query: {
              facilityId: data.facilityId,
              productId: getProduct.data.id
            }
          });
          getProduct.data.productConfigObject = productConfig.data[0].packSizes;
          data.productObject = getProduct.data;
        }
      } catch (e) {
        // console.log(e);
      }
    },
    productReorder: () => async (data, context) => {
      try {
        const getProductReorder = await context.app.service('product-reorders').find({
          query: {
            facilityId: data.facilityId,
            productId: data.productId
          }
        });
        if(context.method === 'patch' || context.method === 'update'){
          if(getProductReorder.data[0].reOrderLevel >= data.availableQuantity){
            
            const facility = await context.app.service('facilities').find({
              query: {
                _id: data.facilityId
              }
            });
            const emailData = JSON.parse(JSON.stringify(data));
            const facilityData = facility.data[0];
            emailData.email = facilityData.email;
            emailData.facilityName = facilityData.name;
            emailer.reorder(emailData);

          }
        }
        data.reorder = getProductReorder.data[0].reOrderLevel;

      } catch (e) {
        // console.log(e);
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
