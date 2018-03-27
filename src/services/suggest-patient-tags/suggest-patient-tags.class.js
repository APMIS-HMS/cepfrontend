/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const tagName = params.query.word;
    const facilityId = params.query.facilityId;
    const tagService = this.app.service('service-tags');

    const tags = await tagService.find({
      query: { name: { $regex: tagName, '$options': 'i' }, facilityId: facilityId }
    });

    const tagsData = tags.data;

    let tagsLength = tagsData.length;
    let tagsArr = [];

    while (tagsLength--) {
      if (tagsData[tagsLength].tagType !== undefined) {
        if (tagsData[tagsLength].tagType.toLowerCase() !== "identification") {
          tagsArr.push(tagsData[tagsLength]);
        }
      } else {
        tagsArr.push(tagsData[tagsLength]);
      }
    }


    return tagsArr;

    //return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const tagService = this.app.service('service-tags');
    const patientService = this.app.service('patients');
    const patientId = data.patientId;
    const identity = data.identity;

    let tag;
    const checkPatientTags = await patientService.find({
      query: {
        _id: patientId
      }
    });
    const patientData = checkPatientTags.data[0];

    tag = await tagService.find({
      query: {
        name: data.name,
        facilityId: data.facilityId
      }
    });
    if (tag.data.length > 0) {
      if(tag.data[0].tagType === 'identification'){
        return jsend.error('Identity tag already assigned');
      }
      const patientTags = patientData.tags.filter(x => x.name === data.name);
      if (patientTags.length > 0) {
        return jsend.error('Tag already assigned to patient');
        return [];
      } else {
        delete data.patientId;
        patientData.tags.push(data);
        const patchedPatient = await patientService.patch(patientData._id, patientData);
        return jsend.success(patchedPatient);
      }
    } else {
      const createdTag = await tagService.create(data);
      patientData.tags.push(createdTag);
      const patchedPatient = await patientService.patch(patientData._id, patientData);
      return jsend.success(patchedPatient);
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
