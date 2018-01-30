/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find (params) {
    return Promise.resolve([]);
  }

  async get (id, params) {
    const facilitiesService = this.app.service('facilities');
    const featuresService = this.app.service('features');
    var results = [];
    var errors = [];

    let selectedFacility = await facilitiesService.get(id, {});
    let features = await featuresService.find({});

    features.data.forEach((feature, i) => {
      console.log(selectedFacility.facilitymoduleId.includes(features._id));
      if(selectedFacility.facilitymoduleId.includes(features._id)){
        feature.isAssigned = true;
        results.push(feature);
      }else{
        feature.isAssigned = false;
        results.push(feature);
      }
    });

    console.log(results);

    return results;
    /* return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    }); */
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
