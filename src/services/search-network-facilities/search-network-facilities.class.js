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
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    if (params.query.isMemberOf === false) {
      let facilities_ = await facilitiesService.find({
        query: {
          name: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
      if(facilities_.data != undefined){
        let len2 = facilities_.data.length - 1;
        for (let i = len2; i >= 0; i--) {
          let index = facilities_.data[i].memberof.filter(x => x.toString() == id.toString());
          if (index.length > 0) {
            facilities_.data[i].isMember = true;
            results.push(facilities_.data[i]);
          } else {
            facilities_.data[i].isMember = false;
            results.push(facilities_.data[i]);
          }
        }
      }
      return results;
    } else {
      let facilities_ = await facilitiesService.find({
        query: {
          name: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
      if(facilities_.data != undefined){
        let len2 = facilities_.data.length - 1;
        for (let i = len2; i >= 0; i--) {
          let index = facilities_.data[i].memberFacilities.filter(x => x.toString() == id.toString());
          if (index.length > 0) {
            facilities_.data[i].isMember = true;
            results.push(facilities_.data[i]);
          } else {
            facilities_.data[i].isMember = false;
            results.push(facilities_.data[i]);
          }
        }
      }
      return results;
    }
  }

  create(data, params) {

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
