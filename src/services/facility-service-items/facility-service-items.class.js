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

  create(data, params) {
    console.log("Facility service Item=================");
    console.log(data);
    const facilitiesItemService = this.app.service('organisation-services');
    const serviceModifiersService = this.app.service('servicemodifiers');
    return new Promise(function (resolve, reject) {
      data.billItems.forEach((item, i) => {
        item.facilityServiceObject = {};
        item.serviceModifierObject = [];
        facilitiesItemService.get(item.facilityServiceId, {}).then(facilityService => {
          console.log(facilityService.categories.length);
          facilityService.categories.forEach(category => {
            category.services.forEach(itm => {
              if (itm._id.toString() == item.serviceId.toString()) {
                item.facilityServiceObject.categoryId = category._id;
                item.facilityServiceObject.category = category.name;
                item.facilityServiceObject.service = itm.name;
                item.facilityServiceObject.serviceId = itm._id;
              }
            })
          });
          if (i == data.billItems.length - 1) {
            resolve(data);
          }
        //   item.modifierId.forEach(id => {
        //     serviceModifiersService.find({
        //       query: {
        //         _id: id
        //       }
        //     }).then(modifierItem => {
        //       item.serviceModifierObject.push(modifierItem.data[0]);
        //     }, error => {
        //       reject(error);
        //     });
          
        // });
      }, error => {
        reject(error);
      });
    });
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
