/* eslint-disable no-unused-vars */
const logger = require('winston');
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
                awaitPriceServices.data.forEach(element => {
                  awaitOrgServices.data[i].categories[j].services[k].price.push({
                    name: 'Base',
                    price: element.price
                  });

                  element.modifiers.forEach(mPrices => {
                    if (mPrices.modifierType === 'Percentage') {
                      let p = mPrices.modifierValue / 100;
                      let calculatedP = p * element.price;
                      awaitOrgServices.data[i].categories[j].services[k].price.push({
                        name: mPrices.tagId.name,
                        price: calculatedP
                      });
                    } else if (mPrices.modifierType === 'Amount') {
                      awaitOrgServices.data[i].categories[j].services[k].price.push({
                        name: mPrices.tagId.name,
                        price: mPrices.modifierValue
                      });
                    }
                  })
                });
              }
            }
          }
        }
      }
    }

    return awaitOrgServices;
  }

  async get(id, params) {

  }

  async create(data, params) {
    const orgService = this.app.service('organisation-services');
    const priceService = this.app.service('facility-prices');
    const tagDictioneriesService = this.app.service('tag-dictioneries');
    let queryDico = await tagDictioneriesService.find({
      query: {
        word: {
          $regex: params.query.name,
          '$options': 'i'
        }
      }
    });
    if (queryDico.data.length == 0) {
      let dic = await tagDictioneriesService.create({
        word: params.query.name
      });
    }
    let organizationServiceItem = await orgService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    if (organizationServiceItem.data.length > 0) {
      console.log(params.query);
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

        console.log(index[0].services);
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
        }
        let createPrice = await priceService.create(priceItem);
        return updatedOrganizationService;
      }
    } else {
      let createdOrgServiceItem = await orgService.create(data);
      return createdOrgServiceItem;
    }
  }

  async update(id, data, params) {
    const orgService = this.app.service('organisation-services');
    const priceService = this.app.service('facility-prices');
    const tagDictioneriesService = this.app.service('tag-dictioneries');
    if (params.query.name !== "") {
      let queryDico = await tagDictioneriesService.find({
        query: {
          word: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
      if (queryDico.data.length == 0) {
        let dic = await tagDictioneriesService.create({
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
      console.log(params.query);
      if (params.query.isCategory.toString() === 'true') {
        let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        index[0].name = params.query.name;
      } else {
        let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        let index2 = index[0].services.filter(x => x._id.toString() === params.query.serviceId.toString());
        index2[0].name = params.query.name;
      }
      let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
        categories: organizationServiceItem.data[0].categories
      });
      return updatedOrganizationService;
    } else {
      return {};
    }
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
