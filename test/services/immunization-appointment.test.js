const assert = require('assert');
const app = require('../../src/app');

describe('\'immunizationAppointment\' service', () => {
  it('registered the service', () => {
    const service = app.service('immunization-appointment');

    assert.ok(service, 'Registered the service');
  });
});
