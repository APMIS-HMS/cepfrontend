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

  async create(data, params) {
    console.log(data);
    if (data.uploadType === 'documentUpload') {
      var rawdata = data.base64;
      let docType = data.docType;
      let docName = data.docName;
      let patientId = data.patientId;
      let facilityId = data.facilityId;
      let description = data.description;
      let fileType = data.fileType;

      let fileName;
      if (fileType == 'application/pdf') {
        fileName = patientId + '_' + docType + '_' + Date.now() + '.pdf';
      } else if (fileType.indexOf('image') != -1) {
        var ext = fileType.split('/');
        fileName = patientId + '_' + docType + '_' + Date.now() + '.' + ext[1];
      }
      const uploadImageService = this.app.service('upload-images');
      var result;
      try {
        result = await uploadImageService.create(data, { fileName: fileName });
      } catch(e) {
        return e;
      }
      let blobUrl;
      try {
        blobUrl = await uploadImageService.find({
          query: {
            container: 'personcontainer', fileName: fileName
          }
        });
      }catch(e){
        return e;
      }
      let doc = {
        patientId: patientId,
        facilityId: facilityId,
        docType: docType,
        docName: docName,
        description: description,
        docUrl: blobUrl,
        fileType: fileType
      };
      let createDoc = await this.app.service('doc-upload').create(doc);
      return createDoc;
    } else {
      return [];
    }

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
