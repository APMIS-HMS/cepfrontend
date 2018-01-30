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
    const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
    const fileName = params.query.fileName;
    var rawdata = data.rawImage;
    var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], 'base64');

    return new Promise(function (resolve, reject) {
      var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
      blobSvc.createBlockBlobFromText('personcontainer', fileName, buffer, { contentType: type }, function (error, result, response) {

        if (error) {
          reject(error);
        } else {
          resolve({
            fileName: fileName,
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
