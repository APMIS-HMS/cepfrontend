const assert = require('assert');
const app = require('../../src/app');

describe('\'save-appointment\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-appointment');

    assert.ok(service, 'Registered the service');
  });
});
