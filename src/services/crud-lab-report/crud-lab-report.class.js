/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');

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

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const requestService = this.app.service('laboratory-requests');
        const reportService = this.app.service('laboratory-reports');
        const formService = this.app.service('forms');
        const patientService = this.app.service('patients');
        const facilityService = this.app.service('facilities');
        const documentationService = this.app.service('documentations');
        const uploadDocService = this.app.service('upload-doc');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const labRequestId = data.labRequestId;
        const employeeId = data.employeeId;
        const patientId = data.patientId;
        const investigationId = data.investigationId;
        const action = data.action;
        let uploadedDoc;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                if (data.file !== undefined) {
                    
                    try{
                        uploadedDoc = await uploadDocService.create(data.file, {});
                    }
                    catch(e){
                        return jsend.error('Sorry! But an eror occured while uploading. Please try again!');
                    }
                    
                }
                // Get Laboratory request
                const requests = await requestService.find({ query: { facilityId: facilityId, '_id': labRequestId } });

                if (action === 'save') {
                    if (requests.data.length > 0) {
                        const request = requests.data[0];
                        const isUploaded = false;
                        const isSaved = false;

                        request.investigations.forEach(investigation => {
                            if (investigation.investigation._id === investigationId) {
                                if (data.file !== undefined) {
                                    investigation.file = {
                                        name: uploadedDoc.fileName,
                                        url: uploadedDoc.fileUrl
                                    };
                                }
                                if (investigation.investigation.isPanel) {
                                    investigation.report = data;
                                    investigation.isUploaded = isUploaded;
                                    investigation.isSaved = !isSaved;
                                } else {
                                    investigation.report = data;
                                    investigation.isUploaded = isUploaded;
                                    investigation.isSaved = !isSaved;
                                }
                                if (data.file !== undefined) {
                                    investigation.file = {
                                        name: uploadedDoc.fileName,
                                        url: uploadedDoc.fileUrl
                                    };
                                }
                            }
                        });


                        const updateRequest = await requestService.patch(request._id, request, {});

                        if (updateRequest._id !== undefined) {
                            return jsend.success(updateRequest);
                        } else {
                            return jsend.error('There was an error saving request');
                        }
                    } else {
                        return jsend.error('There was an error saving report. Please try again later!');
                    }
                } else if (action === 'upload') {
                    const forms = await formService.find({ query: { title: { $regex: 'laboratory', '$options': 'i' } } });

                    if (forms.data.length > 0) {
                        const form = forms.data[0];
                        const request = requests.data[0];
                        const saveDocument = {
                            documentType: form,
                            body: {}
                        };

                        request.investigations.forEach(investigation => {
                            if (investigation.investigation._id === investigationId) {
                                investigation.report = data;
                                investigation.isUploaded = true;
                                investigation.isSaved = true;
                                if (data.file !== undefined) {
                                    investigation.file = {
                                        name: uploadedDoc.fileName,
                                        url: uploadedDoc.fileUrl
                                    };
                                }

                                saveDocument.body['conclusion'] = investigation.report.conclusion;
                                saveDocument.body['recommendation'] = investigation.report.recommendation;
                                saveDocument.body['outcome'] = investigation.report.outcome;
                                if (investigation.investigation.isPanel) {
                                    investigation.report.result.forEach((report, i) => {
                                        saveDocument.body['result' + i] = report.result;
                                        saveDocument.body['investigation' + i] = report.investigation.investigation.name;
                                        saveDocument.body['specimen' + i] = report.investigation.investigation.specimen.name;
                                    });
                                } else {
                                    saveDocument.body['result'] = investigation.report.result[0].result;
                                    saveDocument.body['investigation'] = investigation.investigation.name;
                                    saveDocument.body['specimen'] = investigation.investigation.specimen.name;
                                }
                                saveDocument.body['diagnosis'] = request.diagnosis;
                                saveDocument.body['clinicalInformation'] = request.clinicalInformation;
                                saveDocument.body['labNumber'] = request.labNumber;
                            }
                        });

                        const updateRequest = await requestService.patch(request._id, request, {});
                        const patient = await patientService.get(patientId);
                        const facility = await facilityService.get(facilityId);

                        if (updateRequest._id !== undefined) {
                            // Build documentation model
                            const patientDocumentation = {
                                document: saveDocument,
                                createdBy: employeeId,
                                facilityId: facilityId,
                                facilityName: facility.name,
                                patientId: patientId,
                                patientName: `${patient.personDetails.firstName} ${patient.personDetails.lastName}`,
                            };

                            const documentation = {
                                personId: patient.personDetails._id,
                                documentations: patientDocumentation,
                            };

                            // Find person Documentation
                            const cDocumentation = await documentationService.find({ query: { 'personId': patient.personDetails._id } });

                            if (cDocumentation.data.length > 0) {
                                cDocumentation.data[0].documentations.push(patientDocumentation);
                                // Update the existing documentation
                                const updateDoc = await documentationService.patch(cDocumentation.data[0]._id, cDocumentation.data[0], {});
                                if (updateDoc._id !== undefined) {
                                    return jsend.success(updateDoc);
                                }
                            } else {
                                // Save into documentation
                                const createDoc = await documentationService.create(documentation);
                                if (createDoc._id !== undefined) {
                                    return jsend.success(createDoc);
                                }
                            }
                        } else {
                            return jsend.error('There was an error saving request');
                        }
                    } else {
                        return jsend.error('There was a problem uploading report. Please try again later!');
                    }
                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
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
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;