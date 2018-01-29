/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    logger.info(params);
    // logger.info(data);
    // this.app.channel('anonymous').leave(connection);

    // Add it to the authenticated user channel
    // app.channel('authenticated').join(connection);

    // const userFive = this.app.channel('authenticated').connections
    //   .filter(connection => connection.user.userId === data.userId);

    // logger.info(userFive.length);
    // logger.info(userFive);

    let cons = this.app.channel('authenticated').connections;
    let consFilter = cons.filter(connect => connect.user._id.toString() === data.userId.toString());

    let loggedInConnection;
    if (consFilter.length > 0) {
      loggedInConnection = consFilter[0];
      let channel = this.app.channel(data._id);
      let authenticatedChannel = this.app.channel('authenticated');
      authenticatedChannel.leave(loggedInConnection);
      channel.join(loggedInConnection);
      // logger.info(channel.connections);
    }
    // logger.info(this.app.channel('authenticated').connections);
    
    let result = this.app.channels;
    return Promise.resolve({
      result
    });
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
