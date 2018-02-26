const assert = require('assert');
const app = require('../../src/app');

describe('\'patientfluids\' service', () => {
  it('registered the service', () => {
    const service = app.service('patientfluids');

    assert.ok(service, 'Registered the service');
  });
});
