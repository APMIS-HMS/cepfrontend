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
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    var patientDocumentation = {};
    var vitalObjs = req.body;
    const documentationsService = this.app.service('documentations');
    let findDocumentationsService = await app.service('documentations').find({
      query: {
        'personId._id': req.query.personId
      }
    });
    if (findDocumentationsService.data.length === 0) {
      patientDocumentation.personId = req.query.personId;
      patientDocumentation.documentations = [];
      let createDocumentationsService = documentationsService.create(patientDocumentation);
      patientDocumentation = createDocumentationsService;
      addVitals(documentationsService, patientDocumentation, vitalObjs);
    } else {
      if (findDocumentationsService.data[0].documentations.length === 0) {
        patientDocumentation = findDocumentationsService.data[0];
      } else {
        let findDocumentationsService_ = documentationsService.find({
          query: {
            'personId._id': req.query.personId,
            'documentations.patientId': req.query.patientId,
          }
        });
        patientDocumentation = findDocumentationsService_.data[0];
        addVitals(documentationsService, patientDocumentation, vitalObjs);
      }
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

function addVitals(documentationsService, patientDocumentation, vitalObjs) {
  let isExisting = false;
  let len = patientDocumentation.documentations.length - 1;
  for (let k = len; k >= 0; k--) {
    if (patientDocumentation.documentations[k].document == undefined) {
      patientDocumentation.documentations[k].document = {
        documentType: vitalObjs.documentType
      };
    }
    if (patientDocumentation.documentations[k].document.documentType._id != undefined &&
      patientDocumentation.documentations[k].document.documentType._id === vitalObjs.documentType._id) {
      isExisting = true;
      patientDocumentation.documentations[k].document.body.vitals.push({
        pulseRate: vitalObjs.pulseRate,
        respiratoryRate: vitalObjs.respiratoryRate,
        temperature: vitalObjs.temperature,
        bodyMass: vitalObjs.heightWeight,
        bloodPressure: vitalObjs.bloodPressure,
        abdominalCondition: vitalObjs.abdominalCondition,
        updatedAt: new Date()
      });
    }
    if (k == 0) {
      if (!isExisting) {
        var doc = {};
        doc.facilityId = vitalObjs.facilityObj;
        doc.createdBy = vitalObjs.employeeObj;
        doc.patientId = req.query.patientId;
        doc.document = {
          documentType: vitalObjs.documentType,
          body: {
            vitals: []
          }
        }
        doc.document.body.vitals.push({
          pulseRate: vitalObjs.pulseRate,
          respiratoryRate: vitalObjs.respiratoryRate,
          temperature: vitalObjs.temperature,
          bodyMass: vitalObjs.heightWeight,
          bloodPressure: vitalObjs.bloodPressure,
          abdominalCondition: vitalObjs.abdominalCondition,
          updatedAt: new Date()
        });
        patientDocumentation.documentations.push(doc);
      }
      documentationsService.patch(patientDocumentation._id,{documentations:patientDocumentation.documentations}).then(payload => {
        return vitalObjs;
      })
    }
  }
};

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
