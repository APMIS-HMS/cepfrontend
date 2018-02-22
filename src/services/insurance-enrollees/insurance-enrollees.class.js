/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        let result = [];
        const hmoService = this.app.service('hmos');
        const facilityService = this.app.service('facilities');
        let findHmoService = await hmoService.find({
            query: {
                facilityId: params.query.facilityId,
                $limit: false
            }
        });
        if (findHmoService.data.length > 0) {
            let len = findHmoService.data.length - 1;
            for (let i = len; i >= 0; i--) {
                if (findHmoService.data[i].hmos.length > 0) {
                    let len2 = findHmoService.data[i].hmos.length - 1;
                    for (let j = len2; j >= 0; j--) {
                        let facility = await facilityService.find({
                            query: {
                                '_id': findHmoService.data[i].hmos[j].hmo
                            }
                        });
                        let res = {
                            hmoId: findHmoService.data[i].hmos[j].hmo,
                            hmoName: facility.data[0].name,
                            enrollees: findHmoService.data[i].hmos[j].enrolleeList
                        };
                        result.push(res);
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
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;