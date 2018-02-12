/* eslint-disable no-unused-vars */
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
        const facilitiesService = this.app.service('facilities');
        var _memberFacilities = [];
        if (params.query.isdelete === false) {
            let len = data.memberFacilities.length - 1;
            for (let i = len; i >= 0; i--) {
                var awaitfacilities = await facilitiesService.get(data.memberFacilities[i], {});
                let checkId = awaitfacilities.memberFacilities.filter(x => x.toString() == data.hostId.toString());
                if (checkId.length == 0) {
                    awaitfacilities.memberFacilities.push(data.hostId);
                }
                var awaitfacilities_ = await facilitiesService.patch(awaitfacilities._id, {
                    memberFacilities: awaitfacilities.memberFacilities
                });
                _memberFacilities.push(awaitfacilities_);
                var awaitFacilitiesGet = await facilitiesService.get(data.hostId, {});
                let checkId2 = awaitFacilitiesGet.memberof.filter(x => x.toString() == data.memberFacilities[i].toString());
                if (checkId2.length == 0) {
                    awaitFacilitiesGet.memberof.push(data.memberFacilities[i]);
                }
                var await_patch_facility = facilitiesService.patch(awaitFacilitiesGet._id, {
                    memberof: awaitFacilitiesGet.memberof
                });
                var success = {
                    'members': _memberFacilities,
                    'hosts': await_patch_facility
                };
                if (i == data.memberFacilities.length - 1) {
                    return success;
                }
            }
        } else {
            let len = data.memberFacilities.length - 1;
            for (let i = len; i >= 0; i--) {
                var awaitfacilitiesService = await facilitiesService.get(data.memberFacilities[i], {});
                let checkId = awaitfacilitiesService.memberFacilities.filter(x => x.toString() == data.hostId.toString());
                if (checkId.length > 0) {
                    let index = awaitfacilitiesService.memberFacilities.indexOf(data.hostId);
                    awaitfacilitiesService.memberFacilities.splice(index, 1);
                }
                var awaitfacilitiesService_ = await facilitiesService.patch(awaitfacilitiesService._id, { memberFacilities: awaitfacilitiesService.memberFacilities });
                _memberFacilities.push(awaitfacilitiesService_);
                var awaitGetFacilitiesService = await facilitiesService.get(data.hostId, {});
                let checkId2 = awaitGetFacilitiesService.memberof.filter(x => x.toString() == data.memberFacilities[i].toString());
                if (checkId2.length > 0) {
                    let index = awaitGetFacilitiesService.memberof.indexOf(data.memberFacilities[i]);
                    awaitGetFacilitiesService.memberof.splice(index, 1);
                }
                var awaitPatchFacilitiesService = await facilitiesService.patch(awaitGetFacilitiesService._id, {
                    memberof: awaitGetFacilitiesService.memberof
                });
                var success2 = {
                    'members': _memberFacilities,
                    'hosts': awaitPatchFacilitiesService
                };
                if (i == 0) {
                    return success2;
                }
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