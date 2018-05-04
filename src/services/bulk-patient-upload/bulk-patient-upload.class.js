/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
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
    const patientService = this.app.service('patients');
    const savePersonService = this.app.service('save-person');
    let savedPerson;
    let savedPatient;
    let returnData = [];
    let failedAttempts = [];
    let length = data.length;
    if (Array.isArray(data)) {
      for (let i = 0; i < length; i++) {
        let datas = {
          person: data[i]
        }
        try {
          savedPerson = await savePersonService.create(datas);
        } catch (e) {
          failedAttempts.push(data[i]);
        }
        let patient = {
          personId: savedPerson._id,
          facilityId: data[i].facilityId
        }
        if (data[i].payPlan.toLowerCase() === 'wallet') {
          patient.paymentPlan = [
            {
              planType: 'wallet',
              bearerPersonId: savedPerson._id,
              isDefault: true
            }
          ]
        }
        try {
          savedPatient = await patientService.create(patient);
          returnData.push(savedPatient);
        } catch (e) {
          failedAttempts.push(data[i]);
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
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;