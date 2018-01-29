const assert = require('assert');
const app = require('../../src/app');

describe('\'save-facility\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-facility');

    assert.ok(service, 'Registered the service');
  });
});
