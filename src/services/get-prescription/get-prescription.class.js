
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
    const locationService = this.app.service('locations');
    const employeeService = this.app.service('employees');
    const personService = this.app.service('peoples');

    const person = [];
    //Check for facility Id 
    if (data.facilityId !== undefined) {
      const facilityId = data.facilityId;
      let pres = await prescriptionService.find({ query: { facilityId: facilityId } });
      console.log('I got here................................');
      if (pres.data.length > 0) {
        const pcounter = 0;
        let counter = pres.data.length;
        while (counter--) {
          pres = pres.data[counter];
          let patientObj = await patientService.get(pres.patientId);
          console.log('=================Patient Id======================');
          console.log(patientObj);
          console.log('====================Patient Id End====================');
          delete patientObj.personDetails.wallet;
          pres.patientDetails = patientObj.personDetails;
          let employeeObj = await employeeService.get(pres.employeeId);
          console.log('=================employeeObj=====================');
          console.log(employeeObj);
          console.log('====================employeeObj End====================');
          delete employeeObj.personDetails.wallet;
          pres.employeeDetails = employeeObj.personDetails;
          counter--;
        }
        if (pcounter === counter) {
          return pres;
        }
      } else {
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
