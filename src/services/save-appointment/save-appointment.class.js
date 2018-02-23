/* eslint-disable no-unused-vars */
var isToday = require('date-fns/is_today');
var isFuture = require('date-fns/is_future');
var isPast = require('date-fns/is_past');
var isWithinRange = require('date-fns/is_within_range');
var isSameDay = require('date-fns/is_same_day');
var addHours = require('date-fns/add_hours');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        let hook = params.query;
        const appointmentService = this.app.service('appointments');
        let appointmentResult;
        if (hook.clinicIds !== undefined && hook.facilityId !== undefined) {
            appointmentResult = await appointmentService.find({
                query: {
                    facilityId: hook.facilityId,
                    clinicId: { $in: hook.clinicIds },
                    $sort: { 'createdAt': -1 }
                }
            });
        } else if (hook.patientId !== undefined) {

            appointmentResult = await appointmentService.find({
                query: {
                    patientId: hook.patientId,
                    $sort: { 'createdAt': -1 }
                }
            });
        } else if (hook._id !== undefined) {
            appointmentResult = await appointmentService.find({
                query: {
                    _id: hook._id,
                    $sort: { 'createdAt': -1 }
                }
            });
        }


        {
            let appointments = [];
            if (hook.isCheckedIn) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isToday(appointment.startDate) && appointment.attendance !== undefined) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }

            if (hook.isFuture) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isFuture(appointment.startDate) || (isToday(appointment.startDate))) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }
            if (hook.isPast) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isPast(appointment.startDate)) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }
            if (hook.isWithinRange) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isWithinRange(appointment.startDate, hook.from, hook.to)) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }
            if (hook.hasDate) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isSameDay(appointment.startDate, hook.startDate)) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }
            if (hook.isAppointmentToday) {
                appointmentResult.data.forEach(function(appointment) {
                    if (isToday(appointment.startDate)) {
                        appointments.push(appointment);
                    }
                });
                appointmentResult.data = appointments;
            }

        }
        return appointmentResult;
    }

    async get(id, params) {
        const appointmentService = this.app.service('appointments');
        const appointment = await appointmentService.get(id, {});
        return appointment;
    }

    create(data, params) {
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