const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityClasses\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-classes');

    assert.ok(service, 'Registered the service');
  });
});
