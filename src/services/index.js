const users = require('./users/users.service.js');
const facilityOwnerships = require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityOwnerships);
  app.configure(facilityTypes);
};
