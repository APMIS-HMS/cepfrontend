/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }


    async find(params) {
        var result = {};
        const familiesService = this.app.service('families');
        let findFamiliesService = this.app.service('families').find({
            query: {
                facilityId: params.query.facilityId,
                $limit: false
            }
        });
        if (findFamiliesService.data.length > 0) {
            let len = findFamiliesService.data.length - 1;
            for (let i = len; i >= 0; i--) {
                if (findFamiliesService.data[i].familyCovers.length > 0) {
                    let len2 = findFamiliesService.data[i].familyCovers.length - 1;
                    for (let j = len2; j >= 0; j--) {
                        if (findFamiliesService.data[i].familyCovers[j].filNo != undefined) {
                            if (findFamiliesService.data[i].familyCovers[j].filNo.toLowerCase() == req.query.fillno.toLowerCase()) {
                                result = {
                                    "_id": findFamiliesService.data[i]._id,
                                    "facilityId": findFamiliesService.data[i].facilityId._id,
                                    "facilityName": findFamiliesService.data[i].facilityId.name,
                                    "enrollees": findFamiliesService.data[i].familyCovers[j]
                                };
                            }
                        }
                    }
                }
            }
        }
        return result;
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