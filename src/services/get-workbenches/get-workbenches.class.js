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
        // return Promise.resolve({
        //     id,
        //     text: `A new message with ID: ${id}!`
        // });
    }

    async get(data, params) {
        const workBenchService = this.app.service('workbenches');
        const facilityService = this.app.service('facilities');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const cQuery = params.query;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Get workbenches
                let workBenches = await workBenchService.find(cQuery);
                if (workBenches.data.length > 0) {
                    workBenches = workBenches.data;
                    const facility = await facilityService.get(facilityId);
                    const labMinorLocations = facility.minorLocations.filter(x => x.locationId.toString() === workBenches[0].laboratoryId.toString());
                    const wBLength = workBenches.length;
                    let wBCounter = 0;
                    let i = workBenches.length;
                    while (i--) {
                        const wB = workBenches[i];
                        const mL = labMinorLocations.filter(x => x._id.toString() === wB.minorLocationId.toString());
                        if (mL.length > 0) {
                            wB.minorLocationName = mL[0].name;
                            wB.laboratoryName = 'Laboratory';
                        }
                        wBCounter++;
                    }
                    if (wBCounter === wBLength) {
                        return jsend.success(workBenches);
                    }
                } else {
                    return jsend.success([]);
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