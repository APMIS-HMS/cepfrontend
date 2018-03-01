const assert = require('assert');
const app = require('../../src/app');

describe('\'dispense-prescriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('dispense-prescriptions');

    assert.ok(service, 'Registered the service');
  });
});
