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

  async create(data, params) {
    const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
    var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
    const fileExtArr = data.name.split(".");
    const fileExt = fileExtArr[fileExtArr.length - 1];
    let fileName;

    var rawdata = data.base64;
    var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    const type = data.docType;
    var contentType = matches[1];
    var buffer = new Buffer(matches[2], 'base64');
    const container = data.container;

    if (type === 'laboratory report') {
      fileName = data.labRequestId + '_' + data.investigationId + '.' + fileExt;
    } else if (type === 'logo') {

    }

    return new Promise(function (resolve, reject) {

      blobSvc.createBlockBlobFromText(container, fileName, buffer, { contentType: contentType }, function (error, result, response) {

        if (result !== null) {
          const fileUrl = blobSvc.getUrl(result.container, result.name);
          if (error) {
            reject(error);
          } else {
            resolve({
              fileName: fileName,
              fileUrl: fileUrl,
              response: response
            });
          }
        }else{
          reject([])
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
