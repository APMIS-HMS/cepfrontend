const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-products');

    assert.ok(service, 'Registered the service');
  });
});
