/* eslint-disable no-unused-vars */
const request = require('request');
const requestPromise = require('request-promise');
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        let url = '';

        if (params.query.method === 'drug-details') {
            url = process.env.EMDEX_BASEURL + '/products/' + params.query.productId;
        } else {
            url = process.env.EMDEX_BASEURL + '/list/?query=' + params.query.searchtext +
                '&po=' + params.query.po + '&brandonly=' + params.query.brandonly + '&genericonly=' + params.query.genericonly;
        }

        const options = {
            method: 'GET',
            uri: url,
            headers: { authorisation: process.env.EMDEX_AUTHORISATION_KEY }
        };
        const makeRequest = await requestPromise(options);
        const parsed = JSON.parse(makeRequest);

        if (params.query.method === 'drug-details') {
            return jsend.success(parsed);
        } else {
            if (parsed.results !== undefined) {
                return jsend.success(parsed.results);
            } else {
                return jsend.success([]);
            }
        }
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