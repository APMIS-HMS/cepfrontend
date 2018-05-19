/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  /* async find(params) {
    //return Promise.resolve([]);
    const employeeService = this.app.service('employees');
    const workspaceService = this.app.service('workspaces');
    const locationService = this.app.service('locations');
    let workspaces = await workspaceService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    let length = workspaces.data.length;
    while (length--) {
      if (workspaces.data[length].isActive === false) {
        workspaces.data.splice(length, 1);
      } else {
        let emp = await employeeService.find({
          query: {
            _id: workspaces.data[length].employeeId
          }
        });
        let locLen = workspaces.data[length].locations.length;
        while (locLen--) {
          if (workspaces.data[length].locations[locLen].isActive === true) {
            let loc = await locationService.find({
              query: {
                _id: workspaces.data[length].locations[locLen].majorLocationId
              }
            })
            workspaces.data[length].locations[locLen].majorLocation = loc.data[0];
            delete workspaces.data[length].locations[locLen].majorLocationId;
          } else {
            workspaces.data[length].locations.splice(locLen, 1);
          }

        }
        workspaces.data[length].employee = emp.data[0];
        delete workspaces.data[length].employeeId;
      }
    }
    return workspaces;
  } */

  async find(params) {
    const employeeService = this.app.service('employees');
    const workspaceService = this.app.service('workspaces');
    const locationService = this.app.service('locations');
    let workspaces = await workspaceService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    let length = workspaces.data.length;
    while (length--) {
      if (workspaces.data[length].isActive === false) {
        workspaces.data.splice(length, 1);
      }
    }
    let arr = this.combineArr(workspaces.data);
    let arrLen = arr.length;
    while(arrLen--){
      let emp = await employeeService.find({
        query: {
          _id: arr[arrLen].employeeId
        }
      });
      arr[arrLen].employee = emp.data[0];
      let wsc = arr[arrLen].workspaces;
      let wscLen = wsc.length;
      while(wscLen--){
        let locLen = wsc[wscLen].locations.length;
        while (locLen--) {
          if (wsc[wscLen].locations[locLen].isActive === true) {
            let loc = await locationService.find({
              query: {
                _id: wsc[wscLen].locations[locLen].majorLocationId
              }
            })
            wsc[wscLen].locations[locLen].majorLocation = loc.data[0];
            delete wsc[wscLen].locations[locLen].majorLocationId;
          } else {
            wsc[wscLen].locations.splice(locLen, 1);
          }

        }
      }
    }
    return arr;
  }

  combineArr(myArray) {
    var groups = {};
    for (var i = 0; i < myArray.length; i++) {
      var groupName = myArray[i].employeeId;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(myArray[i]);
    }
    myArray = [];
    for (var groupName in groups) {
      myArray.push({ employeeId: groupName, workspaces: groups[groupName] });
    }
    return myArray;
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
