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
        console.log('*********params*********');
        console.log(params);
        console.log('*********End params*********');
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
                    console.log('*********products*********');
                    console.log(products);
                    console.log('*********End products*********');
                    if (products.data.length > 0) {
                        products = products.data;
                        // Check if the ingredient that was sent is contained in any product details.
                        let i = products.length;
                        const results = [];

                        while (i--) {
                            let product = products[i];
                            if (product.productDetail.ingredients !== undefined && product.productDetail.ingredients.length > 0) {
                                console.log('*********product*********');
                                console.log(product);
                                console.log('*********End product*********');
                                for (let j = 0; j < ingredients.length; j++) {
                                    let ingredient = ingredients[j];
                                    console.log('*********ingredient*********');
                                    console.log(ingredient);
                                    console.log('*********End ingredient*********');
                                    const compare = this.compareIngredient(product.productDetail.ingredients, ingredient);
                                    console.log('*********compare*********');
                                    console.log(compare);
                                    console.log('*********End compare*********');

                                    if (compare) {
                                        // Found product that matches the sent ingredient. Then send the product to the client.
                                        const inventories = await inventoryService.find({ query: { facilityId: facilityId, productId: product._id } });
                                        console.log('*********inventories*********');
                                        console.log(inventories);
                                        console.log('*********End inventories*********');
                                        console.log('*********product Name*********');
                                        console.log(product.name);
                                        console.log('*********End product Name*********');
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
                                                console.log('*********inventoryItem*********');
                                                console.log(inventoryItem);
                                                console.log('*********End inventoryItem*********');
                                                let prices = await facilityPriceService.find({
                                                    query: {
                                                        facilityId: facilityId,
                                                        serviceId: inventoryItem.serviceId,
                                                        facilityServiceId: inventoryItem.facilityServiceId,
                                                        categoryId: inventoryItem.categoryId
                                                    }
                                                });
                                                console.log('*********prices*********');
                                                console.log(prices);
                                                console.log('*********End prices*********');
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
                console.log('*********inventories*********');
                console.log(inventories);
                console.log('*********End inventories*********');
                if (inventories.data.length > 0) {
                    inventories = inventories.data;
                    let i = inventories.length;
                    while (i--) {
                        let inventory = inventories[i];
                        const productId = inventory.productId;
                        let product = await productService.get(productId);
                        if (product.name.toLowerCase().includes(text.toLowerCase())) {
                            const storeId = inventory.storeId;
                            console.log('*********product*********');
                            console.log(product);
                            console.log('*********End product*********');
                            inventory.product = product.name;
                            let store = await storeService.get(storeId);
                            console.log('*********store*********');
                            console.log(store);
                            console.log('*********End store*********');
                            inventory.store = store.name;
                            let prices = await facilityPriceService.find({
                                query: {
                                    facilityId: facilityId,
                                    serviceId: inventory.serviceId,
                                    facilityServiceId: inventory.facilityServiceId,
                                    categoryId: inventory.categoryId
                                }
                            });
                            console.log('*********prices*********');
                            console.log(prices);
                            console.log('*********End prices*********');
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

    async get(data, params) {
        // console.log('*********data*********');
        // console.log(data);
        // console.log('*********End data*********');
        // console.log('*********params*********');
        // console.log(params);
        // console.log('*********End params*********');
        // const inventoryService = this.app.service('inventories');
        // const productService = this.app.service('products');
        // const facilityId = params.query.facilityId;

        // if (facilityId !== undefined) {
        //     const products = await productService.find({ query: { facilityId: facilityId } });
        //     console.log('*********products*********');
        //     console.log(products);
        //     console.log('*********End products*********');

        // } else {
        //     return jsend.error('You are not allowed to perform this transaction.');
        // }
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    compareIngredient(pIngredients, ingred) {
        let i = pIngredients.length;

        while (i--) {
            const item = pIngredients[i];
            console.log('*********item*********');
            console.log(item);
            console.log('*********End item*********');
            console.log('*********ingredient*********');
            console.log(ingred);
            console.log('*********End ingredient*********');
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