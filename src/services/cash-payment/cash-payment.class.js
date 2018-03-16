/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
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
        // console.log(data);
        // console.log(params);
        const facilityService = this.app.service('facilities');
        const peopleService = this.app.service('people');
        const paymentService = this.app.service('payment');

        const facilityId = data.sourceId;
        const personId = data.destinationId; // required
        const amount = data.amount; // required
        const employee = params.user._id;


        if (facilityId !== undefined && data.amount >= 500) {
            let response = {
                facilityId: facilityId,
                facilityOldBalance: 0,
                facilityNewBalance: 0,
                personOldBalance: 0,
                personNewBalance: 0,
                employee: employee
            };
            const facility = await facilityService.find({ query: { _id: facilityId } });
            if (facility.total !== 0) {
                let name = facility.data[0].name;
                const facilityBalance = facility.data[0].wallet.balance;
                if (facilityBalance !== 0 && (facilityBalance > amount || facilityBalance === amount)) {
                    if (personId !== undefined) {
                        const person = await peopleService.find({ query: { _id: personId } });
                        if (person !== undefined) {
                            // console.log('....source');
                            // console.log(data.sourceId);
                            // console.log('....facility');
                            // console.log(facility.data[0].facilityId);
                            console.log(person);
                            response.facilityId = data.sourceId;
                            response.facilityOldBalance = facility.data[0].wallet.balance;
                            response.personOldBalance = person.data[0].wallet.balance;
                            response.personNewBalance = parseInt(person.data[0].wallet.balance) + amount;
                            response.employee = employee;

                            person.data[0].wallet.balance = response.personNewBalance;
                            person.data[0].wallet.ledgerBalance += amount;

                            facility.data[0].wallet.balance -= amount;
                            facility.data[0].wallet.ledgerBalance -= amount;

                            response.facilityNewBalance = facility.data[0].wallet.balance;

                            // console.log('Person==============');
                            // console.log(person.data[0].wallet);
                            // console.log('Facility=================');
                            // console.log(facility.data[0].wallet);
                            // console.log('Facility verify');
                            // console.log(facilityId);
                            //   facilitiesService.patch(networkMember._id, {
                            //     memberFacilities: networkMember.memberFacilities
                            // })
                            console.log(facility);
                            console.log(person);
                            console.log(facilityId);
                            console.log(personId);
                            const facUpdate = await facilityService.patch(facilityId, { wallet: facility.data[0].wallet });
                            const personUpdate = await peopleService.patch(personId, { wallet: person.data[0].wallet });
                            console.log('*********************Res*****************');
                            console.log(response);
                            return response;
                            // return facUpdate;
                            //return jsend.success('Successful');
                        } else {
                            return jsend.error('Invalid ApmisId');
                        }
                    } else {
                        return jsend.error('Undefined reciever');
                    }
                } else {
                    return jsend.error('Facility Balance is too low for this transaction');
                }

            } else {
                return jsend.error('Facility is undefined!');
            }
        } else {
            return jsend.error('An error occured while trying to perform this transaction');
        }
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