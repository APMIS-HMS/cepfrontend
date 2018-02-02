/* eslint-disable no-unused-vars */
const logger = require('winston');
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
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    const employeeService = this.app.service('employees');
    return new Promise(function (resolve, reject) {

      let checkedEmployees = data;
      checkedEmployees.forEach((emp, i) => {
        if (emp.units === undefined) {
          emp.units = [];
        }
        emp.units.push(id);
      });
      
      checkedEmployees.forEach(emp =>{
        employeeService.update(emp._id, emp, {}).then(payload => {
          resolve(payload);
        }, error => {
          reject(error);
        });
      });
    });
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
  setup(app){
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
