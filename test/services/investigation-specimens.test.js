const assert = require('assert');
const app = require('../../src/app');

describe('\'investigation-specimens\' service', () => {
  it('registered the service', () => {
    const service = app.service('investigation-specimens');

    assert.ok(service, 'Registered the service');
  });
});
