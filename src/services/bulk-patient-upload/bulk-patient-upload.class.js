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
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const patientService = this.app.service('patients');
        const savePersonService = this.app.service('save-person');
        let savedPerson;
        let savedPatient;
        let returnData = [];
        let failedAttempts = [];
        if (Array.isArray(data)) {
            data.map(async function(current) {
                let data = {
                    person: current
                }
                try {
                    savedPerson = await savePersonService.create(data);
                } catch (e) {
                    failedAttempts.push(current);
                }

                let patient = {
                    personId: savedPerson._id,
                    facilityId: current.facilityId
                }

                if (current.payPlan.toLowerCase() === 'wallet') {
                    patient.paymentPlan = [{
                        planType: 'wallet',
                        bearerPersonId: savedPerson._id,
                        isDefault: true
                    }]
                }

                try {
                    savedPatient = await patientService.create(patient);
                } catch (e) {
                    failedAttempts.push(current);
                }

                returnData.push(savedPatient);

            });
        }

        return {
            saved: returnData,
            failed: failedAttempts
        };

        //return Promise.resolve(data);
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