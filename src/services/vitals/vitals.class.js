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
    var vitalObjs = data;
    const req = params;
    const documentationsService = this.app.service('documentations');
    const personService = this.app.service('people');
    let selectedPerson = await personService.get(req.query.personId, {});
    let findDocumentationsService = await documentationsService.find({
      query: {
        'personId': req.query.personId
      }
    });
    if (findDocumentationsService.data.length === 0) {
      patientDocumentation.personId = req.query.personId;
      patientDocumentation.documentations = [];
      let createDocumentationsService = await documentationsService.create(patientDocumentation);
      patientDocumentation = createDocumentationsService;
      addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
    } else {
      if (findDocumentationsService.data[0].documentations.length === 0) {
        patientDocumentation = findDocumentationsService.data[0];
        addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
      } else {
        let findDocumentationsService_ = await documentationsService.find({
          query: {
            'personId': req.query.personId
          }
        });
        if (findDocumentationsService_.data.length > 0) {
          patientDocumentation = findDocumentationsService_.data[0];
          addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
        } else {
          return new Error('Patient record not found!');
        }


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
  setup(app) {
    this.app = app;
  }
}

function addVitals(documentationsService, patientDocumentation, vitalObjs, req, person) {
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
  }
  if (!isExisting) {
    var doc = {};
    doc.facilityId = vitalObjs.facilityObj._id;
    doc.facilityName = vitalObjs.facilityObj.name;
    doc.createdBy = vitalObjs.employeeObj.personDetails.title + ' ' + vitalObjs.employeeObj.personDetails.lastName + ' ' + vitalObjs.employeeObj.personDetails.firstName;
    doc.patientId = req.query.patientId;
    doc.patientName = person.title + ' ' + person.lastName + ' ' + person.firstName;
    doc.document = {
      documentType: vitalObjs.documentType,
      body: {
        vitals: []
      }
    };
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
  let docS = documentationsService.patch(patientDocumentation._id, {
    documentations: patientDocumentation.documentations
  });
  return vitalObjs;
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
