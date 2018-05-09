const { authenticate } = require('@feathersjs/authentication').hooks;
const alerts = require('../../hooks/alerts');
const { fastJoin } = require('feathers-hooks-common');
var differenceInYears = require('date-fns/difference_in_years');
var differenceInMonths = require('date-fns/difference_in_months');
var differenceInWeeks = require('date-fns/difference_in_weeks');
var differenceInDays = require('date-fns/difference_in_days');
const resolvers = {
    joins: {
        personDetails: () => async(patient, context) => {
            const person = await context.app
                .service('people')
                .get(patient.personId, {});
            var age = differenceInYears(Date.now(), person.dateOfBirth);
            if (age < 5) {
                const monthResult = differenceInMonths(Date.now(), person.dateOfBirth);
                if (monthResult < 1) {
                    const weekResult = differenceInWeeks(
                        Date.now(),
                        person.dateOfBirth
                    );
                    if (weekResult < 1) {
                        const dayResult = differenceInDays(
                            Date.now(),
                            person.dateOfBirth
                        );
                        age = (dayResult > 1) ? dayResult + ' days' : dayResult + ' day';
                    } else {
                        age = (weekResult > 1) ? weekResult + ' weeks' : weekResult + ' week';
                    }
                } else {
                    age = (monthResult > 1) ? monthResult + ' months' : monthResult + ' month';
                }
            } else {
                age = (age > 1) ? age + ' years' : age + ' year';
            }
            patient.age = age;
            patient.personDetails = person;
        }
    }
};

const facilityObj = {
    joins: {
        facilityDetails: () => async(patient, context) => {
            if (patient.facilityId !== undefined) {
                const facility = await context.app
                    .service('facilities')
                    .get(patient.facilityId, {});

                patient.facilityObj = { name: facility.name, _id: facility._id, email: facility.email, primaryContactPhoneNo: facility.primaryContactPhoneNo, shortName: facility.shortName };
            }

        }
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
        find: [fastJoin(facilityObj)],
        get: [fastJoin(facilityObj)],
        create: [alerts()],
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