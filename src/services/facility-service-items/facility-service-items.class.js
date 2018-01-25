import { error } from "util";

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {

  }

  create(data, params) {
    const facilitiesItemService = this.app.service('facilityservices');
    const serviceModifiersService = this.app.service('servicemodifiers');
    
    data.billItems.forEach((item, i) => {
      item.facilityServiceObject = {};
      item.serviceModifierObject = [];
      facilitiesItemService.get(item.facilityServiceId, {}).then(facilityService => {
        facilityService.categories.forEach(function (category) {
          category.services.filter(function (itm) {
            if (itm._id.toString() == item.serviceId) {
              item.facilityServiceObject.categoryId = category._id;
              item.facilityServiceObject.category = category.name;
              item.facilityServiceObject.service = itm.name;
              item.facilityServiceObject.serviceId = itm._id;
            }
          })
        });
        item.modifierId.filter(id => {
          serviceModifiersService.find({
            query: {
              _id: id
            }
          }).then(modifierItem => {
            item.serviceModifierObject.push(modifierItem.data[0]);
          },error=>{});
        });
      },error=>{});
    });
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
