const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-initialisers\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-initialisers');

    assert.ok(service, 'Registered the service');
  });
});
