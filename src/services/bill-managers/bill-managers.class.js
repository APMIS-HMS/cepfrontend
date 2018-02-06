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

    for (let i = len; i >= 0; i--) {
      let len2 = awaitOrgServices.data[i].categories.length - 1;
      for (let j = len2; j >= 0; j--) {
        let len3 = awaitOrgServices.data[i].categories[j].services.length - 1;
        for (let k = len3; k >= 0; k--) {
          // awaitOrgServices.data[i].categories[j].services[k].price = [];
          var awaitPriceServices = await facilityPricesService.find({
            query: {
              facilityId: params.query.facilityId,
              categoryId: awaitOrgServices.data[i].categories[j]._id,
              serviceId: awaitOrgServices.data[i].categories[j].services[k]._id,
              facilityServiceId: awaitOrgServices.data[i]._id
            }
          });
          awaitPriceServices.data.forEach(element => {
            awaitOrgServices.data[i].categories[j].services[k].price =element.price;
          });
        }
      }
    }
    return awaitOrgServices;
  }

  async get(id, params) {

  }

  async create(data, params) {
    if (params.query.isCategoryId == true) {
      const organisationService = this.app.service('organisation-services'); //servicedictioneries
      const tagDictioneriesService = this.app.service('tag-dictioneries'); //servicedictioneries
      var awaitOrgServices = await organisationService.find({
        query: {
          facilityId: params.query.facilityId
        }
      });
      var facilityServiceModel = {};
      var facilityCategoryeModel = {};
      facilityServiceModel.facilityId = params.query.facilityId;
      facilityCategoryeModel.name = data.categoryName;
      facilityCategoryeModel.services = [];
      facilityServiceModel.categories = [];
      if (awaitOrgServices.data.length === 0) {
        facilityServiceModel.categories.push(facilityCategoryeModel);
        await organisationService.create(facilityServiceModel);
        return organisationService;
      } else {
        awaitOrgServices.data[0].categories.push(facilityCategoryeModel);
        await organisationService.patch(awaitOrgServices.data[0]._id, {
          'categories': awaitOrgServices.data[0].categories
        });
        return organisationService;
      }
      var awaitTagDicService = tagDictioneriesService.find({
        query: {
          word: {
            $regex: data.categoryName,
            '$options': 'i'
          }
        }
      });
      if (awaitTagDicService.data.length === 0) {
        await tagDictioneriesService.create({
          word: data.serviceName
        });
      }
    } else {
      var awaitOrgServices = await organisationService.find({
        query: {
          facilityId: this.facility._id
        }
      });
      if (params.query.isUpdateService) {
        awaitOrgServices.data[0].categories.forEach((item, i) => {
          if (item._id.toString() == data.categoryId.toString()) {
            item.services.forEach((itm, l) => {
              if (itm._id.toString() == data.serviceId.toString()) {
                item.services[l].name = data.serviceName;
                item.services[l].code = data.serviceCode;
              }
            });
          }
        });
        await organisationService.patch(awaitOrgServices.data[0]._id, {
          'categories': awaitOrgServices.data[0].categories
        });
      } else {
        awaitOrgServices.data[0].categories.forEach((item, i) => {
          if (item._id.toString() == data.categoryId.toString()) {
            item.services.push(data.serviceName);
          }
        });
      }
      await organisationService.patch(awaitOrgServices.data[0]._id, {
        'categories': awaitOrgServices.data[0].categories
      });
      var awaitTagDicService = tagDictioneriesService.find({
        query: {
          word: {
            $regex: data.serviceName,
            '$options': 'i'
          }
        }
      });
      if (awaitTagDicService.data.length === 0) {
        await tagDictioneriesService.create({
          word: data.serviceName
        });
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
