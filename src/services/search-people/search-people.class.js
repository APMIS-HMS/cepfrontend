/* eslint-disable no-unused-vars */
const logger = require('winston');
const jsend = require('jsend');
var startOfDay = require('date-fns/start_of_day');
var endOfDay = require('date-fns/end_of_day');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const peopleService = this.app.service('people');
        if (params.query.isValidating === undefined || params.query.isValidating === false) {
            let returnData = await peopleService.find({
                query: {
                    apmisId: params.query.apmisId,
                    securityQuestion: params.query.securityQuestion,
                    securityAnswer: params.query.securityAnswer
                }
            });
            if (returnData.data.length > 0) {
                return returnData.data[0]._id;
            } else {
                return undefined;
            }
        } else {
            const start = startOfDay(params.query.dateOfBirth);
            const end = endOfDay(params.query.dateOfBirth);
            let returnData = await peopleService.find({
                query: {
                    firstName: params.query.firstName,
                    dateOfBirth: { '$gte': start, '$lt': end }, //params.query.dateOfBirth,
                    motherMaidenName: params.query.motherMaidenName,
                    gender: params.query.gender
                }
            });
            if (returnData.data.length > 0) {
                return jsend.success(true);
            } else {
                return jsend.fail(false);
            }
        }


    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;