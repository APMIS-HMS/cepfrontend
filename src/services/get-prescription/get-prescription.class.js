const jsend = require('jsend');
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
        const prescriptionService = this.app.service('prescriptions');
        const patientService = this.app.service('patients');
        const locationService = this.app.service('locations');
        const employeeService = this.app.service('employees');
        const personService = this.app.service('peoples');

        //const person = [];
        //Check for facility Id
        const facilityId = data.query.facilityId;
        if (facilityId !== undefined) {
            let prescriptions = await prescriptionService.find({ query: { facilityId: facilityId } });

            const pLength = prescriptions.data.length;
            let i = prescriptions.data.length;
            let counter = 0;
            if (pLength === 0) {
                return jsend.success([]);
            } else if (pLength > 0) {
                prescriptions = prescriptions.data;
                while (i--) {
                    let prescription = prescriptions[i];
                    let patientId = prescription.patientId;
                    let employeeId = prescription.employeeId;

                    const patient = await patientService.get(patientId);
                    delete patient.personDetails.wallet;
                    prescription.personDetails = patient.personDetails;
                    let employee = await employeeService.get(employeeId);
                    delete employee.personDetails.wallet;
                    prescription.employeeDetails = employee.personDetails;
                    counter++;
                }
                if (pLength === counter) {
                    return jsend.success(prescriptions);
                }
            } else {
                return jsend.error('Prescription not properly referenced!');
            }
        } else {
            return jsend.error('Facility does not exist!');
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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;