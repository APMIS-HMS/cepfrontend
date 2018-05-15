const assert = require('assert');
const app = require('../../src/app');

describe('\'immunization-records\' service', () => {
  it('registered the service', () => {
    const service = app.service('immunization-records');

    assert.ok(service, 'Registered the service');
  });
});
