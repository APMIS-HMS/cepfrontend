const assert = require('assert');
const app = require('../../src/app');

describe('\'immunization_schedule\' service', () => {
  it('registered the service', () => {
    const service = app.service('immunization-schedule');

    assert.ok(service, 'Registered the service');
  });
});
