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
        const vaccines = data.vaccines;
        const immuneName = data.name;
        const immunePrice = data.price;
        const facilityId = data.facilityId;

        const organisationServices = this.app.service('organisation-services');
        const facilityPriceService = this.app.service('facility-prices');
        const immunizationService = this.app.service('immunization-schedule');

        try {
            const checkImmuneName = await immunizationService.find({
                query: {
                    facilityId: facilityId,
                    name: {
                        $regex: immuneName,
                        '$options': 'i'
                    }
                }
            });

            if (checkImmuneName.data.length === 0) {
                //Get all organisation services
                let org = await organisationServices.find({
                    query: {
                        facilityId: facilityId
                    }
                });

                // Verify if the Facility has any service record
                if (org.data.length > 0) {
                    // Declare and define frequently used parameters
                    org = org.data[0];

                    let immunization = {
                        facilityId: facilityId,
                        name: immuneName,
                        vaccines: vaccines,
                        serviceId: String
                    };

                    // Facility Categories.
                    let facilityCategories = org.categories;
                    // Filter all service categories under this facility
                    let immuCategory = facilityCategories.filter(x => x.name.toLowerCase() === 'immunization');
                    // Extract the organisation services from the category
                    let orgServices = immuCategory[0].services;
                    // Filter the new vaccines from the entire data sent
                    let newVaccines = vaccines.map(x => {
                        return {
                            name: `${immuneName} ${x.code}`,
                            code: x.code,
                            price: x.price
                        };
                    });
                    // Add the general sevice to the newVaccine array. ~That is every vaccine is treated as a service
                    newVaccines.push({
                        name: immuneName,
                        code: immuneName,
                        price: immunePrice
                    });
                    // Merge newVaccines array to organisation list of services
                    let concatService = orgServices.concat(newVaccines);
                    immuCategory[0].services = concatService;
                    // Loop through the main obj and attach the category and new services
                    for (let i = 0; i < org.categories.length; i++) {
                        let newCategory = org.categories[i];

                        if (newCategory._id === immuCategory[0]._id) {
                            org.categories[i] = immuCategory[0];
                            break;
                        }
                    }
                    try {
                        let createNewOrgService = await organisationServices.patch(org._id, org, {});

                        if (createNewOrgService._id !== undefined) {
                            //Create services in facilityPrice table
                            let createdServices = createNewOrgService.categories.filter(x => x.name.toLowerCase() === 'immunization');

                            let catServices = createdServices[0].services;
                            let vacServices = [];

                            catServices.forEach(element => {
                                newVaccines.forEach(vac => {
                                    if ((element.name === vac.name && element.code === vac.code) && vac.name === immuneName) {
                                        immunization.serviceId = element._id;
                                    }
                                    if (element.name === vac.name && element.code === vac.code) {
                                        let vacc = {
                                            name: vac.name,
                                            facilityServiceId: createNewOrgService._id,
                                            categoryId: createdServices[0]._id,
                                            facilityId: facilityId,
                                            serviceId: element._id,
                                            price: vac.price,
                                            code: vac.code
                                        };
                                        vacServices.push(vacc);
                                    }
                                });
                            });
                            try {
                                let vacNew = [];
                                // Create and attach prices to the newly created services
                                const createNewFacPrice = await facilityPriceService.create(vacServices);
                                // Verify if the process above was successfull
                                if (createNewFacPrice.length > 0) {

                                    //Attach service Ids to each vaccine
                                    vacServices.forEach(ser => {
                                        vaccines.forEach(vac => {
                                            if (ser.code === vac.code) {
                                                vac.serviceId = ser.serviceId;
                                                vacNew.push(vac);
                                            }
                                        });
                                    });
                                    // Update the immunization object with most resent values
                                    immunization.vaccines = vacNew;
                                    //immunization.serviceId = createNewOrgService._id;
                                    immunization.price = data.price;
                                }

                                try {
                                    // Create immuzation schedule
                                    const createNewImmunSch = await immunizationService.create(immunization);
                                    return jsend.success(createNewImmunSch);
                                } catch (e) {
                                    return jsend.error('Failed to create immunization schedule');
                                }
                            } catch (error) {
                                return jsend.error('Failed to create Facility price');
                            }
                        }
                    } catch (e) {
                        return jsend.error('Failed to add/patch new services to existing ones');
                    }
                } else {
                    const services = {
                        name: immuneName
                    };
                    const categories = {
                        name: 'immunization',
                        services: services
                    };

                    const newOrgSev = {
                        facilityId: facilityId,
                        categories: categories
                    };
                    try {
                        var createNewSch = await organisationServices.create(newOrgSev);
                        if (createNewSch.data[0].length > 0) {
                            //respons.services = createNewSch;
                            return jsend.success(createNewSch);
                        }
                    } catch (error) {
                        return jsend.error('Failed to create service');
                    }
                }
            } else {
                return jsend.error(`Record with name ${immuneName} already exist!`);
            }
        } catch (e) {
            return jsend('Immunization create process failed \n', e);
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({
            id
        });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;