const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-inventories\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-inventories');

    assert.ok(service, 'Registered the service');
  });
});
