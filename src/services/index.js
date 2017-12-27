const users = require('./users/users.service.js');
const facilityModules = require('./facility-modules/facility-modules.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityModules);
};
