const assert = require('assert');
const app = require('../../src/app');

describe('\'inPatients\' service', () => {
  it('registered the service', () => {
    const service = app.service('in-patients');

    assert.ok(service, 'Registered the service');
  });
});
