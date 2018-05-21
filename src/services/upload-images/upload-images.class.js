/* eslint-disable no-unused-vars */
const logger = require('winston');
var azure = require('azure-storage');
var path = require('path');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return new Promise(function (resolve, reject) {
      const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
      var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
      let blobUrl = blobSvc.getUrl(params.query.container, params.query.fileName);
      resolve(blobUrl);
      
    });

  }

  get(id, params) {
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    console.log(data);
    const dataString = data.data;
    console.log(dataString);
    data = JSON.parse(dataString);
    console.log(data);
    const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
    var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
    const fileName = params.query.fileName;
    var rawdata = data.base64;
    var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], 'base64');
    const container = data.container;

    return new Promise(function (resolve, reject) {

      blobSvc.createBlockBlobFromText(container, fileName, buffer, { contentType: type }, function (error, result, response) {

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
