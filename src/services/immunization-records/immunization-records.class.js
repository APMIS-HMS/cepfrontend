/* eslint-disable no-unused-vars */
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
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {

        const immuScheduleService = this.app.service('immunization-schedule');
        const appointmentServices = this.app.service('/immunization-appointment');
        const immunizationRecordService = this.app.service('immunization-record-history');

        const facilityId = data.facilityId;
        const patientId = data.patientId;
        const immunizationScheduleId = data.immunizationScheduleId;
        let immunizations = [];

        const appointments = data.appointments;

        if (facilityId !== undefined) {

            if (immunizationScheduleId !== undefined) {

                //immunizations.push(patientId);
                const immunizationSch = await immuScheduleService.find({ query: { _id: immunizationScheduleId } });

                const getVaccines = immunizationSch.data[0].vaccines;

                if (getVaccines.length > 0) {


                    let vaccine = {
                        vaccine: String,
                        appointments: appointments
                    };


                    let vac = [];
                    if (getVaccines.length > 0) {
                        getVaccines.forEach(element => {
                            // appointments.forEach(appoint => {
                            // if(element.serviceId === appoint.serviceId){
                            vaccine.vaccine = element;
                            vaccine.appointments = appointments;
                            //vaccine.appointments = appoint;
                            vac.push(vaccine);
                            // }

                            // });

                        });

                        let immune = {
                            immunizationScheduleId: immunizationScheduleId,
                            immunizationName: immunizationSch.data[0].name,
                            vaccines: vac
                        };

                        let ImmHistory = {
                            facilityId: data.facilityId,
                            patientId: data.patientId,
                            immunizations: immune
                        };

                        try {
                            const history = await immunizationRecordService.create(ImmHistory);


                            if (history.immunizations.length > 0) {
                                let appt = {
                                    date: Date.now,
                                    status: 'valid',
                                    isPast: false,
                                    isFuture: true,
                                    completed: false,
                                    appointmentId: data.appointmentId
                                };
                                try {
                                    const appoint = await appointmentServices.create(appt);
                                } catch (error) {
                                    return jsend.error('Could not post to Immunization appointments schedul');
                                }

                            }
                            //return jsend.success(history);

                        } catch (error) {
                            return jsend.error('Something went wrong ========>>>>>>>>> ', error);
                        }

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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;