// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('winston');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    logger.info(context);
    return Promise.resolve(context);
  };
};
