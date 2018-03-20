/* eslint-disable no-unused-vars */
const tokenLabel = require('../../parameters/token-label');
const sms = require('../../templates/sms-sender');
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

    create(data, params) {
        const userService = this.app.service('users');
        return new Promise(function(resolve, reject) {
            userService
                .find({
                    query: {
                        verificationToken: data.token
                    }
                })
                .then(
                    users => {
                        if (users.data.length > 0) {
                            const context = users.data[0];
                            context.password = data.password;
                            context.verificationToken = '';
                            userService.patch(context._id, { password: data.password, verificationToken: '', isTokenVerified: true }).then(
                                user => {
                                    resolve({ isPasswordChanged: true });
                                },
                                userError => {
                                    reject(userError);
                                }
                            );
                        } else {
                            reject(new Error('User not found'));
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    update(id, data, params) {
        const userService = this.app.service('users');
        const tokenService = this.app.service('get-tokens');
        const peopleService = this.app.service('people');

        return new Promise(function(resolve, reject) {
            tokenService.get(tokenLabel.tokenType.facilityVerification, {}).then(
                payload => {
                    peopleService
                        .find({
                            query: {
                                apmisId: id,
                                primaryContactPhoneNo: data.primaryContactPhoneNo
                            }
                        })
                        .then(
                            people => {
                                if (people.data.length > 0) {
                                    const person = people.data[0];
                                    userService
                                        .find({
                                            query: { personId: person._id }
                                        })
                                        .then(
                                            users => {
                                                if (users.data.length > 0) {
                                                    const context = users.data[0];
                                                    context.verificationToken = payload.result;

                                                    //   var payload = await facilitiesService.patch(networkHost._id, {
                                                    //     memberFacilities: networkHost.memberFacilities
                                                    // });

                                                    userService.patch(context._id, { verificationToken: payload.result }).then(
                                                        user => {
                                                            sms.sendPasswordResetToken({
                                                                primaryContactPhoneNo: data.primaryContactPhoneNo,
                                                                verificationToken: user.verificationToken
                                                            });
                                                            resolve({ isToken: true });
                                                        },
                                                        userError => {
                                                            reject(userError);
                                                        }
                                                    );
                                                } else {
                                                    reject(
                                                        new Error(
                                                            'Invalid APMISID or Telephone Number supplied, correct and try again!'
                                                        )
                                                    );
                                                }
                                            },
                                            usersError => {
                                                reject(usersError);
                                            }
                                        );
                                } else {
                                    reject('Person record not found');
                                }
                            },
                            peopleError => {
                                reject(peopleError);
                            }
                        );
                },
                error => {
                    reject(error);
                }
            );
        });
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