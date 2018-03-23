/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const tagName = params.query.word;
    const facilityId = params.query.facilityId;
    const tagService = this.app.service('service-tags');

    const tags = await tagService.find({
      query: { name: { $regex: tagName, '$options': 'i' }, facilityId: facilityId }
    });

    const tagsData = tags.data;

    let tagsLength = tagsData.length;
    let tagsArr = [];

    while(tagsLength--){
      if(tagsData[tagsLength].tagType !== undefined){
        if(tagsData[tagsLength].tagType.toLowerCase() !== "identification"){
          tagsArr.push(tagsData[tagsLength]);
        }
      }else{
        tagsArr.push(tagsData[tagsLength]);
      }
    }


    return tagsArr;

    //return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }

  setup(app){
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
