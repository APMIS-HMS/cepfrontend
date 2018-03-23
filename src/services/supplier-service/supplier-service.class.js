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

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const facilityService = this.app.service('facilities');
        const supplierService = this.app.service('suppliers');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const employeeId = data.employeeId;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // First create facility
                const createFacility = await facilityService.create(data.facility);

                if (createFacility._id !== undefined) {
                    const payload = {
                        facilityId: facilityId,
                        createdBy: employeeId,
                        supplierId: createFacility._id
                    };
                    // create supplier
                    const createSupplier = await supplierService.create(payload);

                    if (createSupplier._id !== undefined) {
                        return jsend.success(createSupplier);
                    }
                } else {
                    return jsend.error('Sorry! But there was a problem trying to create supplier');
                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
        }
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;