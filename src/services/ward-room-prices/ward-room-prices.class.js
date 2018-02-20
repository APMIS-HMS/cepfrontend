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

    find(params) {
        return Promise.resolve([]);
    }

    async get(data, params) {
        const facilityId = data.facilityId;
        const result = [];
        const facilityPriceService = this.app.service('facility-prices');
        const facilitiesServiceCategoryService = this.app.service('organisation-services');

        // Get facilityServices
        const getOrgServices = await facilitiesServiceCategoryService.find({ query: { facilityId: facilityId } });
        if (getOrgServices.data.length > 0) {
            const facilityService = getOrgServices.data[0];
            const facilityServiceId = facilityService._id;
            if (facilityService.categories.length > 0) {
                const categories = facilityService.categories.filter(x => x.name.toLowerCase() === 'ward');
                if (categories.length > 0) {
                    const category = categories[0];
                    const categoryId = category._id;
                    if (category.services.length > 0) {
                        const services = category.services;
                        let i = services.length;
                        let counter = 0;
                        const sLength = services.length;
                        while (i--) {
                            counter++;
                            const thisService = services[i];
                            const serviceId = thisService._id;
                            const facilityPrices = await facilityPriceService.find({
                                query: { facilityId: facilityId, facilityServiceId: facilityServiceId, categoryId: categoryId, serviceId: serviceId }
                            });

                            if (facilityPrices.data.length > 0) {
                                const facilityPrice = facilityPrices.data[0];
                                // Merge both service price and service, and push into result.
                                let mergeResult = Object.assign(facilityPrice, thisService);
                                result.push(mergeResult);
                            }

                            // Return when counter == length
                            if (sLength === counter) {
                                return jsend.success(result);
                            }
                        }
                    } else {
                        return jsend.success([]);
                    }
                } else {
                    return jsend.success([]);
                }
            } else {
                return jsend.success([]);
            }
        } else {
            return jsend.success([]);
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

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;