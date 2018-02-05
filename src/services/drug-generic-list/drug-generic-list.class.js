/* eslint-disable no-unused-vars */
const console = require('console');
const request = require('request');
const requestPromise = require('request-promise');
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        let url = process.env.EMDEX_BASEURL + '/list/?query=' + params.query.searchtext +
            '&po=' + params.query.po + '&brandonly=' + params.query.brandonly + '&genericonly=' + params.query.genericonly;

        // var args = { headers: { Authorization: process.env.EMDEX_AUTHORISATION_KEY } };
        const options = {
            method: 'GET',
            uri: url,
            headers: { Authorization: process.env.EMDEX_AUTHORISATION_KEY }
        };
        const makeRequest = await requestPromise(options);
        console.log('---------- makeRequest -----------');
        console.log(makeRequest);
        console.log('---------- End makeRequest -----------');
        // request.get(url, args, function(drugs, response) {
        //     if (drugs.results !== undefined) {
        //         let dataLength = drugs.results.length;
        //         let counter = 0;
        //         let resultItems = [];

        //         drugs.results.forEach(function(element) {
        //             counter++;
        //             if (element.details.toLowerCase().includes(params.query.searchtext.toLowerCase())) {
        //                 resultItems.push(element);
        //             }
        //         });

        //         if (dataLength === counter) {
        //             return jsend.success(resultItems);
        //         }
        //     } else {
        //         return jsend.success([]);
        //     }
        // });
        //return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            // id, text: `A new message with ID: ${id}!`
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
        return Promise.resolve({
            id
        });
    }
    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;