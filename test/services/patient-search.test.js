const assert = require('assert');
const app = require('../../src/app');

describe('\'patient-search\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient-search');

    assert.ok(service, 'Registered the service');
  });
});
