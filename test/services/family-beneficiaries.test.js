const assert = require('assert');
const app = require('../../src/app');

describe('\'family-beneficiaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('family-beneficiaries');

    assert.ok(service, 'Registered the service');
  });
});
