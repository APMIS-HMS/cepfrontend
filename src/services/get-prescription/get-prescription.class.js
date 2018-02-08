const console = require('console');
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
      id, text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const prescriptionService = this.app.service('prescrition');
    const patientService = this.app.service('patients');
    const locationService = this.app.service('location');
    const employeeService = this.app.service('employee');


    var prescription = {
      patient: String,
      location: String,
      prescriber: String,
      date: Date
      //priority:String 
    };
    console.log('***************Params**********************');
    console.log(params);
    console.log('***************End Params**********************');
    //Check for facility Id 
    if (data.facilityId !== undefined) {
      console.log('***************Data**********************');
      console.log(data.facilityId);
      console.log('***************End Data**********************');
      prescriptionService.find({ query: data.facilityId }).then(presCallback => {
        console.log('***************Prescriptions**********************');
        console.log(presCallback);
        console.log('***************End Prescriptions**********************');
        if (presCallback.length > 0) {
          presCallback.forEach(element => {
            prescription.patient = patientService.find(element.patientId);
            prescription.location = locationService.find(element.locationId);
            prescription.prescriber = employeeService.find(element.employeeId);
            prescription.data = element.createdAt;
          });
        } else {
          return 'No prescription found';
        }
        return prescription;
      });

    }


    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }

    //return Promise.resolve(data);
  }

  setup(app) {
    this.app = app;
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
