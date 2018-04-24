/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const employeeService = this.app.service('employees');
        const peopleService = this.app.service('people');
        const accessToken = params.accessToken;
        const facilityId = params.query.facilityId;
        const searchText = params.query.searchText;
        const employeeTable = (params.query.employeeTable === true) ? params.query.employeeTable : false;
        let employeez = [];

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Get Employees
                let employees = await employeeService.find({ query: { facilityId: facilityId, $select: ['personId'], $limit: (params.query.$limit) ? params.query.$limit : 10 } });
                if (employees.data.length > 0) {
                    employees = employees.data.map(x => x.personId);
                    let people = await peopleService.find({
                        query: {
                            '_id': { $in: employees },
                            $or: [
                                { firstName: { $regex: searchText, '$options': 'i' } },
                                { lastName: { $regex: searchText, '$options': 'i' } },
                                { apmisId: { $regex: searchText, '$options': 'i' } },
                                { email: { $regex: searchText, '$options': 'i' } },
                                { otherNames: { $regex: searchText, '$options': 'i' } }
                            ],
                            $limit: (params.query.$limit) ? params.query.$limit : 10,
                            $sort: { createdAt: -1 }
                        }
                    });
                    if (people.data.length > 0) {
                        people = people.data;
                        const pLength = people.length;
                        let i = people.length;
                        let counter = 0;

                        while (i--) {
                            const person = people[i];

                            const employees = await employeeService.find({ query: { facilityId: facilityId, personId: person._id, $sort: { createdAt: -1 } } });
                            if (employees.data.length > 0) {
                                if (employeeTable !== true) {
                                    person.employeeId = employees.data[0]._id;
                                    person.clientsNo = employees.data[0].clientsNo;
                                } else {
                                    employees.data[0].personDetails = person;
                                    employeez.push(employees.data[0]);
                                }
                            }
                            counter++;
                        }

                        if (pLength === counter) {
                            if (employeeTable !== true) {
                                return jsend.success(people);
                            } else {
                                return jsend.success(employeez);
                            }
                        }
                    } else {
                        return jsend.success([]);
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

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
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

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;