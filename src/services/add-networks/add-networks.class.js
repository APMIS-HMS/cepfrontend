/* eslint-disable no-unused-vars */
const logger = require('winston');
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

    async get(id, params) {
        const facilitiesService = this.app.service('facilities');
        var members = [];
        if (params.query.ismember === true) {
            let awaitedFacility = await facilitiesService.get(id, {});
            if (awaitedFacility.memberof != undefined) {
                if (awaitedFacility.memberof.length > 0) {
                    let len = awaitedFacility.memberof.length - 1;
                    for (let i = len; i >= 0; i--) {
                        let awaitedFacility2 = await facilitiesService.get(awaitedFacility.memberof[i], {});
                        members.push(awaitedFacility2);
                    }
                }
            }
            return members;
        } else {
            let awaitedFacility = await facilitiesService.get(id, {});
            if (awaitedFacility.memberFacilities != undefined) {
                if (awaitedFacility.memberFacilities.length > 0) {
                    let len = awaitedFacility.memberFacilities.length - 1;
                    for (let i = len; i >= 0; i--) {
                        let awaitedFacility2 = await facilitiesService.get(awaitedFacility.memberFacilities[i], {});
                        members.push(awaitedFacility2);
                    }
                }
            }
            return members;
        }

    }

    async create(data, params) {
        const facilitiesService = this.app.service('facilities');
        var results = [];
        var errors = [];
        if (params.query.isdelete === false) {
            if (data.memberFacilities.length > 0) {
                var l = data.memberFacilities.length;
                while (l--) {
                    const current = data.memberFacilities[l];

                    var networkMember = await facilitiesService.get(current, {});
                    let checkId = networkMember.memberof.filter(x => x.toString() == data.hostId.toString());
                    if (checkId.length == 0) {
                        networkMember.memberof.push(data.hostId);
                    }

                    var updatedNetworkMember = await facilitiesService.patch(networkMember._id, {
                        memberof: networkMember.memberof
                    });
                    results.push(updatedNetworkMember);

                    var networkHost = await facilitiesService.get(data.hostId, {});
                    let checkId2 = networkHost.memberFacilities.filter(x => x.toString() == current.toString());
                    if (checkId2.length == 0) {
                        networkHost.memberFacilities.push(current);
                    }

                    var payload = await facilitiesService.patch(networkHost._id, {
                        memberFacilities: networkHost.memberFacilities
                    });
                }
                var success = {
                    'members': results,
                    'host': payload
                };
                return success;
            }
        } else {
            let payload;
            if (data.memberFacilities.length > 0) {
                let l = data.memberFacilities.length;
                while (l--) {
                    const current = data.memberFacilities[l];

                    const networkMember = await facilitiesService.get(current, {});
                    let checkId = networkMember.memberof.filter(x => x.toString() == data.hostId.toString());
                    if (checkId.length > 0) {
                        let index = networkMember.memberof.indexOf(data.hostId);
                        networkMember.memberof.splice(index, 1);
                    }

                    const updatedNetworkMember = await facilitiesService.patch(networkMember._id, {
                        memberof: networkMember.memberof
                    });
                    results.push(updatedNetworkMember);

                    const networkHost = await facilitiesService.get(data.hostId, {});
                    let checkId2 = networkHost.memberFacilities.filter(x => x.toString() == current.toString());
                    if (checkId2.length > 0) {
                        let index2 = networkHost.memberFacilities.indexOf(current);
                        networkHost.memberFacilities.splice(index2, 1);
                    }

                    payload = await facilitiesService.patch(networkHost._id, {
                        memberFacilities: networkHost.memberFacilities
                    });

                }
                const success = {
                    'members': results,
                    'host': payload
                };
                return success;
            } else {
                return [];
            }

        }
    }





    createNetwork(data, params) {
        const facilitiesService = this.app.service('facilities');
        var _memberFacilities = [];
        if (params.query.isdelete.toString() == 'false') {
            return new Promise(function(resolve, reject) {
                data.facilityIds.forEach((current, i) => {
                    facilitiesService.get(current, {}).then(networkMember => {
                        let checkId = networkMember.memberFacilities.filter(x => x.toString() == data.hostId.toString());
                        if (checkId.length == 0) {
                            networkMember.memberFacilities.push(data.hostId);
                        }
                        facilitiesService.patch(networkMember._id, {
                            memberFacilities: networkMember.memberFacilities
                        }).then(updateNetworkMember => {
                            _memberFacilities.push(updateNetworkMember);
                            facilitiesService.get(data.hostId, {}).then(networkHost => {
                                let checkId2 = networkHost.memberof.filter(x => x.toString() == current.toString());
                                if (checkId2.length == 0) {
                                    networkHost.memberof.push(current);
                                }
                                facilitiesService.patch(networkHost._id, {
                                    memberof: networkHost.memberof
                                }).then(payload => {
                                    var success = {
                                        'members': memberofs,
                                        'hosts': payload
                                    };
                                    if (i == data.facilityIds.length - 1) {
                                        resolve(success);
                                    }

                                }, error => {
                                    reject(error);
                                });
                            });
                        }, error => {
                            reject(error);
                        });
                    });
                });
            });
        } else {
            return new Promise(function(resolve, reject) {
                data.facilityIds.forEach((current, i) => {
                    facilitiesService.get(current, {}).then(networkMember => {
                        let checkId = networkMember.memberFacilities.filter(x => x.toString() == data.hostId.toString());
                        if (checkId.length > 0) {
                            let index = networkMember.memberFacilities.indexOf(data.hostId);
                            networkMember.memberFacilities.splice(index, 1);
                        }
                        facilitiesService.patch(networkMember._id, {
                            memberFacilities: networkMember.memberFacilities
                        }).then(updateNetworkMember => {
                            _memberFacilities.push(updateNetworkMember);
                            facilitiesService.get(data.hostId, {}).then(networkHost => {
                                let checkId2 = networkMember.memberof.filter(x => x.toString() == current.toString());
                                if (checkId2.length > 0) {
                                    let index = networkMember.memberof.indexOf(data.hostId);
                                    networkMember.memberof.splice(index, 1);
                                }
                                facilitiesService.patch(networkHost._id, {
                                    memberof: networkHost.memberof
                                }).then(payload => {
                                    var success = {
                                        'members': memberofs,
                                        'hosts': payload
                                    };
                                    if (i == data.facilityIds.length - 1) {
                                        resolve(success);
                                    }

                                }, error => {
                                    reject(error);
                                });
                            });
                        }, error => {
                            reject(error);
                        });
                    });
                });
            });
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {

    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;