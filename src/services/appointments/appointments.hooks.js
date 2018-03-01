const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');
var startOfDay = require('date-fns/start_of_day');
var endOfDay = require('date-fns/end_of_today');
var isToday = require('date-fns/is_today');
const resolvers = {
    joins: {
        patientDetails: () => async(appointment, context) => {
            const patient = await context.app
                .service('patients')
                .get(appointment.patientId, {});
            appointment.patientDetails = patient;
        },
        providerDetails: () => async(appointment, context) => {
            if (appointment.doctorId !== undefined) {
                const employee = await context.app
                    .service('employees')
                    .get(appointment.doctorId, {});
                appointment.providerDetails = employee;
            }
        },

        checkVitals: () => async(appointment, context) => {
            let vitals = [];
            appointment.hasDoneVital = false;
            const start = startOfDay(new Date());
            const end = endOfDay(new Date());
            const patientDocumentations = await context.app
                .service('documentations')
                .find({
                    query: {
                        'documentations.patientId': appointment.patientId,
                        'documentations.document.body.vitals.updatedAt': { '$gte': start, '$lt': end },
                        $select: { 'documentations.document.body.vitals.$': 1 }
                    }
                });
            if (patientDocumentations.data.length > 0) {
                vitals = [];
                let patientDocumentation = patientDocumentations.data[0];

                let l = patientDocumentation.documentations.length;
                while (l--) {
                    const documentation = patientDocumentation.documentations[l];
                    if (
                        documentation.document.documentType !== undefined &&
                        documentation.document.documentType.title === 'Vitals'
                    ) {
                        //
                        let m = documentation.document.body.vitals.length;
                        while (m--) {
                            const vital = documentation.document.body.vitals[m];
                            if (isToday(vital.updatedAt)) {
                                vitals.push(vital);
                                appointment.hasDoneVital = true;
                            }
                        }

                    }
                }





                // patientDocumentation.documentations.forEach(documentation => {
                //     if (
                //         documentation.document.documentType !== undefined &&
                //         documentation.document.documentType.title === 'Vitals'
                //     ) {
                //         documentation.document.body.vitals.forEach(vital => {
                //             vitals.push(vital);
                //         });
                //     }
                // });

                // console.log(vitals);
            }
        },

        // getVitals() {
        //     this.vitals = [];
        //     this.patientDocumentation.documentations.forEach(documentation => {
        //         if (
        //             documentation.document.documentType !== undefined &&
        //             documentation.document.documentType.title === 'Vitals'
        //         ) {
        //             documentation.document.body.vitals.forEach(vital => {
        //                 this.vitals.push(vital);
        //             });
        //         }
        //     });
        //     console.log(this.vitals);
        // }
    }
};
module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [fastJoin(resolvers)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};