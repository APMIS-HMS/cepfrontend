module.exports = function (app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, {
    connection
  }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(channel);
      // app.channel(`userIds/$(user.id}`).join(channel);
    }
  });

  // app.publish((data, hook) => { // eslint-disable-line no-unused-vars
  //   // Here you can add event publishers to channels set up in `channels.js`
  //   // To publish only for a specific event use `app.publish(eventname, () => {})`

  //   // e.g. to publish all service events to all authenticated users use
  //   // return app.channel('authenticated');
  // });

  // Here you can also add service specific event publishers
  // e..g the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
  // app.service('facilities').publish((data, context) => {
  //   return app.channel(data._id);
  // });
  app.service('facilities').publish((data) => {
    return app.channel(data._id);
  });
  app.service('patients').publish('created', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('patients').publish('patched', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('patients').publish('updated', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('employees').publish('created', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('doc-upload').publish('created', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('people').publish('updated', (data, context) => {
    if (context.params.query !== undefined) {
      if (context.params.query.facilityId !== undefined) {
        return app.channel(context.params.query.facilityId);
      }
    }
  });
  app.service('people').publish('patched', (data, context) => {
    if (context.params.query !== undefined) {
      if (context.params.query.facilityId !== undefined) {
        return app.channel(context.params.query.facilityId);
      }
    }
  });
  app.service('facility-roles').publish('created', (data, context) => {
    return app.channel(context.params.query.facilityId);
  });
  app.service('appointments').publish('updated', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('documentations').publish('updated', (data, context) => {
    if (context.params.query !== undefined && context.params.query.facilityId !== undefined) {
      return app.channel(context.params.query.facilityId);
    }
  });
  app.service('investigations').publish('updated', (data) => {
    return app.channel(data.facilityId);
  });
  app.service('investigations').publish('created', (data) => {
    return app.channel(data.facilityId);
  });

};
