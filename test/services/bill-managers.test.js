const assert = require('assert');
const app = require('../../src/app');

describe('\'billManagers\' service', () => {
  it('registered the service', () => {
    const service = app.service('bill-managers');

    assert.ok(service, 'Registered the service');
  });
});
