class Service {
    constructor(options) {
        this.options = options || {};
    }
    setup(app) {
        this.app = app;
    }
    async find(params) {
        const organisationService = this.app.service('organisation-services');
        const facilityPricesService = this.app.service('facility-prices');
        const serviceTagsService = this.app.service('service-tags');
        var awaitOrgServices = await organisationService.find({
            query: {
                facilityId: params.query.facilityId
            }
        });
        let len = awaitOrgServices.data.length - 1;
        if (awaitOrgServices.data.length > 0) {
            for (let i = len; i >= 0; i--) {
                if (awaitOrgServices.data[i].categories.length > 0) {
                    let len2 = awaitOrgServices.data[i].categories.length - 1;
                    for (let j = len2; j >= 0; j--) {
                        if (awaitOrgServices.data[i].categories[j].services.length > 0) {
                            let len3 = awaitOrgServices.data[i].categories[j].services.length - 1;
                            for (let k = len3; k >= 0; k--) {
                                awaitOrgServices.data[i].categories[j].services[k].price = [];
                                var awaitPriceServices = await facilityPricesService.find({
                                    query: {
                                        facilityId: params.query.facilityId,
                                        categoryId: awaitOrgServices.data[i].categories[j]._id,
                                        serviceId: awaitOrgServices.data[i].categories[j].services[k]._id,
                                        facilityServiceId: awaitOrgServices.data[i]._id
                                    }
                                });
                                if (awaitPriceServices.data.length > 0) {
                                    let len5 = awaitPriceServices.data.length - 1;
                                    for (let n = 0; n <= len5; n++) {
                                        awaitOrgServices.data[i].categories[j].services[k].price.push({
                                            name: 'Base',
                                            isBase: true,
                                            priceId: awaitPriceServices.data[n]._id,
                                            price: awaitPriceServices.data[n].price
                                        });
                                        if (awaitPriceServices.data[n].modifiers !== undefined) {
                                            if (awaitPriceServices.data[n].modifiers.length > 0) {
                                                let len6 = awaitPriceServices.data[n].modifiers.length - 1;
                                                for (let m = 0; m <= len6; m++) {
                                                    if (awaitPriceServices.data[n].modifiers[m].tagId !== undefined) {
                                                        let tag = await serviceTagsService.get(awaitPriceServices.data[n].modifiers[m].tagId);
                                                        if (awaitPriceServices.data[n].modifiers[m].modifierType === 'Percentage') {
                                                            let p = awaitPriceServices.data[n].modifiers[m].modifierValue / 100;
                                                            let calculatedP = p * awaitPriceServices.data[n].price;
                                                            awaitOrgServices.data[i].categories[j].services[k].price.push({
                                                                name: tag.name,
                                                                isBase: false,
                                                                priceId: awaitPriceServices.data[n]._id,
                                                                _id: awaitPriceServices.data[n].modifiers[m]._id,
                                                                price: calculatedP
                                                            });
                                                        } else if (awaitPriceServices.data[n].modifiers[m].modifierType === 'Amount') {
                                                            awaitOrgServices.data[i].categories[j].services[k].price.push({
                                                                name: tag.name,
                                                                isBase: false,
                                                                priceId: awaitPriceServices.data[n]._id,
                                                                _id: awaitPriceServices.data[n].modifiers[m]._id,
                                                                price: awaitPriceServices.data[n].modifiers[m].modifierValue
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    awaitOrgServices.data[i].categories[j].services[k].price.push({
                                        name: 'Base',
                                        isBase: true,
                                        price: ''
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        // results = awaitOrgServices;
        if (params.query.isQueryCategory !== undefined) {
            if (params.query.isQueryCategory.toString() === 'true') {
                awaitOrgServices.data[0].categories = awaitOrgServices.data[0].categories
                    .filter(x => x.name.toLowerCase().includes(params.query.searchString.toLowerCase()));
            }
        }
        if (params.query.isQueryService !== undefined) {
            if (params.query.isQueryService.toString() === 'true') {
                if (awaitOrgServices.data[0].categories.length > 0) {
                    let lt = awaitOrgServices.data[0].categories.length - 1;
                    for (let l = 0; l <= lt; l++) {
                        if (awaitOrgServices.data[0].categories[l].services.length > 0) {
                            awaitOrgServices.data[0].categories[l].services = awaitOrgServices.data[0].categories[l].services
                                .filter(x => {
                                    if (x.name != undefined) {
                                        if (x.name.toLowerCase().includes(params.query.searchString.toLowerCase())) {
                                            awaitOrgServices.data[0].categories[l].isHost = true;
                                            return x;
                                        }
                                    }
                                });
                        }
                    }
                }
            }
        }
        return awaitOrgServices;
    }
    async create(data, params) {
        const orgService = this.app.service('organisation-services');
        const priceService = this.app.service('facility-prices');
        const tagDictioneriesService = this.app.service('tag-dictioneries');
        let queryDico = await tagDictioneriesService.find({
            query: {
                word: {
                    $regex: data.name,
                    '$options': 'i'
                }
            }
        });
        if (queryDico.data.length == 0) {
            let exactWord = queryDico.data.filter(x => x.word.toLowerCase() === data.name.toLowerCase());
            if (exactWord.length == 0) {
                await tagDictioneriesService.create({
                    word: data.name
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
                organizationServiceItem.data[0].categories.push(data);
                let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
                    categories: organizationServiceItem.data[0].categories
                });
                return updatedOrganizationService;
            } else {
                let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
                index[0].services.push(data);
                let lastIndex = 0;
                if (index[0].services.length > 0) {
                    lastIndex = index[0].services.length - 1;
                }
                let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
                    categories: organizationServiceItem.data[0].categories
                });
                let index2 = updatedOrganizationService.categories.filter(x => x._id.toString() === params.query.categoryId.toString());
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
                        '$options': 'i'
                    }
                }
            });
            if (queryDico.data.length > 0) {
                let exactWord = queryDico.data.filter(x => x.word.toString().toLowerCase() === params.query.name.toString().toLowerCase());
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
                let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
                index[0].name = params.query.name;
            } else {
                let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
                let index2 = index[0].services.filter(x => x._id.toString() === params.query.serviceId.toString());
                if (index2.length > 0) {
                    index2[0].name = data.name;
                    index2[0].code = data.code;
                    index2[0].panels = data.panels;
                }
            }
            let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
                categories: organizationServiceItem.data[0].categories
            });
            if (data.price !== undefined) {
                if (data.price.base.priceId !== undefined) {
                    let getPrice = await priceService.get(data.price.base.priceId);
                    getPrice.price = data.price.base.price;
                    if (data.price.others !== undefined) {
                        if (data.price.others.length > 0) {
                            let len4 = data.price.others.length - 1;
                            for (let t = 0; t <= len4; t++) {
                                let index3 = getPrice.modifiers.filter(x => x._id.toString() === data.price.others[t]._id.toString());
                                if (index3.length > 0) {
                                    if (index3[0].modifierType === 'Percentage') {
                                        let val = data.price.others[t].price / (100 * data.price.base.price);
                                        index3[0].price = val;
                                    } else if (index3[0].modifierType === 'Amount') {
                                        index3[0].modifierValue = data.price.others[t].price;
                                    }
                                }
                            }
                        }
                    }
                    await priceService.patch(getPrice._id, getPrice);
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