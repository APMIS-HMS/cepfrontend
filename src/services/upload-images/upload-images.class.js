/* eslint-disable no-unused-vars */
const logger = require('winston');
var azure = require('azure-storage');
var path = require('path');

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

  setup(app) {
    this.app = app;
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
    // var filePath = path.join(__dirname, 'Sunday2.jpg');
    // logger.info(data.rawImage);
    var rawdata = data.rawImage;
    var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], 'base64');

    return new Promise(function (resolve, reject) {
      var blobSvc = azure.createBlobService('apmisstorageaccount', 'cfxdD7jxijVT8jXi5iDJEoMI4t5zesdlQH6vDJcU5ohfZSMrgM6QkK9wlaIwovKhCOyl3RLwgGpgLhlU19EBhw==');
      blobSvc.createBlockBlobFromText('personcontainer', 'myblob2', buffer, { contentType: type }, function (error, result, response) {

        if (error) {
          reject(error);
        } else {
          resolve({
            result: params,
            response: response
          });
        }
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
