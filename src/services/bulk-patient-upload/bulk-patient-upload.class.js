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
    const searchPeopleService = this.app.service('search-people');
    const patientTagService = this.app.service('suggest-patient-tags');
    let savedPerson;
    let savedPatient;
    let savedPatientTags;
    let returnData = [];
    let failedAttempts = [];
    let length = data.length;
    if (Array.isArray(data)) {
      for (let i = 0; i < length; i++) {
        let datas = {
          person: data[i]
        }
        let checkPerson = await searchPeopleService.find({
          query: {
            firstName: data[i].firstName,
            motherMaidenName: '',
            dateOfBirth: data[i].dateOfBirth,
            gender: data[i].gender,
            isValidating: true
          }
        });
        console.log(checkPerson, data[i]);
        if (checkPerson.data === false) {
          try {
            savedPerson = await savePersonService.create(datas);
          } catch (e) {
            failedAttempts.push({
              data: data[i],
              message: 'Error, creating person information'
            });
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
          } catch (e) {
            failedAttempts.push({
              data: data[i],
              message: 'Error, creating Patient'
            });
          }
          let dataForPatientTags = {
            name: data[i].hospId,
            facilityId: data[i].facilityId,
            patientId: savedPatient._id,
            tagType: 'identification'
          }
          delete data[i].hospId;;
          try { 
            savedPatientTags = await patientTagService.create(dataForPatientTags);
            returnData.push(savedPatient);
          } catch (e) { 
            failedAttempts.push({
              data: data[i],
              message: 'Error, Assigning Hospital Id to Patient'
            });
          }
        } else {
          failedAttempts.push({
            data: data[i],
            message: 'Record already exist!'
          });
        }

      }
    }

    return {
      success: returnData,
      failed: failedAttempts
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