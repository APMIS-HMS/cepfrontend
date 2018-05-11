/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');
const difference_in_calendar_days = require('date-fns/difference_in_calendar_days');

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
        const inventoryService = this.app.service('inventories');
        const productService = this.app.service('products');
        const accessToken = params.accessToken;
        const facilityId = pData.facilityId;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                const result = {
                    inventoryCount: 0,
                    expired: 0,
                    inventories: []
                };

                let inventoryStat = await inventoryService.find({ query: params.query, $sort: { createdAt: -1 } });
                let inventories = inventoryStat.data.slice(0, 5);
                let products = await productService.find({ query: { facilityId: facilityId } });

                if (inventories.length > 0 && products.data.length > 0) {
                    products = products.data;
                    // Loop through products and inventories
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

                    // Loop for inventory statistics

                    result.inventoryCount = inventoryStat.total;
                    inventoryStat = inventoryStat.data;
                    let i = inventoryStat.length;
                    while (i--) {
                        let inventory = inventoryStat[i];
                        for (let j = 0; j < inventory.transactions.length; j++) {
                            const transaction = inventory.transactions[j];
                            if (transaction.quantity < 1) {
                                this.expiration(transaction.expiryDate, new Date());
                            }
                        }
                    }


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

    expiration(date1, date2) {
        let days = difference_in_calendar_days(date1, date2);
        let dateRemains = '';
        let rem = days % 365;
        if (rem > 0) {
            let rationalNo = days - rem;
            let year = rationalNo / 365;
            if (year >= 2) {
                dateRemains = year + ' Years ';
            } else if (year == 1) {
                dateRemains = year + ' Year ';
            }
            let mRem = rem % 31;
            if (mRem > 0) {
                let nRational = rem - mRem;
                let m = nRational / 31;
                if (m >= 2) {
                    dateRemains += m + ' Months ';
                } else if (m == 1) {
                    dateRemains += m + ' Month ';
                }
                if (mRem >= 2) {
                    dateRemains += mRem + ' Days ';
                } else if (mRem == 1) {
                    dateRemains += mRem + ' Day ';
                }
            } else {
                mRem = rem / 31;
                if (mRem >= 2) {
                    dateRemains += mRem + ' Months ';
                } else if (mRem == 1) {
                    dateRemains += mRem + ' Month ';
                }
            }
        } else {
            rem = days / 365;
            if (rem >= 2) {
                dateRemains = rem + ' Years ';
            } else if (rem == 1) {
                dateRemains = rem + ' Year ';
            }
        }
        return dateRemains;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;