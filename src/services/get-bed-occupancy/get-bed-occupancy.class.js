'use strict';
/* eslint-disable no-unused-vars */
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

    async get(data, params) {
        const bedOccupancyService = this.app.service('bed-occupancy');
        const patientService = this.app.service('patients');
        const locationService = this.app.service('locations');
        const employeeService = this.app.service('employees');
        const facilityService = this.app.service('facilities');
        const facilityId = data.facilityId;
        const minorLocationId = data.minorLocationId;
        const roomId = data.roomId;
        const action = data.action;

        //Check for facility Id is in the userRole
        const hasRole = params.user.facilitiesRole.filter(x => x.facilityId === facilityId);

        if (hasRole.length > 0) {
            // Get inpatientwaiting list
            if (action === 'getAvailableBeds') {
                const facility = await facilityService.get(facilityId);
                const getBedOccupancies = await bedOccupancyService.find({ query: { facilityId: facilityId, minorLocationId: minorLocationId, roomId: roomId } });

                const minorLocation = facility.minorLocations.filter(x => x._id.toString() === minorLocationId);
                const rooms = minorLocation[0].wardSetup.rooms.filter(x => x._id.toString() === roomId);

                if (getBedOccupancies.data.length > 0) {
                    const bedOccupancies = getBedOccupancies.data;
                    // get the available bed space.
                    rooms[0].beds.forEach(bed => {
                        bed.isAvailable = true;
                        bedOccupancies.forEach(bedOccupancy => {
                            if ((bedOccupancy.roomId.toString() === rooms[0]._id.toString()) && (bedOccupancy.bedId.toString() === bed._id.toString())) {
                                bed.isAvailable = bedOccupancy.isAvailable;
                            }
                        });
                    });

                    return jsend.success(rooms[0].beds);
                } else {
                    if (rooms.length > 0) {
                        // Attach isAvailable to every bed.
                        if (rooms[0].beds.length > 0) {
                            rooms[0].beds.forEach(bed => { bed.isAvailable = true; });
                            return jsend.success(rooms[0].beds);
                        } else {
                            return jsend.success(rooms[0].beds);
                        }
                    } else {
                        return jsend.success([]);
                    }
                }
            }
        } else {
            return jsend.error('Facility does not exist!');
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