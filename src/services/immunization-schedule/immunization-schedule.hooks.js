const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const {
    fastJoin
} = require('feathers-hooks-common');

const extractbill = require('../../hooks/extractbill');

const resolvers = {
    joins: {
        principalObject: () => async(schedule, context) => {
            let serviceIds = [];
            try {
                serviceIds.push(schedule.serviceId);
                schedule.vaccines.forEach(vaccince => {
                    serviceIds.push(vaccince.serviceId);
                });

                const pricesResult = await context.app.service('facility-prices').find({
                    query: { 'serviceId': { $in: serviceIds }, $limit: 100 }
                });

                const pricesData = pricesResult.data;
                schedule.serviceObject = pricesData.find(price => {
                    return price.serviceId.toString() == schedule.serviceId.toString();
                });
                schedule.vaccines.map(vaccine => {
                    vaccine.serviceObject = pricesData.find(price => {
                        return price.serviceId.toString() == vaccine.serviceId.toString();
                    });
                });
            } catch (error) {}
        }
    }
};




module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [extractbill()],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [fastJoin(resolvers)],
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