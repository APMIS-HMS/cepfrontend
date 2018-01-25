const assert = require('assert');
const app = require('../../src/app');

describe('\'generate-user\' service', () => {
  it('registered the service', () => {
    const service = app.service('generate-user');

    assert.ok(service, 'Registered the service');
  });
});
