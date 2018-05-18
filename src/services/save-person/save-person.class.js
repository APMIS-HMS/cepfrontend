/* eslint-disable no-unused-vars */
const logger = require('winston');
const sms = require('../../templates/sms-sender');
const tokenLabel = require('../../parameters/token-label');
const jsend = require('jsend');
const errors = require('@feathersjs/errors');
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
        const userService = this.app.service('users');
        const personService = this.app.service('people');
        const getTokenService = this.app.service('get-tokens');
        const searchPeople = this.app.service('search-people');

        let checkPerson = await searchPeople.find({
            query: {
                firstName: 'Sunday', //data.person.firstName,
                dateOfBirth: data.person.dateOfBirth,
                gender: data.person.gender,
                motherMaidenName: data.person.motherMaidenName,
                isValidating: true
            }
        });
        if (checkPerson.status === 'success' && checkPerson.data === true) {
            throw new Error('Duplicate record detected, please check and try again!');
        } else {
            let person = data.person;
            person.wallet = {
                'transactions': [],
                'ledgerBalance': 0,
                'balance': 0
            };

            var createPerson = await personService.create(person);
            const user = {
                email: createPerson.apmisId,
                personId: createPerson._id
            };

            var createToken = await getTokenService.get(tokenLabel.tokenType.autoPassword, {});
            user.password = createToken.result;
            if (data.facilityId !== undefined) {
                user.facilitiesRole = [];
                user.facilitiesRole.push({ facilityId: data.facilityId });
            }

            var createUser = await userService.create(user);
            await sms.sendAutoGeneratorPassword(createPerson, createToken.result);
            return createPerson;
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