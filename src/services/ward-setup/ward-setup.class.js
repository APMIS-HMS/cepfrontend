'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const console = require('console');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    setup(app) {
        this.app = app;
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        console.log('-------- data --------');
        console.log(data);
        console.log('-------- data --------');
        console.log('-------- End params --------');
        console.log(params);
        console.log('--------End params --------');
        const facilityId = data.facilityId;
        const action = data.action;
        if (action === 'create-room') {
            const createRoom = await this.createRoom(data);
            console.log('-------- createRoom --------');
            console.log(createRoom);
            console.log('--------End createRoom --------');
        } else if (action === 'edit-room') {
            console.log('-------- editRoom --------');
            // console.log(editRoom);
            console.log('--------End editRoom --------');
        } else if (action === 'create-bed') {
            console.log('-------- createBed --------');
            // console.log(createBed);
            console.log('--------End createBed --------');
        } else if (action === 'edit-bed') {
            console.log('-------- editBed --------');
            // console.log(editBed);
            console.log('--------End editBed --------');
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

    async createRoom(data) {
        console.log('-------- End data --------');
        console.log(data);
        console.log('--------End data --------');
        const facilityService = this.app.service('facilities');

        // Get facilityServices
        const facility = await facilityService.get(data.facilityId);
        console.log('-------- End facility --------');
        console.log(facility);
        console.log('--------End facility --------');
        if (facility._id !== undefined) {

        } else {
            return false;
        }
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;