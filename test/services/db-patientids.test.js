const assert = require('assert');
const app = require('../../src/app');

describe('\'db-patientids\' service', () => {
  it('registered the service', () => {
    const service = app.service('db-patientids');

    assert.ok(service, 'Registered the service');
  });
});
