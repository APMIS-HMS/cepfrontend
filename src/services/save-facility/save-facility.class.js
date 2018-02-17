/* eslint-disable no-unused-vars */
const moduleStatus = require('../../parameters/module-status');

const logger = require('winston');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(id, params) {
        return Promise.resolve([]);
    }

    get(id, params) {

        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const userService = this.app.service('users');
        const facilityService = this.app.service('facilities');
        const facilityModuleService = this.app.service('facility-modules');
        const facilityAccessControlService = this.app.service('facility-access-control');
        const featuresService = this.app.service('features');
        const organisationService = this.app.service('organisation-services');

        const pay = await userService.find({ query: { personId: data.personId } });

        if (pay.data.length > 0) {
            let user = pay.data[0];
            let facility = data.facility;
            facility.wallet = { 'transactions': [], 'ledgerBalance': 0, 'balance': 0 };
            let fms = await facilityModuleService.find({ query: { canDisable: false } });
            if (facility.facilitymoduleId === undefined) {
                facility.facilitymoduleId = [];
            }
            fms.data.forEach(element => {
                facility.facilitymoduleId.push({
                    '_id': element._id,
                    'isActive': true,
                    'canDisable': false,
                    'status': moduleStatus.status.active
                });
            });
            facility.facilitymoduleId = fms.data;
            const facPayload = await facilityService.create(facility);
            let facilityRole = { facilityId: facPayload._id, };
            let facilitiesRole = user.facilitiesRole;
            if (user.facilitiesRole === undefined) {
                facilitiesRole = [];
            }


            facilitiesRole.push(facilityRole);



            const allModules = await facilityModuleService.find({
                query: {
                    $or: [{ name: 'facility' }, { name: 'access control' }]
                }
            });
            let allModulesData = allModules.data;
            const facilityModuleIndex = allModulesData.findIndex(x => x.name === 'facility');
            const facilityModuleObj = allModulesData[facilityModuleIndex];

            const AccessModuleIndex = allModulesData.findIndex(x => x.name === 'access control');
            const AccessModuleObj = allModulesData[AccessModuleIndex];



            const allFacilityFeatures = await featuresService.find({ query: { name: 'Facility' } });
            let facilityObjRole = {
                name: 'Facility',
                facilityId: facPayload._id,
                features: []
            };
            let facilityFeatureData = allFacilityFeatures.data;
            var l = facilityFeatureData[0].actions.length;
            while (l--) {
                let feature = facilityFeatureData[0].actions[l];
                feature.moduleId = facilityModuleObj._id;
                feature.moduleName = facilityModuleObj.name;
                facilityObjRole.features.push(feature);
            }


            const allAccessFeatures = await featuresService.find({ query: { name: 'Access Control' } });
            let accessControlObjRole = {
                name: 'Access Control',
                facilityId: facPayload._id,
                features: []
            };
            let accessFeatureData = allAccessFeatures.data;
            var k = accessFeatureData[0].actions.length;
            while (k--) {
                let feature = accessFeatureData[0].actions[k];
                feature.moduleId = AccessModuleObj._id;
                feature.moduleName = AccessModuleObj.name;
                accessControlObjRole.features.push(feature);
            }

            let orgServiceModel = {};
            orgServiceModel.facilityId = facPayload._id;
            orgServiceModel.categories = [];

            let labCategory = {};
            labCategory.name = 'Laboratory';
            labCategory.services = [];
            labCategory.canRemove = false;
            orgServiceModel.categories.push(labCategory);

            let medRecCategory = {};
            medRecCategory.name = 'Medical Records';
            medRecCategory.services = [];
            medRecCategory.canRemove = false;
            orgServiceModel.categories.push(medRecCategory);

            let pharCategory = {};
            pharCategory.name = 'Pharmacy';
            pharCategory.services = [];
            pharCategory.canRemove = false;
            orgServiceModel.categories.push(pharCategory);

            let imaginCategory = {};
            imaginCategory.name = 'Imaging';
            imaginCategory.services = [];
            imaginCategory.canRemove = false;
            orgServiceModel.categories.push(imaginCategory);

            let wardCategory = {};
            wardCategory.name = 'Ward';
            wardCategory.services = [];
            wardCategory.canRemove = false;
            orgServiceModel.categories.push(wardCategory);

            let appCategory = {};
            appCategory.name = 'Appointment';
            appCategory.services = [];
            appCategory.canRemove = false;
            orgServiceModel.categories.push(appCategory);

            let procedureCategory = {};
            procedureCategory.name = 'Procedures';
            procedureCategory.services = [];
            procedureCategory.canRemove = false;
            orgServiceModel.categories.push(procedureCategory);

            let orgServiceResult = await organisationService.create(orgServiceModel);



            const facilityObjRoleCreated = await facilityAccessControlService.create(facilityObjRole);
            const accessControlObjRoleCreated = await facilityAccessControlService.create(accessControlObjRole);

            let userRole = { facilityId: facPayload._id, roles: [] };
            userRole.roles.push(facilityObjRoleCreated._id);
            userRole.roles.push(accessControlObjRoleCreated._id);
            let userRoles = user.userRoles;
            if (user.userRoles == undefined) {
                userRoles = [];
            }
            userRoles.push(userRole);













            const payload = await userService.patch(user._id, { facilitiesRole: facilitiesRole, userRoles: userRoles });
            return facPayload;


        }
        return [];
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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;