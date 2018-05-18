/* eslint-disable no-unused-vars */
const immunizationRecordModel = require('../../custom-models/immunization-record-model');
const jsend = require('jsend');
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

        const immuScheduleService = this.app.service('immunization');
        const appointmentServices = this.app.service('appointments');
        const immunizationRecordService = this.app.service('immunization-record-history');

        const facilityId = data.facilityId;
        const patientId = data.patientId;
        const immunizationScheduleId = data.immunizationScheduleId;
        let immunizations = [];
        let appointments = [];

        if (facilityId !== undefined) {
            console.log('facilityId found!');
            if (immunizationScheduleId !== undefined) {
                console.log('immunizationScheduleId found!');
                //immunizations.push(patientId);
                console.log('immunizations found!', immunizations);
                const immunizationSch = await immuScheduleService.find({ query: { _id: immunizationScheduleId } });

                const getVaccines = immunizationSch.data[0].vaccines;
                console.log('getVaccines successfull============!', getVaccines);


                if (getVaccines.length > 0) {


                    let vaccine = {
                        vaccine: String,
                        appointments: appointments
                    };
                    let immune = {
                        immunizationScheduleId: immunizationSch.data[0]._id,
                        immunizationName: immunizationSch.data[0].name,
                        vaccines: vaccine
                    };

                    let ImmHistory = {
                        facilityId: String,
                        patientId: String,
                        immunizations: immune
                    };

                    let vac = [];
                    if (getVaccines.length > 0) {
                        getVaccines.forEach(element => {
                            vaccine.vaccine = element;
                            vaccine.appointments = element.appointments;
                            vac.push(vaccine);
                        });
                        console.log('immmmmmmm successfull============!', immunizations);
                        const history = await immunizationRecordService.create(immunizations);
                        console.log('History successfull============!', history);
                        return jsend.success(history);
                    } else {
                        return jsend.error('No vaccine found');
                    }
                }
            } else {
                return jsend.error('Immunization schedule not found!');
            }
        } else {
            return jsend.error('Facility is undefined!');
        }

        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
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

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
