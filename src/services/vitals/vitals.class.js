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
    console.log("A");
    let selectedPerson = await personService.get(req.query.personId, {});
    console.log("B");
    let findDocumentationsService = await documentationsService.find({
      query: {
        'personId': req.query.personId
      }
    });
    console.log("C");
    if (findDocumentationsService.data.length === 0) {
      console.log("D");
      patientDocumentation.personId = req.query.personId;
      console.log("E");
      patientDocumentation.documentations = [];
      console.log("F");
      let createDocumentationsService = await documentationsService.create(patientDocumentation);
      console.log("G");
      patientDocumentation = createDocumentationsService;
      console.log("H");
      addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
      console.log("I");
    } else {
      if (findDocumentationsService.data[0].documentations.length === 0) {
        console.log("J");
        patientDocumentation = findDocumentationsService.data[0];
        console.log("K");
        addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
      } else {
        let findDocumentationsService_ = await documentationsService.find({
          query: {
            'personId': req.query.personId
          }
        });
        console.log(findDocumentationsService_.data);
        console.log("L");
        if (findDocumentationsService_.data.length > 0) {
          console.log("M");
          patientDocumentation = findDocumentationsService_.data[0];
          console.log("N");
          addVitals(documentationsService, patientDocumentation, vitalObjs, req, selectedPerson);
          console.log("O");
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
  console.log(1);
  let len = patientDocumentation.documentations.length - 1;
  console.log(len+" seize of the length");
  console.log(2);
  for (let k = len; k >= 0; k--) {
    console.log("2---3");
    if (patientDocumentation.documentations[k].document == undefined) {
      patientDocumentation.documentations[k].document = {
        documentType: vitalObjs.documentType
      };
      console.log(3);
    }
    if (patientDocumentation.documentations[k].document.documentType._id != undefined &&
      patientDocumentation.documentations[k].document.documentType._id === vitalObjs.documentType._id) {
      console.log(4);
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
      console.log(5);
    }
  }
  if (!isExisting) {
    console.log(7);
    var doc = {};
    console.log(9);
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
    console.log(10);
    doc.document.body.vitals.push({
      pulseRate: vitalObjs.pulseRate,
      respiratoryRate: vitalObjs.respiratoryRate,
      temperature: vitalObjs.temperature,
      bodyMass: vitalObjs.heightWeight,
      bloodPressure: vitalObjs.bloodPressure,
      abdominalCondition: vitalObjs.abdominalCondition,
      updatedAt: new Date()
    });
    console.log(11);
    patientDocumentation.documentations.push(doc);
    console.log(12);
  }
  let docS = documentationsService.patch(patientDocumentation._id, {
    documentations: patientDocumentation.documentations
  });
  console.log(13);
  return vitalObjs;
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
