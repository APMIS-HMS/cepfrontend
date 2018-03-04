'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        const inventoryService = this.app.service('inventories');
        const productService = this.app.service('products');
        const storeService = this.app.service('stores');
        const facilityPriceService = this.app.service('facility-prices');
        const facilityId = params.query.facilityId;
        const ingredients = (params.query.ingredients !== undefined) ? JSON.parse(params.query.ingredients) : undefined;
        const action = params.query.action;
        const text = (params.query.text !== undefined) ? params.query.text : undefined;
        const storeId = (params.query.storeId !== undefined) ? params.query.storeId : undefined;

        if (facilityId !== undefined) {
            if (action === 'genericSearch') {
                if (ingredients !== undefined && ingredients.length > 0) {
                    // Get all the products for the facility.
                    let products = await productService.find({ query: { facilityId: facilityId } });
                    if (products.data.length > 0) {
                        products = products.data;
                        // Check if the ingredient that was sent is contained in any product details.
                        let i = products.length;
                        const results = [];

                        while (i--) {
                            let product = products[i];
                            if (product.productDetail.ingredients !== undefined && product.productDetail.ingredients.length > 0) {
                                for (let j = 0; j < ingredients.length; j++) {
                                    let ingredient = ingredients[j];
                                    const compare = this.compareIngredient(product.productDetail.ingredients, ingredient);

                                    if (compare) {
                                        // Found product that matches the sent ingredient. Then send the product to the client.
                                        const inventories = await inventoryService.find({ query: { facilityId: facilityId, productId: product._id } });

                                        if (inventories.data.length > 0) {
                                            let inventory = inventories.data[0];
                                            let resultItem = {};
                                            resultItem.productId = inventory.productId;
                                            resultItem.product = product.name;
                                            resultItem.availability = [];
                                            resultItem.totalQuantity = 0;
                                            resultItem.serviceId = inventory.serviceId;
                                            resultItem.categoryId = inventory.categoryId;
                                            resultItem.facilityServiceId = inventory.facilityServiceId;

                                            let k = inventories.data.length;
                                            while (k--) {
                                                let inventoryItem = inventories.data[k];
                                                let item = {};
                                                resultItem.totalQuantity += inventoryItem.totalQuantity;
                                                // Attach store name from stores collection with storeId
                                                let store = await storeService.get(inventoryItem.storeId);
                                                item.store = store.name;
                                                item.storeId = inventoryItem.storeId;
                                                item.quantity = inventoryItem.totalQuantity;
                                                resultItem.availability.push(item);
                                                let prices = await facilityPriceService.find({
                                                    query: {
                                                        facilityId: facilityId,
                                                        serviceId: inventoryItem.serviceId,
                                                        facilityServiceId: inventoryItem.facilityServiceId,
                                                        categoryId: inventoryItem.categoryId
                                                    }
                                                });
                                                if (prices.data.length > 0) {
                                                    let price = prices.data[0];
                                                    resultItem.price = price.price;
                                                } else {
                                                    resultItem.price = 0;
                                                }
                                                results.push(resultItem);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        return jsend.success(results);
                    } else {
                        return jsend.error('You do not have any product yet. Please create product and bring them into your inventory');
                    }
                } else {
                    return jsend.error('Parameter ingredients is missing or it is not an array.');
                }
            } else if (action === 'productSearch') {
                let inventories = await inventoryService.find({ query: { facilityId: facilityId, storeId: storeId } });
                const results = [];
                if (inventories.data.length > 0) {
                    inventories = inventories.data;
                    let i = inventories.length;
                    while (i--) {
                        let inventory = inventories[i];
                        const productId = inventory.productId;
                        let product = await productService.get(productId);
                        if (product.name.toLowerCase().includes(text.toLowerCase())) {
                            const storeId = inventory.storeId;
                            inventory.product = product.name;
                            let store = await storeService.get(storeId);
                            inventory.store = store.name;
                            let prices = await facilityPriceService.find({
                                query: {
                                    facilityId: facilityId,
                                    serviceId: inventory.serviceId,
                                    facilityServiceId: inventory.facilityServiceId,
                                    categoryId: inventory.categoryId
                                }
                            });
                            if (prices.data.length > 0) {
                                let price = prices.data[0];
                                inventory.price = price.price;
                            } else {
                                inventory.price = 0;
                            }
                            results.push(inventory);
                        }

                    }
                    return jsend.success(results);
                } else {
                    return jsend.success([]);
                }
            }
        } else {
            return jsend.error('You are not allowed to perform this transaction.');
        }
    }

    get(data, params) {
        return Promise.resolve(data);
    }

    async create(data, params) {
        const inventoryService = this.app.service('inventories');
        const productService = this.app.service('products');
        const storeService = this.app.service('stores');
        const facilityPriceService = this.app.service('facility-prices');
        const facilityId = data.facilityId;
        const accessToken = params.accessToken;
        const drugs = data.drugs;

        if (accessToken !== undefined && facilityId !== undefined) {
            if (drugs !== undefined && drugs.length > 0) {
                let i = drugs.length;
                while (i--) {
                    const drug = drugs[i];
                    let inventory = await inventoryService.get(drug.invetoryId);
                    if (inventory._id !== undefined) {
                        const transactions = inventory.transactions;
                        let j = transactions.length;
                        while (j--) {
                            fsd
                        }
                    }
                }
            } else {
                return jsend.error('You have not selected any drugs.');
            }
        } else {
            return jsend.error('You are not allowed to perform this transaction.');
        }
    }

    compareIngredient(pIngredients, ingred) {
        let i = pIngredients.length;

        while (i--) {
            const item = pIngredients[i];
            if ((item.strengthUnit === ingred.strengthUnit) && (item.strength === ingred.strength) && (item.name === ingred.name)) {
                return true;
            }
        }

        return false;
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