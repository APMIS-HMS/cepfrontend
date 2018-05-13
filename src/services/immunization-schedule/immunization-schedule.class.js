/* eslint-disable no-unused-vars */
const immunizationDB = require('../../custom-models/immunization-schedule-model');

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
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const vaccines = data.vaccines;
        const immunName = data.name;
        const facilityId = data.facilityId;

        var newCategoryServices = [];

        const organisationServices = this.app.service('organisation-services');
        const facilityPriceService = this.app.service('facility-prices');
        const immunizationService = this.app.service('immunization');

        //Get all organisation services
        let org = await organisationServices.find({ query: { facilityId: data.facilityId } });
        console.log('org => ', org);

        let respons = {
            message: 'successful',
            services: String,
            servicePrice: String,
            immunizationSchedule: String
        };

        // Verify if the Facility has any service record
        if (org.data.length > 0) {

            // Declare and define frequently used parameters 
            org = org.data[0];

            var createNewOrgService, createNewFacPrice;
            var createNewImmunSch;


            let facServicePrice = {
                facilityId: data.facilityId,
                categoryId: String,
                serviceId: String,
                facilityServiceId: String,
                serviceCharge: String
            };

            let immunization = {
                facilityId: facilityId,
                name: immunName,
                vaccines: vaccines,
                age: data.age,
                date: Date.now(),
                serviceId: String
            };

            // Define the general service in order to be able to bill the service
            let immuneServiceName = {
                name: immunName,
                code: immunName
            };

            let facilityCategories = org.categories;

            // Filter all service categories under this facility

            let immuCategory = facilityCategories.filter(x => x.name === 'immunization');

            //Extract the organisation services from the category
            let orgServices = immuCategory[0].services;

            //Filter the new vaccines from the entire data sent
            let newVaccines = vaccines.map(x => { return { name: `${immunName} ${x.codeName}`, codeName: x.codeName, price: x.price }; });
            
            //Add the general sevice to the newVaccine array. ~This is every vaccine is treated as a service

            newVaccines.push(immuneServiceName);

            //Merge newVaccines array to organisation list of services
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

            console.log('Org =>', org);

            let vacNew = [];
            try {
                let createNewOrgService = await organisationServices.patch(org._id, org, {});
                console.log('CreateNewOrgService', createNewOrgService);

                if (createNewOrgService._id !== undefined) {
                    //Create services in facilityPrice table
                    let createdServices = createNewOrgService.categories.filter(x => x.name === 'immunization');
                    console.log('createdService =>', createdServices);

                    let catServices = createdServices[0].services;
                    let vacServices = [];
                    let count = 0;
                    let immunServIds = [];

                    catServices.forEach(element => {
                        newVaccines.forEach(vac => {
                            if (element.name === vac.name && element.codeName === vac.codeName) {
                                count++;
                                let vacc = {
                                    name: vac.name,
                                    facilityServiceId: createNewOrgService._id,
                                    categoryId: createdServices[0]._id,
                                    facilityId: facilityId,
                                    serviceId: element._id,
                                    price: vac.price,
                                };
                                immunServIds.push({
                                    serviceId: element._id,
                                    nameCode: vac.name
                                });
                                console.log('vacccc==============>', vacc);
                                vacServices.push(vacc);

                            }
                        });
                    });
                    try {
                        console.log('vacServices===>', vacServices);
                        // Create and attach prices to the newly created services
                        createNewFacPrice = await facilityPriceService.create(vacServices);

                        // Verify if the process above was successfull
                        if (createNewFacPrice.length > 0) {

                            //Attach service Ids to each vaccine
                            immunServIds.forEach(ser => {
                                vaccines.forEach(vac => {
                                    if (ser.name === vac.codeName) {
                                        vac.serviceId = ser.serviceId;
                                        vacNew.push(vac);
                                    }
                                });
                            });
                            // Update the immunization object with most resent values
                            immunization.vaccines = vacNew;
                            immunization.serviceId = createNewOrgService._id;
                            immunization.serviceCharge = data.serviceCharge;
                        }

                        // Create immuzation schedule
                        createNewImmunSch = await immunizationService.create(immunization);

                        //Update client response with most resent values
                        respons.servicePrice = createNewFacPrice;
                        respons.services = createNewOrgService;
                        respons.immunizationSchedule = createNewImmunSch;
                    } catch (error) {
                        console.log('Error found in createNewImmunSch ==>', error);
                    }

                }
            } catch (e) {
                console.log(e);
            }

            return jsend.success(respons);
        } else {

            const services = {
                name: immunName
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
                if(createNewSch.data[0].length >0){
                    respons.services = createNewSch;
                    return jsend.success(respons);
                }
            } catch (error) {
                respons.message = 'Failed to create service';

                return jsend.error(respons);
            }


        }
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
