const assert = require('assert');
const app = require('../../src/app');

describe('\'supplier-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('supplier-service');

    assert.ok(service, 'Registered the service');
  });
});
