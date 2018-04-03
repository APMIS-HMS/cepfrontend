// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    console.log(context.params);
    if (context.params.query !== undefined) {
      if (context.params.query.loginFacilityId !== undefined) {
        context.facilityId = JSON.parse(JSON.stringify(context.params.query.loginFacilityId));
        delete context.params.query.loginFacilityId;
      }
    }
    return Promise.resolve(context);
  };
};
