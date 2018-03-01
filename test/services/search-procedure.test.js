const assert = require('assert');
const app = require('../../src/app');

describe('\'search-procedure\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-procedure');

    assert.ok(service, 'Registered the service');
  });
});
