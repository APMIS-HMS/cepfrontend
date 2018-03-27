// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    
    if (context.params.query.facilityId !== undefined) {
      context.facilityId = context.params.query.facilityId;
      delete context.params.query.facilityId;
    }
    return Promise.resolve(context);
  };
};
