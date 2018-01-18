const assert = require('assert');
const app = require('../../src/app');

describe('\'externalPrescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('external-prescriptions');

    assert.ok(service, 'Registered the service');
  });
});
