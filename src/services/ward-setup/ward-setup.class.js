'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');

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
        const facilityId = data.facilityId;
        const action = data.action;
        if (action === 'create-room' || action === 'edit-room') {
            const createRoom = await this.createEditRoom(data);
            if (createRoom) {
                return jsend.success(data);
            } else {
                return jsend.error('There was a problem creating room');
            }
        } else if (action === 'create-bed' || action === 'edit-bed') {
            const createBed = await this.createEditBed(data);
            if (createBed) {
                return jsend.success(data);
            } else {
                return jsend.error('There was a problem creating room');
            }
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

    async createEditBed(data) {
        const facilityService = this.app.service('facilities');

        // Get facilityServices
        const facility = await facilityService.get(data.facilityId);
        if (facility._id !== undefined) {
            const minorLocation = facility.minorLocations.filter(x => x._id == data.minorLocationId);

            if (minorLocation.length > 0) {
                const room = minorLocation[0].wardSetup.rooms.filter(x => x._id == data.roomId);
                const bed = {
                    name: data.name,
                };

                // Add Room
                if (data.action === 'create-bed') {
                    room[0].beds.push(bed);
                } else if (data.action === 'edit-bed') {
                    const bed = room[0].beds.filter(x => x._id == data.bedId);
                    if (bed.length > 0) {
                        bed[0].name = data.name;
                    }
                }
                // Update facility
                const updateFacility = await facilityService.patch(facility._id, facility);

                if (updateFacility._id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async createEditRoom(data) {
        const facilityService = this.app.service('facilities');

        // Get facilityServices
        const facility = await facilityService.get(data.facilityId);
        if (facility._id !== undefined) {
            const minorLocation = facility.minorLocations.filter(x => x._id == data.minorLocationId);
            const locationId = (minorLocation.length > 0) ? minorLocation[0].locationId : undefined;

            if (minorLocation.length > 0) {
                const room = {
                    name: data.name,
                    group: { groupId: data.group._id, name: data.group.name },
                    service: { serviceId: data.service.serviceId, name: data.service.name },
                    facilityServiceId: data.service.facilityServiceId,
                    categoryId: data.service.categoryId,
                    beds: [],
                    description: data.desc,
                };

                // Add Room
                if (data.action === 'create-room') {
                    const wardLength = facility.minorLocations.length;
                    let i = facility.minorLocations.length;
                    let counter = 0;

                    while (i--) {
                        const ward = facility.minorLocations[i];

                        if (ward.locationId.toString() === locationId.toString()) {
                            if (ward.wardSetup === undefined) {
                                ward.wardSetup = { minorLocationId: data.minorLocationId, rooms: [] };
                                if (ward._id.toString() === data.minorLocationId) {
                                    ward.wardSetup.rooms.push(room);
                                }
                            } else {
                                if (ward._id.toString() === data.minorLocationId) {
                                    if (ward.wardSetup.rooms !== undefined) {
                                        ward.wardSetup.rooms.push(room);
                                    } else {
                                        ward.wardSetup.rooms = [];
                                        ward.wardSetup.minorLocationId = data.minorLocationId;
                                        ward.wardSetup.rooms.push(room);
                                    }
                                }
                            }
                        }
                        counter++;
                    }
                } else if (data.action === 'edit-room') {
                    const room = minorLocation[0].wardSetup.rooms.filter(x => x._id == data.roomId);
                    if (room.length > 0) {
                        room[0].name = data.name;
                        room[0].group = { groupId: data.group._id, name: data.group.name };
                        room[0].service = { serviceId: data.service.serviceId, name: data.service.name };
                        room[0].facilityServiceId = data.service.facilityServiceId;
                        room[0].categoryId = data.service.categoryId;
                        room[0].description = data.desc;
                    }
                }

                // Update facility
                const updateFacility = await facilityService.patch(facility._id, facility);

                if (updateFacility._id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;