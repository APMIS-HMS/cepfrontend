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
                    inventories: []
                };
                // get stores
                let inventories = await inventoryService.find({ query: params.query, $sort: { createdAt: -1 }, $limit: 5 });
                let inventoryCount = await inventoryService.find({ query: params.query, $limit: 0 });
                console.log('Get inventoryCount => ', inventoryCount);
                let products = await productService.find({ query: { facilityId: facilityId } });
                if (inventories.data.length > 0 && products.data.length > 0) {
                    inventories = inventories.data;
                    products = products.data;
                    console.log('Get Products => ', products);
                    console.log('Get inventories => ', inventories);
                    // Loop through products and inventories
                    // let i = products.length;
                    // let j = inventories.length;
                    for (let i = 0; i < products.length; i++) {
                        let product = products[i];
                        for (let j = 0; j < inventories.length; j++) {
                            let inventory = inventories[j];
                            if (product._id.toString() === inventory.productId.toString()) {
                                product.transaction = inventory.transactions[inventory.transactions.length - 1];
                                product.totalQuantity = inventory.totalQuantity;
                                result.inventories.push(product);
                            }
                        }
                    }

                    result.inventoryCount = inventoryCount.total;
                    return jsend.success(result);
                } else {
                    return jsend.success(result);
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