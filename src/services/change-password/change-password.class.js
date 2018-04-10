/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
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

    create(data, params) {
    
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    update(id, data, params) {
        const userService = this.app.service('users');

        return new Promise(function (resolve, reject) {
            userService.get(id).
                then(page => {
                    if (page) {
                        var oldpassword = data.oldpassword;
                        bcrypt.compare(oldpassword, page.password, function (err, result) {
                            if (err) {
                                reject(new Error('Invalid Password'));
                            } else {
                                if (!result) {
                                    reject(new Error('Invalid Password'));
                                } else {
                                    page.password = data.password;
                                    userService.patch(id, page, {}).then(user => {
                                        resolve(result);
                                    }).catch(err => {
                                        reject(new Error('Invalid Password'));
                                    });
                                }
                            }
                        });
                    } else {
                        reject(new Error('Invalid Password'));
                    }
                }, error => {

                });
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

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
