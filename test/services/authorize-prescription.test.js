const assert = require('assert');
const app = require('../../src/app');

describe('\'authorize-prescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('authorize-prescription');

    assert.ok(service, 'Registered the service');
  });
});
