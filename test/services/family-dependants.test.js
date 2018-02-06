const assert = require('assert');
const app = require('../../src/app');

describe('\'family-dependants\' service', () => {
  it('registered the service', () => {
    const service = app.service('family-dependants');

    assert.ok(service, 'Registered the service');
  });
});
