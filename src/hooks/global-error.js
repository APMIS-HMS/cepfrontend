// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
// const logger = require('winston');
// const errors = require('@feathersjs/errors');
module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
    return context => {
        // // context.error = null;
        // if (context.error !== undefined) {
        //   logger.error(`Error in '${context.path}' service method '${context.method}`, context.error.message);
        //   context.error = context.error.toJSON();
        // // }
        // if(context.error){
        //   logger.error('memmmm');
        //   // const existing = new errors.GeneralError(new Error('I exist'));
        //   context.error = null;
        //   return Promise.reject({ test: 'woops!' });
        // }
        // logger.error(context.error);
        // context.apmis = context.data;
        return Promise.reject(context);
    };
};