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
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
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

  async patch(id, data, params) {
    const employeeService = this.app.service('employees');
    const workspaceService = this.app.service('workspaces');
    const facilitiesService = this.app.service('facilities');
    const storeService = this.app.service('stores');
    let emp = await employeeService.patch(id, data);
    if (emp != null) {
      let selectedfacility = await facilitiesService.get(emp.facilityId);
      let workspaces = await workspaceService.find({
        query: {
          facilityId: emp.facilityId,
          employeeId: emp._id
        }
      });
      emp.workSpaces = workspaces.data;
      if (emp.workSpaces.length > 0) {
        let len = emp.workSpaces.length - 1;
        for (let i = len; i >= 0; i--) {
          if (emp.workSpaces[i].locations.length > 0) {
            let len2 = emp.workSpaces[i].locations.length - 1;
            for (let j = len2; j >= 0; j--) {
              if (selectedfacility.minorLocations.length > 0) {
                let loc = selectedfacility.minorLocations.filter(x => x._id.toString() == emp.workSpaces[i].locations[j].minorLocationId.toString());
                emp.workSpaces[i].locations[j].name = loc[0].name;
                if (emp.storeCheckIn != undefined) {
                  if (emp.storeCheckIn.length > 0) {
                    let index = emp.storeCheckIn.filter(x => x.minorLocationId.toString() == emp.workSpaces[i].locations[j].minorLocationId.toString());
                    if (index.length > 0) {
                      index.forEach(element => {
                        element.minorLocation = loc[0].name;
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      let storeItems = await storeService.find({
        query: {
          facilityId: emp.facilityId
        }
      });
      if (emp.storeCheckIn != undefined) {
        if (emp.storeCheckIn.length > 0) {
          if (storeItems.data != undefined) {
            if (storeItems.data.length > 0) {
              let len3 = storeItems.data.length - 1;
              for (let k = len3; k >= 0; k--) {
                let index3 = emp.storeCheckIn.filter(x => x.storeId.toString() === storeItems.data[k]._id.toString());
                if (index3.length > 0) {
                  index3.forEach(element=>{
                    element.store = storeItems.data[k].name;
                  });
                }
              }
            }
          }
        }
      }
      return emp;
    } else {
      return {};
    }
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
