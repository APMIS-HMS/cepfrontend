const { paramsForServer } = require('feathers-hooks-common');
class Service {
    constructor(options) {
        this.options = options || {};
    }
    setup(app) {
        this.app = app;
    }
    async find(params) {
        const organisationService = this.app.service('organisation-services');
        const query = {
            facilityId: params.query.facilityId
        };


        let servicesItems = [];
        if (params.query.isQueryService === undefined) {
            var awaitOrgServices = await organisationService.find(paramsForServer({ query, populate: true, selectedCategory: params.query.categoryId.toString() }));
            servicesItems = awaitOrgServices.data[0].categories.filter(
                x => x._id.toString() === params.query.categoryId.toString()
            );
        } else {
            var awaitOrgServices2 = await organisationService.find(paramsForServer({ query, populate: true }));
            awaitOrgServices2.data[0].categories.forEach(element => {
                const qIndex = element.services.filter(x =>
                    x.name.toLowerCase().includes(params.query.searchString.toLowerCase())
                );
                if (qIndex.length > 0) {
                    element.services = qIndex;
                    servicesItems.push(element);
                }
            });
        }
        if (params.query.isQueryService === undefined) {
            return servicesItems[0];
        } else {
            return servicesItems;
        }
    }
    async create(data, params) {
        const orgService = this.app.service('organisation-services');
        const priceService = this.app.service('facility-prices');
        const tagDictioneriesService = this.app.service('tag-dictioneries');
        if (data.name !== null && data.name !== undefined) {
            const queryDico = await tagDictioneriesService.find({
                query: {
                    word: {
                        $regex: data.name.toString(),
                        $options: 'i'
                    }
                }
            });
            if (queryDico.data.length == 0) {
                const exactWord = queryDico.data.filter(
                    x => x.word.toLowerCase() === data.name.toLowerCase()
                );
                if (exactWord.length == 0) {
                    await tagDictioneriesService.create({
                        word: data.name
                    });
                }
            }
        }
        let organizationServiceItem = await orgService.find({
            query: {
                facilityId: params.query.facilityId
            }
        });
        if (organizationServiceItem.data.length > 0) {
            if (params.query.isCategory.toString() === 'true') {
                organizationServiceItem.data[0].categories.push(data);
                let updatedOrganizationService = await orgService.patch(
                    organizationServiceItem.data[0]._id, {
                        categories: organizationServiceItem.data[0].categories
                    }
                );
                return updatedOrganizationService;
            } else {
                let index = organizationServiceItem.data[0].categories.filter(
                    x => x._id.toString() === params.query.categoryId.toString()
                );
                index[0].services.push(data);
                let lastIndex = 0;
                if (index[0].services.length > 0) {
                    lastIndex = index[0].services.length - 1;
                }
                let updatedOrganizationService = await orgService.patch(
                    organizationServiceItem.data[0]._id, {
                        categories: organizationServiceItem.data[0].categories
                    }
                );
                let index2 = updatedOrganizationService.categories.filter(
                    x => x._id.toString() === params.query.categoryId.toString()
                );
                let serviceId = index2[0].services[lastIndex]._id;
                let priceItem = {
                    facilityServiceId: updatedOrganizationService._id,
                    categoryId: params.query.categoryId,
                    serviceId: serviceId,
                    facilityId: params.query.facilityId,
                    price: data.price
                };
                if (priceItem.price === '') {
                    priceItem.price = 0;
                }
                await priceService.create(priceItem);
                return updatedOrganizationService;
            }
        } else {
            if (data.categories === undefined) {
                data.categories = [];
            }
            data.categories.push({
                name: data.name
            });
            let createdOrgServiceItem = await orgService.create(data);
            return createdOrgServiceItem;
        }
    }
    async update(id, data, params) {
        const orgService = this.app.service('organisation-services');
        const priceService = this.app.service('facility-prices');
        const tagDictioneriesService = this.app.service('tag-dictioneries');
        if (params.query.name !== '') {
            let queryDico = await tagDictioneriesService.find({
                query: {
                    word: {
                        $regex: params.query.name,
                        $options: 'i'
                    }
                }
            });
            if (queryDico.data.length > 0) {
                let exactWord = queryDico.data.filter(
                    x =>
                    x.word.toString().toLowerCase() ===
                    params.query.name.toString().toLowerCase()
                );
                if (exactWord.length == 0) {
                    await tagDictioneriesService.create({
                        word: params.query.name
                    });
                }
            } else {
                await tagDictioneriesService.create({
                    word: params.query.name
                });
            }
        }
        let organizationServiceItem = await orgService.find({
            query: {
                facilityId: params.query.facilityId
            }
        });
        if (organizationServiceItem.data.length > 0) {
            if (params.query.isCategory.toString() === 'true') {
                let index = organizationServiceItem.data[0].categories.filter(
                    x => x._id.toString() === params.query.categoryId.toString()
                );
                index[0].name = params.query.name;
            } else {
                let index = organizationServiceItem.data[0].categories.filter(
                    x => x._id.toString() === params.query.categoryId.toString()
                );
                let index2 = index[0].services.filter(
                    x => x._id.toString() === params.query.serviceId.toString()
                );
                if (index2.length > 0) {
                    index2[0].name = data.name;
                    index2[0].code = data.code;
                    index2[0].panels = data.panels;
                }
            }
            let updatedOrganizationService = await orgService.patch(
                organizationServiceItem.data[0]._id, {
                    categories: organizationServiceItem.data[0].categories
                }
            );
            if (data.price !== undefined) {
                if (data.price.base.priceId !== undefined) {
                    let getPrice = await priceService.get(data.price.base.priceId);
                    getPrice.price = data.price.base.price;
                    if (data.price.others !== undefined) {
                        if (data.price.others.length > 0) {
                            let len4 = data.price.others.length - 1;
                            for (let t = 0; t <= len4; t++) {
                                let index3 = getPrice.modifiers.filter(
                                    x => x._id.toString() === data.price.others[t]._id.toString()
                                );
                                if (index3.length > 0) {
                                    if (index3[0].modifierType === 'Percentage') {
                                        index3[0].modifierValue = data.price.others[t].price;
                                    } else if (index3[0].modifierValue === 'Amount') {
                                        index3[0].modifierValue = data.price.others[t].price;
                                    }
                                }
                            }
                        }
                    }
                    await priceService.patch(getPrice._id, {
                        price: getPrice.price,
                        modifiers: getPrice.modifiers
                    });
                } else {
                    let priceItem = {
                        facilityServiceId: updatedOrganizationService._id,
                        categoryId: params.query.categoryId,
                        serviceId: params.query.serviceId,
                        facilityId: params.query.facilityId,
                        price: data.price.base.price
                    };
                    await priceService.create(priceItem);
                }
            }
            return updatedOrganizationService;
        } else {
            return {};
        }
    }
}
module.exports = function(options) {
    return new Service(options);
};
module.exports.Service = Service;