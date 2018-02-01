/* eslint-disable no-unused-vars */
const moduleStatus = require('../../parameters/module-status');

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
    const facilityModuleService = this.app.service('facility-modules');
    if (params.query.isAll == true) {
      let facility = await facilityService.get(id);
      let facilityModule = await facilityModuleService.find({});
      let len = facility.facilitymoduleId.length - 1;
      if (facility.facilitymoduleId.length > 0) {
        for (let i = len; i >= 0; i--) {
          facilityModule.data.forEach((item, j) => {
            if (item._id.toString() == facility.facilitymoduleId[i]._id.toString()) {
              facilityModule.data.splice(j, 1);
            }
          });
        }
        return facilityModule.data;
      } else {
        return facilityModule;
      }
    } else {
      let facility = await facilityService.get(id);
      let len = facility.facilitymoduleId.length - 1;
      if (facility.facilitymoduleId.length > 0) {
        for (let i = len; i >= 0; i--) {
          let facilityModule = await facilityModuleService.get(facility.facilitymoduleId[i]._id);
          facility.facilitymoduleId[i].name = facilityModule.name;
        }
        return facility;
      } else {
        return [];
      }

    }

  }

  async create(data, params) {
    const facilityService = this.app.service('facilities');
    let facility = await facilityService.get(params.query.facilityId);
    if (params.query.isRemove == true) {
      facility.facilitymoduleId.forEach((item, j) => {
        if (item._id.toString() == params.query.moduleId.toString()) {
          facility.facilitymoduleId.splice(j, 1);
        }
      });
    } else {
      let index = facility.facilitymoduleId.filter(x => x._id.toString() == params.query.moduleId.toString());
      if (index.length == 0) {
        facility.facilitymoduleId.push({
          '_id': params.query.moduleId,
          'isActive': true,
          'canDisable':true,
          'status': moduleStatus.status.pending
        })
      }
    }
    let updatedFacility = await facilityService.patch(facility._id, {
      facilitymoduleId: facility.facilitymoduleId
    });
    return updatedFacility;
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {

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
