//const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    priceObject: () => async (item, context) => {
      try {
        for (let b = 0; b < item.categories.length; b++) {
          if (item.categories[b].services.length > 0) {
            for (let k = 0; k < item.categories[b].services.length; k++) {
              item.categories[b].services[k].price = [];
              const prices = await context.app.service('facility-prices').find({
                query: {
                  facilityId: item.facilityId,
                  categoryId: item.categories[b]._id,
                  serviceId: item.categories[b].services[k]._id,
                  facilityServiceId: item._id
                }
              });
              console.log(6);
              console.log(prices);
              if (prices.data.length > 0) {
                let len5 = prices.data.length - 1;
                for (let n = 0; n <= len5; n++) {
                  item.categories[b].services[k].price.push({
                    name: 'Base',
                    isBase: true,
                    priceId: prices.data[n]._id,
                    price: prices.data[n].price
                  });
                  if (prices.data[n].modifiers !== undefined) {
                    if (prices.data[n].modifiers.length > 0) {
                      let len6 = prices.data[n].modifiers.length - 1;
                      for (let m = 0; m <= len6; m++) {
                        if (prices.data[n].modifiers[m].tagId !== undefined) {
                          let tag = await context.app.service('service-tags').get(prices.data[n].modifiers[m].tagId);
                          if (prices.data[n].modifiers[m].modifierType === 'Percentage') {
                            let p = prices.data[n].modifiers[m].modifierValue / 100;
                            let calculatedP = p * prices.data[n].price;
                            item.categories[b].services[k].price.push({
                              name: tag.name,
                              isBase: false,
                              priceId: prices.data[n]._id,
                              _id: prices.data[n].modifiers[m]._id,
                              price: calculatedP,
                              modifierType: '%',
                              modifierValue: prices.data[n].modifiers[m].modifierValue
                            });
                          } else if (prices.data[n].modifiers[m].modifierType === 'Amount') {
                            item.categories[b].services[k].price.push({
                              name: tag.name,
                              isBase: false,
                              priceId: prices.data[n]._id,
                              _id: prices.data[n].modifiers[m]._id,
                              price: prices.data[n].modifiers[m].modifierValue,
                              modifierType: 'Amt.',
                              modifierValue: prices.data[n].modifiers[m].modifierValue
                            });
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                item.categories[b].services[k].price.push({
                  name: 'Base',
                  isBase: true,
                  price: 0
                });
              }
            }
          }
        }
      } catch (error) {}
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [fastJoin(resolvers)],
    get: [fastJoin(resolvers)],
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
