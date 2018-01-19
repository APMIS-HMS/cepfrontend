/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    const employeeService = this.app.service('employees');
    const workspaceService = this.app.service('workspaces');

    return new Promise(function (resolve, reject) {
      var Rx = require('rxjs/Rx');


      const filtered = data.filtered;
      const employeesId = data.employeesId;
      const facilityId = data.facilityId;
      const majorLocationId = data.majorLocationId;
      const minorLocationId = data.minorLocationId;

      const createArrays = [];
      const updateArrays = [];
      workspaceService.find({
        query:
          { facilityId: facilityId, 'employeeId._id': { $in: employeesId }, $limit: 100 }
      }).then(payload => {
        filtered.forEach((iteme, e) => {
          let hasRecord = false;
          if (payload.data.filter(x => x.employeeId._id === iteme._id).length > 0) {
            hasRecord = true;
          }
          if (hasRecord) {
            updateArrays.push(iteme);
          } else {
            createArrays.push(iteme);
          }
        });

        const workSpaces$ = [];
        {
          const workSpaces = [];
          createArrays.forEach((emp, i) => {
            const space = {};
            space.employeeId = emp;
            space.facilityId = facilityId;
            space.locations = [];
            const locationModel = {};
            locationModel.majorLocationId = majorLocationId._id;
            locationModel.minorLocationId = minorLocationId._id;
            space.locations.push(locationModel);
            workSpaces.push(space);
            workSpaces$.push(Rx.Observable.fromPromise(workspaceService.create(space)));
          });
        }

        {
          payload.data.forEach((work, i) => {
            const locationModel = {};
            locationModel.majorLocationId = majorLocationId;
            locationModel.minorLocationId = minorLocationId;
            work.locations.push(locationModel);
            workSpaces$.push(Rx.Observable.fromPromise(workspaceService.update(work)));
          });
        }
        Rx.Observable.forkJoin(workSpaces$).subscribe(results => {
          resolve(results);
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
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
    return Promise.resolve({ id });
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
