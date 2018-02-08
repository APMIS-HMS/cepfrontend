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

  async get(id, params) {
    const facilityService = this.app.service('facilities');
    const storesService = this.app.service('stores');
    let getFacility = await facilityService.get(id);
    let getFacilityStore = {};
    if(params.query.name != undefined){
      getFacilityStore = await storesService.find({
        query: {
          facilityId: id,
          name: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
    }else if(params.query.minorLocationId != undefined){

      getFacilityStore = await storesService.find({
        query: {
          facilityId: id,
          minorLocationId: params.query.minorLocationId
        }
      });
    }else if(params.query.productTypeId != undefined){
      getFacilityStore = await storesService.find({
        query: {
          facilityId: id,
          'productTypeId.productTypeId':params.query.productTypeId
        }
      });
    }
    
    if (getFacilityStore.data.length > 0) {
      let len = getFacilityStore.data.length - 1;
      for (let j = len; j >= 0; j--) {
        let loc = getFacility.minorLocations.filter(x => x._id.toString() === getFacilityStore.data[j].minorLocationId.toString());
        getFacilityStore.data[j].minorLocation = loc[0];
      }
      return getFacilityStore;
    } else {
      return getFacilityStore;
    }
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
