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
        let facilityPriceService = this.app.service('facility-prices');
        const facilityId = params.query.facilityId;
        const ingredients = JSON.parse(params.query.ingredients);

        if (facilityId !== undefined) {
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
                    let resultItem = {};

                    while (i--) {
                        const product = products[i];
                        console.log('*********product*********');
                        console.log(product);
                        console.log('*********End product*********');
                        if (product.productDetail.ingredients !== undefined && product.productDetail.ingredients.length > 0) {
                            for (let j = 0; j < ingredients.length; j++) {
                                const ingredient = ingredients[j];
                                console.log('*********ingredient*********');
                                console.log(ingredient);
                                console.log('*********End ingredient*********');
                                const compare = this.compareIngredient(product.productDetail.ingredients, ingredient);
                                console.log('*********compare*********');
                                console.log(compare);
                                console.log('*********End compare*********');

                                if (compare) {
                                    // Found product that matches the sent ingredient. Then send the product to the client.
                                    let inventory = await inventoryService.find({ query: { facilityId: facilityId, productId: product._id } });
                                    console.log('*********inventory*********');
                                    console.log(inventory);
                                    console.log('*********End inventory*********');
                                    if (inventory.data.length > 0) {
                                        // inventory = inventory.data[0];
                                        resultItem.productId = inventory.productId;
                                        resultItem.product = product.name;
                                        resultItem.availability = [];
                                        resultItem.totalQuantity = 0;
                                        product.serviceId = inventory.serviceId;
                                        product.categoryId = inventory.categoryId;
                                        product.facilityServiceId = inventory.facilityServiceId;

                                        let k = inventory.data.length;
                                        while (k--) {
                                            const inventoryItem = inventory.data[k];
                                            console.log('*********inventoryItem*********');
                                            console.log(inventoryItem);
                                            console.log('*********End inventoryItem*********');
                                            let prices = await facilityPriceService.find({
                                                query: {
                                                    facilityId: facilityId,
                                                    facilityServiceId: inventoryItem.facilityServiceId,
                                                    categoryId: inventoryItem.categoryId
                                                }
                                            });
                                            console.log('*********prices*********');
                                            console.log(prices);
                                            console.log('*********End prices*********');
                                        }
                                    }
                                }
                            }
                        }
                    }

                } else {
                    return jsend.error('You do not have any product yet. Please create product and bring them into your inventory');
                }
            } else {
                return jsend.error('Parameter ingredients is missing or it is not an array.');
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