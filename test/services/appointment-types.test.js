const assert = require('assert');
const app = require('../../src/app');

describe('\'appointmentTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('appointment-types');

    assert.ok(service, 'Registered the service');
  });
});
