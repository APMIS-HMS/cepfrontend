/* eslint-disable no-unused-vars */
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

    get(id, params) {

    }

    async create(data, params) {
        const facilitiesItemService = this.app.service('organisation-services');
        const serviceModifiersService = this.app.service('servicemodifiers');
        let len2 = data.length - 1;
        for (let i = len2; i >= 0; i--) {
            let len3 = data[i].billItems.length - 1;
            for (let j = len3; j >= 0; j--) {
                data[i].billItems[j].facilityServiceObject = {};
                data[i].billItems[j].serviceModifierObject = [];
                var awaitFacilitiesItemService = await facilitiesItemService.get(data[i].billItems[j].facilityServiceId, {});
                awaitFacilitiesItemService.categories.forEach(category => {
                    category.services.forEach(itm => {
                        if (itm._id.toString() == data[i].billItems[j].serviceId.toString()) {
                            data[i].billItems[j].facilityServiceObject.categoryId = category._id;
                            data[i].billItems[j].facilityServiceObject.category = category.name;
                            data[i].billItems[j].facilityServiceObject.service = itm.name;
                            data[i].billItems[j].facilityServiceObject.serviceId = itm._id;
                        }
                    });
                });
            }
        }

        return data;
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