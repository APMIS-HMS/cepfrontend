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
    const prescriptionService = this.app.service('prescriptions');
    const patientService = this.app.service('patients');
    const locationService = this.app.service('location');
    const employeeService = this.app.service('employees');
    const personService = this.app.service('people');


    const person = {
      firstName: String,
      lastName: String,
      otherNames: String,
      email: String,
      apmisId: String
      //priority:String 
    };
    console.log(params);
    console.log('***************End Params**********************');
    //Check for facility Id 
    if (data.facilityId !== undefined) {
      console.log('***************Data**********************');
      console.log(data.facilityId);
      const facilityId = data.facilityId;
      console.log('***************End Data**********************');
      let pres = await prescriptionService.find({query:{facilityId:facilityId}});
      console.log(pres);
      console.log('Got here');

      if (pres.data.length > 0) {
        const pcounter = pres.data.length;
        let counter = 0;
        //pres = pres.data;
        //while(pres.data.length >= 0)
        pres.data.forEach(element => {
          console.log('***********Start***********');
          console.log(element.patientId);
          console.log('***********End***********');
          patientService.get(element.patientId).then(resPatient => {
            console.log('***********Start***********');
            console.log(resPatient);
            console.log('***********End***********');
            const patientObj = {
              firstName: resPatient.personDetails.firstName,
              lastName: resPatient.personDetails.lastName,
              email: resPatient.personDetails.email,
              apmisId: resPatient.personDetails.apmisId
            };
            element.patient = patientObj;
            // let employee = employeeService.get(element.employeeId);
            // if (patient !== undefined || employee !== undefined) {
            //   console.log('Found patient!********');
            //   let person = personService.get(patient.data.personId);
            //   employee = employee.get(employee.data.personId);
            //   pres.push(person);
            //   pres.push(employee);
            //   console.log(pres);
            // }
          }).catch(err => {
            console.log(err);
          });
          counter++;
        });
        if (pcounter === counter) {
          return pres;
        }
      }else{
        return 'No prescription found';
      }
    } else {
      return 'No prescription found';
    }
  }

  //}


  // if (Array.isArray(data)) {
  //   return Promise.all(data.map(current => this.create(current)));
  // }

  //return Promise.resolve(data);
  // }
  // }
  //}

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
