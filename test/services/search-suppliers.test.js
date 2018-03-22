const assert = require('assert');
const app = require('../../src/app');

describe('\'search-suppliers\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-suppliers');

    assert.ok(service, 'Registered the service');
  });
});
