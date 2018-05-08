const assert = require('assert');
const app = require('../../src/app');

describe('\'get-server-time\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-server-time');

    assert.ok(service, 'Registered the service');
  });
});
