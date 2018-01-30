const assert = require('assert');
const app = require('../../src/app');

describe('\'search-people\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-people');

    assert.ok(service, 'Registered the service');
  });
});
