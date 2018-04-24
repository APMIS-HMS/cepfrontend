const jsend = require('jsend');
/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }
    setup(app) {
        this.app = app;
    }

    async find(params) {
        const peopleService = this.app.service('people');
        const patientsService = this.app.service('patients');
        const awaitedPeople = await peopleService.find({
            query: {
                $or: [{
                        apmisId: {
                            $regex: params.query.searchQuery,
                            '$options': 'i'
                        }
                    },
                    {
                        firstName: {
                            $regex: params.query.searchQuery,
                            '$options': 'i'
                        }
                    },
                    {
                        lastName: {
                            $regex: params.query.searchQuery,
                            '$options': 'i'
                        }
                    },
                    {
                        email: {
                            $regex: params.query.searchQuery,
                            '$options': 'i'
                        }
                    }
                ],
            }
        });
        let uniquePatientIds = [];
        if (Array.isArray(awaitedPeople.data)) {
            const patientPromiseYetResolved = Promise.all(awaitedPeople.data.map(current => patientsService.find({
                query: {
                    facilityId: params.query.facilityId,
                    personId: current._id,
                    $limit: 1
                }
            })));
            const convertPromiseToAsync = await patientPromiseYetResolved;
            for (let i = convertPromiseToAsync.length - 1; i >= 0; i--) {
                if (convertPromiseToAsync[i].data.length !== 0) {
                    uniquePatientIds.push({
                        patientId: convertPromiseToAsync[i].data[0]._id,
                        person: convertPromiseToAsync[i].data[0].personDetails
                    });
                }
            }
            return jsend.success(uniquePatientIds);
        } else {
            return jsend.success(uniquePatientIds);
        }
    }

    async get(id, params) {
        // return Promise.resolve();
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
        return Promise.resolve({
            id
        });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;