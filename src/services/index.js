const users = require('./users/users.service.js');
const facilityModules = require('./facility-modules/facility-modules.service.js');
const facilityOwnerships = require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
const facilityClasses = require('./facility-classes/facility-classes.service.js');
const titles = require('./titles/titles.service.js');
const relationships = require('./relationships/relationships.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityOwnerships);
  app.configure(facilityTypes);
  app.configure(facilityClasses);
  app.configure(facilityModules);
  app.configure(titles);
  app.configure(relationships);
};
