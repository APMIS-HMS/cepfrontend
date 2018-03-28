/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    find(params) {
        return Promise.resolve([]);
    }

    async get(pData, params) {
        console.log('pData => ', pData);
        console.log('params => ', params);
        const facilityService = this.app.service('facilities');
        const inventoryService = this.app.service('inventories');
        const storesService = this.app.service('stores');
        const productService = this.app.service('products');
        const accessToken = params.accessToken;
        const facilityId = pData.facilityId;
        const cQuery = { query: params.query };

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                const result = {
                    inventoryCount: 0,
                    result: []
                };
                // get stores
                let getInventories = await inventoryService.find({ query: params.query, $limit: 0 });
                console.log('Get Inventories => ', getInventories);
                let inventoryCount = await inventoryService.find({ query: params.query, $limit: 3 });
                console.log('Get inventoryCount => ', inventoryCount);
                let getProducts = await productService.find({ query: { facilityId: facilityId } });
                console.log('Get Products => ', getProducts);
                if (getInventories.data.length > 0 && getProducts.data.length > 0) {

                } else {

                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
        }
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;