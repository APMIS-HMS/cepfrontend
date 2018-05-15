/* eslint-disable no-unused-vars */
const immunizationRecordModel = require('../../custom-models/immunization-record-model');
const jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    find (params) {
        return Promise.resolve([]);
    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create (data, params) {

        const immuScheduleService = this.app.service('immunization-schedule');
        const appointmentServices = this.app.service('appointments');

        const facilityId = data.facilityId;
        const patientId = data.patientId;
        const immunizationScheduleId = data.immunizationScheduleId;
        let immunizations = [];
                    
        if(facilityId !== undefined){
            if(immunizationScheduleId!==undefined){
                immunizations.push(facilityId);
                immunizations.push(immunizationScheduleId);
                immunizations.push(patientId);

                const immunizationSch = await immuScheduleService.get({_id:immunizationScheduleId});

                if(immunizationSch.data[0].length > 0){
                    const getVaccines = immunizationSch.data[0].map(x => x.name === 'vaccines');

                    let vaccine ={
                        vaccine:String
                    };
                    let immune={
                        immunizationScheduleId:immunizationSch._id,
                        immunizationName:immunizationSch.immunizationName,
                        vaccines:vaccine
                    };

                    if(getVaccines.length >0){
                        getVaccines.forEach(element => {
                            vaccine.vaccine = element;
                            immunizations.push(immune);
                        });

                        const history = await immunizationRecordModel.create(immunizations);

                        return jsend.success(history);
                    }else{
                        return jsend.error('No vaccine found');
                    }
                }
            }else{
                return jsend.error('Immunization schedule not found!');
            }
        }else{
            return jsend.error('Facility is undefined!');
        }

        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    update (id, data, params) {
        return Promise.resolve(data);
    }

    patch (id, data, params) {
        return Promise.resolve(data);
    }

    remove (id, params) {
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
