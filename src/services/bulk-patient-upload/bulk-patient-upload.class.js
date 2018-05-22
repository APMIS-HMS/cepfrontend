/* eslint-disable no-unused-vars */

var isFuture = require('date-fns/is_future');
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
    console.log(data);
    data = JSON.parse(data.data);
    console.log(data);
    const patientService = this.app.service('patients');
    const savePersonService = this.app.service('save-person');
    const searchPeopleService = this.app.service('search-people');
    const patientTagService = this.app.service('suggest-patient-tags');
    let returnData = [];
    let failedAttempts = [];
    let length = data.length;
    if (Array.isArray(data)) {
      for (let i = 0; i < length; i++) {
        let savedPerson;
        let savedPatient;
        let savedPatientTags;
        let datas = {
          person: data[i]
        }
        console.log(data[i]);
        let checkPerson;
        try {
          checkPerson = await searchPeopleService.find({
            query: {
              firstName: data[i].firstName,
              motherMaidenName: '',
              dateOfBirth: data[i].dateOfBirth,
              gender: data[i].gender,
              isValidating: true
            }
          });
        } catch (e) {
          console.log(e);
          return e;
        }

        console.log(checkPerson);
        if (checkPerson.data === false) {
          if (new Date() >= new Date(data[i].dateOfBirth)) {
            try {
              savedPerson = await savePersonService.create(datas);
            } catch (e) {
              const error = String(e.error).toLowerCase();
              if (error.indexOf('duplicate') !== -1) {
                console.log('duplicate');
                failedAttempts.push({
                  data: data[i],
                  message: 'Error, Person with this information already exist'
                });
              } else {
                failedAttempts.push({
                  data: data[i],
                  message: 'Error, creating person information'
                });
              }

            }
            if (savedPerson !== undefined) {
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
                console.log(e);
                failedAttempts.push({
                  data: data[i],
                  message: 'Error, creating Patient'
                });
              }
              console.log(savedPatient);
              let dataForPatientTags = {
                name: data[i].hospId,
                facilityId: data[i].facilityId,
                patientId: savedPatient._id,
                tagType: 'identification'
              }
              //delete data[i].hospId;;
              try {
                savedPatientTags = await patientTagService.create(dataForPatientTags);
                returnData.push(savedPatient);
              } catch (e) {
                console.log(e);
                failedAttempts.push({
                  data: data[i],
                  message: 'Error, Assigning Hospital Id to Patient'
                });
              }
            }
          } else {
            failedAttempts.push({
              data: data[i],
              message: 'Date of birth of patient cannot be beyond today!'
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