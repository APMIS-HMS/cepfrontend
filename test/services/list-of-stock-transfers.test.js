const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-stock-transfers\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-stock-transfers');

    assert.ok(service, 'Registered the service');
  });
});
