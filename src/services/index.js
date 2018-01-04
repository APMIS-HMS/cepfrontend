const users = require('./users/users.service.js');
const facilityModules = require('./facility-modules/facility-modules.service.js');
const facilityOwnerships = require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
const facilityClasses = require('./facility-classes/facility-classes.service.js');
const titles = require('./titles/titles.service.js');
const locations = require('./locations/locations.service.js');
const relationships = require('./relationships/relationships.service.js');
const genders = require('./genders/genders.service.js');
const maritalStatuses = require('./marital-statuses/marital-statuses.service.js');
const getTokens = require('./get-tokens/get-tokens.service.js');
const facilities = require('./facilities/facilities.service.js');
const uploadImages = require('./upload-images/upload-images.service.js');
const countries = require('./countries/countries.service.js');
const people = require('./people/people.service.js');
const emailers = require('./emailers/emailers.service.js');
const patients = require('./patients/patients.service.js');
const smsSenders = require('./sms-senders/sms-senders.service.js');
const saveFacility = require('./save-facility/save-facility.service.js');
const savePerson = require('./save-person/save-person.service.js');
const employees = require('./employees/employees.service.js');
const appointments = require('./appointments/appointments.service.js');
const organisationServices = require('./organisation-services/organisation-services.service.js');
const categoryTypes = require('./category-types/category-types.service.js');
const resendToken = require('./resend-token/resend-token.service.js');
const joinFacilityChannel = require('./join-facility-channel/join-facility-channel.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityOwnerships);
  app.configure(facilityTypes);
  app.configure(facilityClasses);
  app.configure(facilityModules);
  app.configure(titles);
  app.configure(locations);
  app.configure(relationships);
  app.configure(genders);
  app.configure(maritalStatuses);
  app.configure(getTokens);
  app.configure(facilities);
  app.configure(uploadImages);
  app.configure(countries);
  app.configure(people);
  app.configure(emailers);
  app.configure(patients);
  app.configure(smsSenders);
  app.configure(saveFacility);
  app.configure(savePerson);
  app.configure(employees);
  app.configure(appointments);
  app.configure(organisationServices);
  app.configure(categoryTypes);
  app.configure(resendToken);
  app.configure(joinFacilityChannel);
};
