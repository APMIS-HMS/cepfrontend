const assert = require('assert');
const app = require('../../src/app');

describe('\'getPrescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-prescription');

    assert.ok(service, 'Registered the service');
  });
});
