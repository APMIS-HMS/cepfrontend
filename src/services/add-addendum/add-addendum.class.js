/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }
    async create(data, params) {
        const documentationService = this.app.service('documentations');
        const selectedPatientDocumentation = await documentationService.get(params.query.patientDocumentationId);
        let l = selectedPatientDocumentation.documentations.length;
        while (l--) {
            const documentation = selectedPatientDocumentation.documentations[l];
            if (documentation._id == params.query.documentationId) {
                documentation.document.addendum = data;
            }
        }
        try {
            const updatePatientDocumentation = await documentationService
                .update(selectedPatientDocumentation._id, selectedPatientDocumentation, { query: { facilityId: params.query.facilityId } });
            return updatePatientDocumentation;
        } catch (error) {
            return error;
        }

    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;