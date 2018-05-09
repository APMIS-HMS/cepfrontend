const assert = require('assert');
const app = require('../../src/app');

describe('\'bulk-patient-upload\' service', () => {
  it('registered the service', () => {
    const service = app.service('bulk-patient-upload');

    assert.ok(service, 'Registered the service');
  });
});
