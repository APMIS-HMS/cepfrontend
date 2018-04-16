//const { authenticate } = require('@feathersjs/authentication').hooks;
const { paramsFromClient } = require('feathers-hooks-common');
const {
    fastJoin
} = require('feathers-hooks-common');

const resolvers = {
    joins: {
        priceObject: () => async(item, context) => {
            if (context.params.populate !== undefined && context.params.populate === true) {
                try {
                    if (context.params.selectedCategory !== undefined) {
                        item.categories = item.categories.filter(x => x._id == context.params.selectedCategory);
                    }
                    var b = item.categories.length;
                    while (b--) {
                        if (item.categories[b].services.length > 0) {
                            var k = item.categories[b].services.length;
                            var result = item.categories[b].services.map(a => a._id);
                            const pricesLists = await context.app.service('facility-prices').find({
                                query: {
                                    facilityId: item.facilityId,
                                    categoryId: item.categories[b]._id,
                                    serviceId: { $in: result },
                                    facilityServiceId: item._id,
                                    $limit: false
                                }
                            });

                            while (k--) {
                                item.categories[b].services[k].price = [];
                                const selectedPrices = pricesLists.data.filter(x => x.serviceId.toString() == item.categories[b].services[k]._id.toString());
                                const prices = { data: selectedPrices };
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
                } catch (error) {
                    //
                }
            }

        }
    }
};

module.exports = {
    before: {
        all: [],
        find: [paramsFromClient('populate', 'selectedCategory')],
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