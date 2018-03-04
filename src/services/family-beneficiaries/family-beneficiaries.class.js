/* eslint-disable no-unused-vars */
const logger = require('winston');
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
    const operation = data;
    let app = this.app;

    return new Promise(function (resolve, reject) {
      app.service('families').find({
        query: {
          'facilityId': operation.facilityId
        }
      }).then(payload => {
        if (payload.data.length > 0) {
          let facFamilyCover = payload.data[0];
          if (operation.operation === 'update') {
            let model = {
              filNo: operation.model.filNo,
              surname: operation.model.surname,
              othernames: operation.model.othernames,
              gender: operation.model.gender,
              serial: operation.model.serial,
              address: operation.model.address,
              email: operation.model.email,
              phone: operation.model.phone,
              status: operation.model.status
            };
            const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
            facFamilyCover.familyCovers[indexEnrollee] = model;
            operation.dependants.forEach((dependant, i) => {
              if (dependant.operation === 'update') {
                let model = {
                  category: 'DEPENDANT',
                  filNo: dependant.filNo,
                  othernames: dependant.othernames,
                  gender: dependant.gender,
                  serial: dependant.serial,
                  surname: dependant.surname,
                  address: operation.model.address,
                  email: dependant.email,
                  phone: dependant.phone,
                  status: dependant.status
                };
                const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
                facFamilyCover.familyCovers[indexEnrollee] = model;
              } else if (dependant.operation === 'save') {
                let model = {
                  category: 'DEPENDANT',
                  filNo: operation.model.filNo + String.fromCharCode(65 + i),
                  othernames: dependant.othernames,
                  gender: dependant.gender,
                  serial: facFamilyCover.familyCovers.length + 1,
                  surname: dependant.surname,
                  address: operation.model.address,
                  email: dependant.email,
                  phone: dependant.phone,
                  status: dependant.status
                };
                facFamilyCover.familyCovers.push(model);
              }
            });


            app.service('families').update(facFamilyCover._id, facFamilyCover).then(pay => {
              resolve(pay);
            });
          } else if (operation.operation === 'save') {
            let model = {
              category: 'PRINCIPAL',
              filNo: operation.model.filNo,
              othernames: operation.model.othernames,
              gender: operation.model.gender,
              serial: facFamilyCover.familyCovers.length + 1,
              surname: operation.model.surname,
              address: operation.model.address,
              email: operation.model.email,
              phone: operation.model.phone,
              status: operation.model.status
            };
            facFamilyCover.familyCovers.push(model);
            operation.dependants.forEach((dependant, i) => {
              if (dependant.operation === 'update') {
                let model = {
                  category: 'DEPENDANT',
                  filNo: dependant.filNo,
                  othernames: dependant.othernames,
                  gender: dependant.gender,
                  serial: dependant.serial,
                  surname: dependant.surname,
                  address: operation.model.address,
                  email: dependant.email,
                  phone: dependant.phone,
                  status: dependant.status
                };
                const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
                facFamilyCover.familyCovers[indexEnrollee] = model;
              } else if (dependant.operation === 'save') {
                let model = {
                  category: 'DEPENDANT',
                  filNo: operation.model.filNo + String.fromCharCode(65 + i),
                  othernames: dependant.othernames,
                  gender: dependant.gender,
                  serial: facFamilyCover.familyCovers.length + 1,
                  surname: dependant.surname,
                  address: operation.model.address,
                  email: dependant.email,
                  phone: dependant.phone,
                  status: dependant.status

                };
                facFamilyCover.familyCovers.push(model);
              }
            });

            app.service('families').update(facFamilyCover._id, facFamilyCover).then(pay => {
              resolve(pay);
            });
          }
        } else {

          let familyCover = {
            facilityId: operation.facilityId,
            familyCovers: []
          };

          app.service('families').create(familyCover).then(pay => {

            let facFamilyCover = pay;
            if (operation.operation === 'update') {

              let model = {
                filNo: operation.model.filNo,
                surname: operation.model.surname,
                othernames: operation.model.othernames,
                gender: operation.model.gender,
                serial: operation.model.serial,
                address: operation.model.address,
                email: operation.model.email,
                phone: operation.model.phone,
                status: operation.model.status
              };
              const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
              facFamilyCover.familyCovers[indexEnrollee] = model;

              operation.dependants.forEach((dependant, i) => {
                if (dependant.operation === 'update') {
                  let model = {
                    category: 'DEPENDANT',
                    filNo: dependant.filNo,
                    othernames: dependant.othernames,
                    gender: dependant.gender,
                    serial: dependant.serial,
                    surname: dependant.surname,
                    address: operation.model.address,
                    email: dependant.email,
                    phone: dependant.phone,
                    status: dependant.status
                  };
                  const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
                  facFamilyCover.familyCovers[indexEnrollee] = model;
                } else if (dependant.operation === 'save') {
                  let model = {
                    category: 'DEPENDANT',
                    filNo: operation.model.filNo + String.fromCharCode(65 + i),
                    othernames: dependant.othernames,
                    gender: dependant.gender,
                    serial: facFamilyCover.familyCovers.length + 1,
                    surname: dependant.surname,
                    address: operation.model.address,
                    email: dependant.email,
                    phone: dependant.phone,
                    status: dependant.status
                  };
                  facFamilyCover.familyCovers.push(model);
                }
              });


              app.service('families').update(facFamilyCover._id, facFamilyCover).then(pay => {
                resolve(pay);
              });
            } else if (operation.operation === 'save') {
              let model = {
                category: 'PRINCIPAL',
                filNo: operation.model.filNo,
                othernames: operation.model.othernames,
                gender: operation.model.gender,
                serial: facFamilyCover.familyCovers.length + 1,
                surname: operation.model.surname,
                address: operation.model.address,
                email: operation.model.email,
                phone: operation.model.phone,
                status: operation.model.status
              };

              facFamilyCover.familyCovers.push(model);
              operation.dependants.forEach((dependant, i) => {
                if (dependant.operation === 'update') {
                  let model = {
                    category: 'DEPENDANT',
                    filNo: dependant.filNo,
                    othernames: dependant.othernames,
                    gender: dependant.gender,
                    serial: dependant.serial,
                    surname: dependant.surname,
                    address: operation.model.address,
                    email: dependant.email,
                    phone: dependant.phone,
                    status: dependant.status
                  };
                  const indexEnrollee = facFamilyCover.familyCovers.findIndex(x => x.serial === model.serial);
                  facFamilyCover.familyCovers[indexEnrollee] = model;
                } else if (dependant.operation === 'save') {
                  let model = {
                    category: 'DEPENDANT',
                    filNo: operation.model.filNo + String.fromCharCode(65 + i),
                    othernames: dependant.othernames,
                    gender: dependant.gender,
                    serial: facFamilyCover.familyCovers.length + 1,
                    surname: dependant.surname,
                    address: operation.model.address,
                    email: dependant.email,
                    phone: dependant.phone,
                    status: dependant.status
                  };
                  facFamilyCover.familyCovers.push(model);

                }
              });

              app.service('families').update(facFamilyCover._id, facFamilyCover).then(pay => {
                resolve(pay);
              });
            }
          });
        }
      });
    }
    );

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
