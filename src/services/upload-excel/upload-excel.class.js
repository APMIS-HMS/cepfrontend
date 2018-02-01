/* eslint-disable no-unused-vars */
const excelToJson = require('convert-excel-to-json');
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
    return new Promise(function (resolve, reject) {
      try {
        const result = excelToJson({
          sourceFile: data.path,
          outputJSON: false
        });
        resolve({
          error_code: 0,
          err_desc: null,
          data: result
        });
      } catch (e) {
        reject({
          error_code: 1,
          err_desc: 'Corupted excel file'
        });
      }
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

  setup(app){
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
